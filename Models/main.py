import face_recognition
import cv2
import numpy as np
import base64
from pymongo import MongoClient
from datetime import datetime
import time
import logging
from bson import ObjectId
from tensorflow.keras.models import load_model

# MongoDB Setup
uri = "mongodb+srv://201400124NBvU2EnmcplQkKEX:<db_password>@smartgazecluster.isawc.mongodb.net/?retryWrites=true&w=majority&appName=smartgazeCluster"
uri = uri.replace("<db_password>", "NBvU2EnmcplQkKEX")
client = MongoClient(uri)

# Select the database and collections
db = client['test']
users_collection = db['users']
attendance_collection = db['attendances']
settings_collection = db['customizations']
classes_collection = db['classes']
emotions_collection = db['emotions']  # New collection for emotions

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Encode all the profile images of the students
known_face_encodings = []
known_face_names = []
student_ids = []

# Load pre-trained emotion detection model
emotion_model = load_model('emotiondetector.h5')  # Ensure the path is correct
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

def load_students_and_faces(student_ids):
    global known_face_encodings, known_face_names
    
    # Clear the existing known faces
    known_face_encodings = []
    known_face_names = []
    
    # Fetch students from MongoDB
    students = users_collection.find({"_id": {"$in": student_ids}})
    
    for student in students:
        student_id = str(student["_id"])
        name = student["name"]
        profile_pic_base64 = student.get("profilePic", "")
        
        if not profile_pic_base64:
            continue

        # Remove data prefix and decode image
        if profile_pic_base64.startswith('data:image/'):
            profile_pic_base64 = profile_pic_base64.split(',')[1]
        
        profile_pic_base64 = profile_pic_base64.strip()
        
        try:
            image_data = base64.b64decode(profile_pic_base64)
            np_img = np.frombuffer(image_data, np.uint8)
            image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
            if image is None:
                continue
        except Exception as e:
            logging.error(f"Error decoding image for {name}: {e}")
            continue

        face_encodings = face_recognition.face_encodings(image)
        if len(face_encodings) > 0:
            known_face_encodings.append(face_encodings[0])
            known_face_names.append(name)
            student_ids.append(student_id)

    logging.info(f"Loaded {len(known_face_names)} known faces for the course.")

# Mark attendance for individual image captures
def mark_attendance_for_image(student_id):
    current_time = datetime.now()
    date_today = current_time.strftime("%Y-%m-%d")

    # Increment attendance presence for this student
    attendance_collection.update_one(
        {"student_id": student_id, "date": date_today},
        {"$inc": {"present_count": 1}},  # Increment present count
        upsert=True
    )

# Store emotions in separate collection
def store_emotion_data(student_id, emotion_label, course_id):
    current_time = datetime.now()

    # Insert emotion data into the emotions collection
    emotions_collection.insert_one({
        "student_id": student_id,
        "course_id": course_id,
        "emotion": emotion_label,
        "timestamp": current_time
    })

    logging.info(f"Stored emotion {emotion_label} for student {student_id}")

# Calculate final attendance based on threshold
def calculate_final_attendance(total_images, threshold, course_id):
    for student_id in student_ids:
        student_attendance = attendance_collection.find_one({"student_id": student_id, "course_id": course_id})
        present_count = student_attendance.get("present_count", 0)
        percentage_present = (present_count / total_images) * 100

        status = "Present" if percentage_present >= threshold else "Absent"
        logging.info(f"Student {student_id} is marked as {status} (Present in {percentage_present}% of images)")
        
        # Update final attendance status in the database
        attendance_collection.update_one(
            {"student_id": student_id, "course_id": course_id},
            {"$set": {"is_present": status == "Present"}}
        )

# Recognize faces, detect emotions, and mark attendance
def recognize_faces_and_detect_emotions(frame, course_id):
    face_locations = face_recognition.face_locations(frame)
    face_encodings = face_recognition.face_encodings(frame, face_locations)

    for face_encoding, face_location in zip(face_encodings, face_locations):
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
        best_match_index = np.argmin(face_distances)

        if matches[best_match_index]:
            student_id = student_ids[best_match_index]
            
            # Crop the face for emotion detection
            top, right, bottom, left = face_location
            face_image = frame[top:bottom, left:right]
            face_image_resized = cv2.resize(face_image, (48, 48))  # Resize to fit the emotion model input size
            face_image_gray = cv2.cvtColor(face_image_resized, cv2.COLOR_BGR2GRAY)  # Convert to grayscale
            face_image_gray = np.expand_dims(face_image_gray, axis=(0, -1)) / 255.0  # Normalize and reshape for the model
            
            # Predict emotion
            emotion_prediction = emotion_model.predict(face_image_gray)
            emotion_label = emotion_labels[np.argmax(emotion_prediction)]
            
            # Mark attendance and store emotion
            mark_attendance_for_image(student_id)
            store_emotion_data(student_id, emotion_label, course_id)

            # Print attendance status and emotion
            print(f"Student ID: {student_id}, Emotion: {emotion_label}")
            return student_id, emotion_label  # Return for further processing
        else:
            logging.info("Unknown face detected.")
            return None, None  # Return None if no match found
        
# Capture image from camera (mobile camera URL example)
def capture_image_from_mobile_camera():
    camera_url = 'http://192.168.100.2:8080/video'
    cap = cv2.VideoCapture(camera_url)
    if not cap.isOpened():
        logging.error("Could not open camera.")
        return None
    ret, frame = cap.read()
    cap.release()
    return frame if ret else None

# Get image interval and threshold from settings
def get_settings():
    settings = settings_collection.find_one()
    image_interval = settings.get("imageInterval", 10) * 60  # in seconds
    threshold = settings.get("threshold", 50)  # percentage
    return image_interval, threshold

# Check class schedule every 5 seconds
def check_class_schedule():
    while True:
        current_time = datetime.now().time()
        current_day = datetime.now().strftime("%A")
        logging.info(f"Checking class schedule for {current_day} at {datetime.now()}")  # Log current check

        class_info = classes_collection.find_one({"schedule.day": current_day})

        if class_info:
            for schedule in class_info["schedule"]:
                start_time_str, end_time_str = schedule["timeSlot"].split(" - ")
                start_time = datetime.strptime(start_time_str, "%H:%M").time()
                end_time = datetime.strptime(end_time_str, "%H:%M").time()
                if start_time <= current_time <= end_time:
                    course_code = schedule["courseCode"]
                    logging.info(f"Class detected for {course_code}. Fetching enrolled students.")

                    # Fetch student IDs enrolled in the course
                    course = next(course for course in class_info["courses"] if course["courseCode"] == course_code)
                    enrolled_student_ids = [ObjectId(student_id) for student_id in course["students"]]

                    # Load students and their face encodings
                    load_students_and_faces(enrolled_student_ids)

                    image_interval, threshold = get_settings()
                    capture_and_process_images(course_code, end_time, image_interval, threshold)
                else:
                    logging.info("No class scheduled at this time.")  # Log without course_code reference
        else:
            logging.info(f"No classes scheduled for today ({current_day})")

        time.sleep(5)  # Check again after 5 seconds

# Capture and process images based on interval and threshold
def capture_and_process_images(course_id, class_end_time, image_interval, threshold):
    total_images = 0
    end_time_reached = False

    while not end_time_reached:
        # Check if the current time exceeds the class end time
        if datetime.now().time() > class_end_time:
            logging.info(f"Class has ended. Total images taken: {total_images}")
            end_time_reached = True
            break  # Exit the loop when class ends

        # Calculate the time remaining until class end
        time_remaining = (datetime.combine(datetime.today(), class_end_time) - datetime.now()).total_seconds()

        # If there's not enough time to wait for the next image interval, break and check for the next schedule
        if time_remaining < image_interval:
            logging.info(f"Not enough time remaining ({time_remaining} seconds) to wait for the next image capture.")
            end_time_reached = True
            break

        # Capture image from camera
        frame = capture_image_from_mobile_camera()
        if frame is not None:
            # Recognize faces and detect emotions
            student_id, emotion_label = recognize_faces_and_detect_emotions(frame, course_id)
            total_images += 1
            
            # Print status for each image captured
            if student_id is not None:
                attendance_status = "Present"  # Assume present if a match was found
                print(f"Image {total_images}: Attendance Status - {attendance_status}, Emotion Status - {emotion_label}")
            else:
                print(f"Image {total_images}: No student recognized.")
        else:
            logging.error("Failed to capture image.")

        # Wait for the specified image interval
        time.sleep(image_interval)

        # After capturing an image, check if the current time exceeds the class end time again
        if datetime.now().time() > class_end_time:
            logging.info(f"Class has ended. Total images taken: {total_images}")
            end_time_reached = True
            break  # Exit the loop when class ends

    # Calculate final attendance at the end of the class
    calculate_final_attendance(total_images, threshold, course_id)

# Start checking the class schedule
if __name__ == "__main__":
    check_class_schedule()

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

# Updated global variable to store student name mapping
student_name_map = {}

def load_students_and_faces(enrolled_student_ids):
    global known_face_encodings, known_face_names, student_name_map
    
    # Clear the existing known faces
    known_face_encodings = []
    known_face_names = []
    student_ids.clear()  # Clear the student_ids to avoid carrying over old IDs
    student_name_map.clear()  # Clear the previous name map
    
    # Fetch students from MongoDB
    students = users_collection.find({"_id": {"$in": enrolled_student_ids}})
    
    for student in students:
        student_id = str(student["_id"])  # Ensure it's a string
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
            student_name_map[student_id] = name  # Store name with ID as key

    logging.info(f"Loaded {len(known_face_names)} known faces for the course.")

# Updated mark_absent_students function
def mark_absent_students(enrolled_student_ids, course_code):
    current_time = datetime.now()
    date_today = current_time.strftime("%Y-%m-%d")
    
    for student_id in enrolled_student_ids:
        str_student_id = str(student_id)  # Convert ObjectId to string
        attendance_collection.insert_one({
            "student_id": str_student_id,
            "course_id": course_code,
            "date": date_today,
            "present_count": 0,  # Initially mark as absent
            "is_present": False,
            "name": student_name_map.get(str_student_id, "Unknown"),  # Get student name from the map
            "day": current_time.strftime("%A"),
            "time_slot": "",  # Placeholder; will be filled during the final evaluation
        })

    logging.info(f"Marked all enrolled students as absent for course {course_code}.")

# Mark attendance for recognized student
def mark_attendance_for_image(student_id):
    current_time = datetime.now()
    date_today = current_time.strftime("%Y-%m-%d")
    
    # Increment attendance presence for this student
    result = attendance_collection.update_one(
        {"student_id": student_id, "date": date_today},
        {"$inc": {"present_count": 1}},  # Increment present count
        upsert=True
    )
    logging.info(f"Attendance updated for {student_id} on {date_today}. Modified count: {result.modified_count}")

# Store emotion data for the recognized student
def store_emotion_data(student_id, emotion_label, course_id):
    current_time = datetime.now()
    
    emotions_collection.insert_one({
        "student_id": student_id,
        "course_id": course_id,
        "emotion": emotion_label,
        "timestamp": current_time
    })
    logging.info(f"Stored emotion {emotion_label} for student {student_id}")

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
    image_interval = settings.get("imageInterval", 10)
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

                    # Mark all enrolled students as absent in MongoDB
                    mark_absent_students(enrolled_student_ids, course_code)

                    image_interval, threshold = get_settings()
                    capture_and_process_images(course_code, end_time, image_interval, threshold)
                else:
                    logging.info("No ongoing class at this time.")
        else:
            logging.info("No classes scheduled today.")

        time.sleep(5)  # Wait for 5 seconds before checking again

def recognize_faces_and_detect_emotions(frame):
    face_locations = face_recognition.face_locations(frame)
    face_encodings = face_recognition.face_encodings(frame, face_locations)

    if not face_encodings:  # No faces detected
        return None, "No face detected"  # Return None and a message

    for face_encoding, face_location in zip(face_encodings, face_locations):
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
        best_match_index = np.argmin(face_distances)

        if matches[best_match_index]:
            student_id = student_ids[best_match_index]

            # Crop the face for emotion detection
            top, right, bottom, left = face_location
            face_image = frame[top:bottom, left:right]
            face_image_resized = cv2.resize(face_image, (48, 48))
            face_image_gray = cv2.cvtColor(face_image_resized, cv2.COLOR_BGR2GRAY)
            face_image_gray = np.expand_dims(face_image_gray, axis=(0, -1)) / 255.0

            # Predict emotion
            emotion_prediction = emotion_model.predict(face_image_gray)
            emotion_label = emotion_labels[np.argmax(emotion_prediction)]

            return student_id, emotion_label  # Return both values

    return None, "No match found"  # If no matches found, return None

def capture_and_process_images(course_code, end_time, image_interval, threshold):
    image_count = 0  # Counter for captured images

    while datetime.now().time() <= end_time:
        frame = capture_image_from_mobile_camera()
        if frame is not None:
            image_count += 1  # Increment image count
            student_id, emotion_label = recognize_faces_and_detect_emotions(frame)

            # Log image capture and processing results
            logging.info(f"Image {image_count} captured. Student ID: {student_id}, Emotion: {emotion_label}")

            if student_id:
                mark_attendance_for_image(student_id)
                store_emotion_data(student_id, emotion_label, course_code)

        # Wait for the specified interval before capturing the next image
        time.sleep(image_interval)  # Convert minutes to seconds

    logging.info(f"Finished capturing {image_count} images for course {course_code}.")

# Start the class schedule checking
check_class_schedule()

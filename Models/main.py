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
classes_collection = db['classes']
emotions_collection = db['emotions']  # Collection for emotions

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load pre-trained emotion detection model
emotion_model = load_model('emotiondetector.h5')  # Ensure the path is correct
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

# Global variables
known_face_encodings = []
known_face_names = []
student_ids = []
student_name_map = {}

def load_students_and_faces(enrolled_student_ids):
    global known_face_encodings, known_face_names, student_ids, student_name_map
    
    known_face_encodings.clear()
    known_face_names.clear()
    student_ids.clear()
    student_name_map.clear()
    
    students = users_collection.find({"_id": {"$in": enrolled_student_ids}})
    
    for student in students:
        student_id = str(student["_id"])  # Convert ObjectId to string
        name = student["name"]
        profile_pic_base64 = student.get("profilePic", "")
        
        if not profile_pic_base64:
            continue
        
        # Decode the profile image
        try:
            if profile_pic_base64.startswith('data:image/'):
                profile_pic_base64 = profile_pic_base64.split(',')[1]
            profile_pic_base64 = profile_pic_base64.strip()
            image_data = base64.b64decode(profile_pic_base64)
            np_img = np.frombuffer(image_data, np.uint8)
            image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
            if image is None:
                continue
            
            face_encodings = face_recognition.face_encodings(image)
            if face_encodings:
                known_face_encodings.append(face_encodings[0])
                known_face_names.append(name)
                student_ids.append(student_id)
                student_name_map[student_id] = name
        
        except Exception as e:
            logging.error(f"Error decoding image for {name}: {e}")

    logging.info(f"Loaded {len(known_face_names)} known faces.")

def mark_absent_students(enrolled_student_ids, course_code, time_slot):
    current_time = datetime.now()
    date_today = current_time.strftime("%Y-%m-%d")

    # Fetch class information to get class_id and teacher_id
    class_info = classes_collection.find_one({"courses.courseCode": course_code})
    print("Class Info", class_info)
    if not class_info:
        logging.error(f"No class found for course code: {course_code}")
        return

    class_id = class_info['_id']  # Get the class ID
    teacher_id = class_info.get('teacher', '')  # Assuming teacher_id is stored in class_info
    
    attendance_collection.insert_one({
        "class_id": class_id,
        "courseCode": course_code,
        "teacher_id": teacher_id,
        "date": date_today,
        "timeSlot": time_slot,  # Store the time slot
        "present": 0,
        "absent": len(enrolled_student_ids),
        "studentsPresent": [],
        "studentsAbsent": [str(student_id) for student_id in enrolled_student_ids],
    })

    logging.info(f"Marked all enrolled students as absent for course {course_code}.")

def mark_attendance_for_image(student_id, attendance_count):
    # Increment the attendance count for the student
    attendance_count[student_id] = attendance_count.get(student_id, 0) + 1

def store_emotion_data(student_id, emotion_label, course_id):
    current_time = datetime.now()
    emotions_collection.insert_one({
        "student_id": student_id,
        "course_id": course_id,
        "emotion": emotion_label,
        "timestamp": current_time
    })
    logging.info(f"Stored emotion {emotion_label} for student {student_id}")

def capture_image_from_mobile_camera():
    camera_url = 'http://192.168.100.2:8080/video'  # Replace with your camera URL
    cap = cv2.VideoCapture(camera_url)
    if not cap.isOpened():
        logging.error("Could not open camera.")
        return None
    ret, frame = cap.read()
    cap.release()
    return frame if ret else None

def get_settings():
    settings = db['customizations'].find_one()
    if settings is None:
        logging.warning("No settings document found. Using default values.")
        return 10, 50  # Return default values if no settings found
    image_interval = settings.get("imageInterval", 10)
    threshold = settings.get("threshold", 50)
    return image_interval, threshold

def check_class_schedule():
    while True:
        current_time = datetime.now().time()
        current_day = datetime.now().strftime("%A")
        logging.info(f"Checking class schedule for {current_day} at {datetime.now()}")

        class_info = classes_collection.find_one({"schedule.day": current_day})

        if class_info:
            for schedule in class_info["schedule"]:
                start_time_str, end_time_str = schedule["timeSlot"].split(" - ")
                start_time = datetime.strptime(start_time_str, "%H:%M").time()
                end_time = datetime.strptime(end_time_str, "%H:%M").time()

                if start_time <= current_time <= end_time:
                    course_code = schedule["courseCode"]
                    time_slot = schedule["timeSlot"]  
                    
                    logging.info(f"Class detected for {course_code} at {time_slot}. Fetching enrolled students.")

                    course = next(course for course in class_info["courses"] if course["courseCode"] == course_code)
                    enrolled_student_ids = [ObjectId(student_id) for student_id in course["students"]]

                    # Mark all students as absent and pass the time slot
                    mark_absent_students(enrolled_student_ids, course_code, time_slot)

                    # Load students and faces
                    load_students_and_faces(enrolled_student_ids)

                    # Insert a new attendance document and get its ID
                    attendance_doc = attendance_collection.find_one({
                        "courseCode": course_code,
                        "date": datetime.now().strftime("%Y-%m-%d")
                    })

                    # If the attendance document does not exist, create one with timeSlot
                    if not attendance_doc:
                        attendance_doc_id = attendance_collection.insert_one({
                            "class_id": None,  # Placeholder, can be updated later
                            "courseCode": course_code,
                            "teacher_id": None,  # Placeholder, can be updated later
                            "date": datetime.now().strftime("%Y-%m-%d"),
                            "timeSlot": time_slot,  # Store the time slot
                            "present": 0,
                            "absent": len(enrolled_student_ids),
                            "studentsPresent": [],
                            "studentsAbsent": [str(student_id) for student_id in enrolled_student_ids]
                        }).inserted_id
                    else:
                        attendance_doc_id = attendance_doc['_id']

                    image_interval, threshold = get_settings()
                    capture_and_process_images(course_code, end_time, image_interval, threshold, attendance_doc_id, enrolled_student_ids)
                else:
                    logging.info("No ongoing class at this time.")
        else:
            logging.info("No classes scheduled today.")

        time.sleep(5)  # Check every 5 seconds

def recognize_faces_and_detect_emotions(frame):
    face_locations = face_recognition.face_locations(frame)
    face_encodings = face_recognition.face_encodings(frame, face_locations)

    if not face_encodings:
        return None, "No face detected"

    for face_encoding, face_location in zip(face_encodings, face_locations):
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
        best_match_index = np.argmin(face_distances)

        if matches[best_match_index]:
            student_id = student_ids[best_match_index]
            return student_id, face_location  # Return student_id and face location

    return None, "No match found"

def capture_and_process_images(course_code, end_time, image_interval, threshold, attendance_doc_id, enrolled_student_ids):
    image_count = 0
    attendance_count = {}  # Dictionary to track attendance counts for each student

    while datetime.now().time() <= end_time:
        frame = capture_image_from_mobile_camera()
        if frame is not None:
            image_count += 1
            student_id, face_location = recognize_faces_and_detect_emotions(frame)

            if student_id:
                mark_attendance_for_image(student_id, attendance_count)  # Increment count for present students
                # Emotion detection logic
                top, right, bottom, left = face_location
                face_image = frame[top:bottom, left:right]
                face_image_resized = cv2.resize(face_image, (48, 48))
                face_image_gray = cv2.cvtColor(face_image_resized, cv2.COLOR_BGR2GRAY)
                face_image_gray = np.expand_dims(face_image_gray, axis=(0, -1)) / 255.0
                emotion_prediction = emotion_model.predict(face_image_gray)
                emotion_label = emotion_labels[np.argmax(emotion_prediction)]
                store_emotion_data(student_id, emotion_label, course_code)

            logging.info(f"Image {image_count} captured. Student ID: {student_id}")

        time.sleep(image_interval)

    logging.info(f"Finished capturing {image_count} images for course {course_code}.")

    # Calculate attendance percentage and update the database
    for student_id in enrolled_student_ids:
        present_count = attendance_count.get(str(student_id), 0)
        attendance_percentage = (present_count / image_count) * 100 if image_count > 0 else 0

        if attendance_percentage >= threshold:
            attendance_collection.update_one(
                {"_id": attendance_doc_id},
                {"$addToSet": {"studentsPresent": str(student_id)},
                 "$pull": {"studentsAbsent": str(student_id)},
                 "$inc": {"present": 1, "absent": -1}}
            )
            logging.info(f"Student {student_id} marked as present with {attendance_percentage:.2f}% attendance.")

# Start checking the class schedule
check_class_schedule()

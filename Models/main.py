import face_recognition
import cv2
import numpy as np
import base64
from keras.models import load_model
from pymongo import MongoClient
from datetime import datetime
import time

# Step 1: MongoDB Setup
uri = "mongodb+srv://201400124NBvU2EnmcplQkKEX:<db_password>@smartgazecluster.isawc.mongodb.net/?retryWrites=true&w=majority&appName=smartgazeCluster"
uri = uri.replace("<db_password>", "NBvU2EnmcplQkKEX")
client = MongoClient(uri)

# Select the database and collections
db = client['test']
users_collection = db['users']
attendance_collection = db['attendance']
emotion_collection = db['emotion']

# Step 2: Encode all the profile images of the students
known_face_encodings = []
known_face_names = []
student_ids = []

# Fetch students from MongoDB
students = users_collection.find({"role": "student"})

for student in students:
    student_id = str(student["_id"])
    name = student["name"]
    profile_pic_base64 = student["profilePic"]  # Assuming it's a Base64 string
    print(f"Processing student: {name} with ID: {student_id}")

    # Check for an empty Base64 string
    if not profile_pic_base64:
        print("No Base64 image found for this student.")
        continue

    # Optional: Remove the data prefix if present
    if profile_pic_base64.startswith('data:image/jpeg;base64,'):
        profile_pic_base64 = profile_pic_base64.split(',')[1]

    # Strip whitespace/newlines from Base64 string
    profile_pic_base64 = profile_pic_base64.strip()

    # Decode the Base64 string to bytes
    try:
        image_data = base64.b64decode(profile_pic_base64)
    except Exception as e:
        print(f"Error decoding Base64 string: {e}")
        continue

    # Convert bytes to a numpy array
    np_img = np.frombuffer(image_data, np.uint8)

    # Decode the image from the numpy array
    image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    # Check if image was successfully decoded
    if image is None:
        print("Image decoding failed. Image shape is None.")
        continue

    print(f"Image shape for {name}: {image.shape}")

    # Check if face encodings can be created
    face_encodings = face_recognition.face_encodings(image)

    if len(face_encodings) > 0:
        known_face_encodings.append(face_encodings[0])
        known_face_names.append(name)
        student_ids.append(student_id)
    else:
        print(f"No face encodings found for {name}.")

print(f"Loaded {len(known_face_names)} known faces from MongoDB.")

# Load pre-trained emotion detection model
emotion_model = load_model('emotiondetector.h5')
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

# Step 3: Perform Face Recognition and Mark Attendance
def detect_emotion(face_image):
    gray_face = cv2.cvtColor(face_image, cv2.COLOR_BGR2GRAY)
    resized_face = cv2.resize(gray_face, (48, 48))  # Emotion model input size
    img_pixels = np.expand_dims(np.expand_dims(resized_face, -1), 0)

    # Convert to float32 for normalization
    img_pixels = img_pixels.astype('float32') / 255.0  # Normalize image

    emotion_predictions = emotion_model.predict(img_pixels)
    max_index = np.argmax(emotion_predictions[0])
    return emotion_labels[max_index]

def mark_attendance_and_emotion(student_id, name, emotio):
    current_time = datetime.now()
    date_today = current_time.strftime("%Y-%m-%d")
    time_now = current_time.strftime("%H:%M:%S")
    
    # Save Attendance
    attendance_collection.insert_one({
        "student_id": student_id,
        "name": name,
        "date": date_today,
        "time": time_now
    })
    
    # Save Emotion
    emotion_collection.insert_one({
        "student_id": student_id,
        "name": name,
        "date": date_today,
        "time": time_now,
        "emotion": emotion
    })

def recognize_face_and_mark_attendance(image_path):
    unknown_image = face_recognition.load_image_file(image_path)
    face_locations = face_recognition.face_locations(unknown_image)
    face_encodings = face_recognition.face_encodings(unknown_image, face_locations)

    if len(face_encodings) == 0:
        print("No faces detected in the image.")
        return
    
    for face_encoding, face_location in zip(face_encodings, face_locations):
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)

        if len(face_distances) == 0:
            print("No known faces to compare.")
            continue
        
        best_match_index = np.argmin(face_distances)
        
        if matches[best_match_index]:
            name = known_face_names[best_match_index]
            student_id = student_ids[best_match_index]
            top, right, bottom, left = face_location
            face_image = unknown_image[top:bottom, left:right]
            emotion = detect_emotion(face_image)
            mark_attendance_and_emotion(student_id, name, emotion)
            print(f"Attendance marked for {name}. Emotion: {emotion}")
        else:
            print("Unknown face detected")

def run_system(interval_seconds):
    while True:
        image_path = 'unknown_faces/captured_image.jpg'  # Adjust this path as needed
        recognize_face_and_mark_attendance(image_path)
        time.sleep(interval_seconds)

# Example: Run the system with an interval of 10 seconds
run_system(interval_seconds=10)

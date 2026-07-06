from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from PIL import Image
import io
import json

app = FastAPI(title="NeuroVision Diagnostic API")

# Allow the frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading models...")
rf_model = joblib.load("models/model.pkl")
scaler = joblib.load("models/scaler.pkl")
columns = joblib.load("models/columns.pkl")
encoders = joblib.load("models/encoders.pkl")
cnn_model = tf.keras.models.load_model("models/best_image_model.keras")
print("✅ Models loaded!")

def predict_from_questionnaire(patient_data_dict):
    df = pd.DataFrame([patient_data_dict])
    
    # Handle missing columns safely
    for col in columns:
        if col not in df:
            if col in encoders:
                df[col] = encoders[col].classes_[0]
            else:
                df[col] = 0
                
    df = df[columns]
    
    # Encode categoricals
    for col in df.columns:
        if col in encoders:
            df[col] = encoders[col].transform(df[col].astype(str))
            
    scaled_data = scaler.transform(df)
    scaled_df = pd.DataFrame(scaled_data, columns=columns)
    
    return float(rf_model.predict_proba(scaled_df)[0][1])

def predict_from_image(image_bytes):
    # Load image from bytes
    img = Image.open(io.BytesIO(image_bytes))
    img = img.convert('RGB') 
    img = img.resize((224, 224))
    
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    
    # The AI outputs probability of TD (Class 1).
    # We subtract from 1.0 to get the probability of ASD (Class 0).
    raw_probability = cnn_model.predict(img_array, verbose=0)[0][0]
    asd_probability = 1.0 - raw_probability
    
    return float(asd_probability)

@app.post("/predict")
async def get_prediction(
    patient_data: str = Form(...), 
    file: UploadFile = File(...)
):
    # 1. Parse the questionnaire data
    data_dict = json.loads(patient_data)
    
    # 2. Read the image file
    image_bytes = await file.read()
    
    # 3. Get predictions
    q_score = predict_from_questionnaire(data_dict)
    i_score = predict_from_image(image_bytes)
    
    # 4. Calculate final unified score
    final_score = (q_score * 0.60) + (i_score * 0.40)
    
    # 5. Determine Diagnosis
    diagnosis = "HIGH likelihood of ASD traits detected." if final_score >= 0.50 else "LOW likelihood of ASD traits detected."
    
    # Return a clean, fast JSON response without the AI summary overhead
    return {
        "questionnaire_confidence": round(q_score * 100, 2),
        "image_confidence": round(i_score * 100, 2),
        "final_confidence": round(final_score * 100, 2),
        "diagnosis": diagnosis
    }
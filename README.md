# 🧠 NeuroVision: Multi-Modal ASD Diagnostic Engine

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

NeuroVision is an advanced, multi-modal predictive screening system designed for the early detection of Autism Spectrum Disorder (ASD) traits. By combining behavioral questionnaire analysis with facial biometric CNN models, it provides a unified, weighted confidence score to assist in preliminary screening.

**⚠️ Medical Disclaimer:** This tool utilizes machine learning for predictive screening only. It is *not* a substitute for professional clinical diagnosis. Always consult a qualified medical professional or developmental pediatrician.

---

## ✨ Key Features

* **Multi-Modal AI Engine:** Combines two distinct machine learning models (Tabular Behavioral + Image Biometrics) for a more comprehensive analysis.
* **Dynamic Perspective Toggle:** The UI dynamically adjusts the AQ-10 assessment questions based on whether the user is testing themselves or a child/teen.
* **Weighted Confidence Scoring:** Implements an algorithmic blend (60% Behavioral / 40% Facial) for the final diagnostic output.
* **Real-time Telemetry Dashboard:** A sticky, interactive UI that displays confidence indices and model breakdown bars.
* **PDF Report Generation:** One-click generation of clean, printable medical reports for clinician review.

---

## 🛠️ Technology Stack

### Frontend (User Interface)
* **Framework:** React.js (Vite)
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Features:** Responsive Design, PDF styling (`print:` utilities), Glassmorphism UI.

### Backend (API & Model Serving)
* **Framework:** FastAPI (Python)
* **Server:** Uvicorn
* **Data Handling:** Pandas, NumPy
* **Image Processing:** Pillow (PIL)

### Machine Learning (Models)
* **Behavioral Model:** Random Forest Classifier (Trained on AQ-10 & Demographics). Reached ~98% AUC using SMOTE for class balancing.
* **Facial Biometric Model:** MobileNetV2 Transfer Learning (CNN). Reached ~92% accuracy with robust Data Augmentation.

---

## 🚀 Getting Started

Follow these instructions to run the project locally on your machine.

### Prerequisites
* [Node.js](https://nodejs.org/) (LTS Version) installed for the frontend.
* [Python 3.8+](https://www.python.org/downloads/) installed for the backend.

### 1. Backend Setup (FastAPI + ML Models)

Open your first terminal and navigate to your backend directory:

```bash
# Navigate to the backend folder
cd path/to/backend

# Install required Python dependencies
pip install fastapi uvicorn python-multipart joblib pandas numpy tensorflow pillow scikit-learn

# Ensure your ML models are placed in a 'models/' folder in the root directory:
# - models/model.pkl
# - models/scaler.pkl
# - models/columns.pkl
# - models/encoders.pkl
# - models/best_image_model.keras

# Start the FastAPI server
uvicorn main:app --reload

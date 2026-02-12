from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
from PIL import Image
import io

from analyze import classify_waste

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once
classifier = pipeline(
    "image-classification",
    model="google/vit-base-patch16-224"
)

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes))

    results = classifier(image)
    label = results[0]["label"]
    confidence = results[0]["score"]

    decision = classify_waste(label, confidence)

    return {
        "detected_object": label,
        "confidence": round(confidence, 2),
        **decision
    }
import os

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8000))
    )

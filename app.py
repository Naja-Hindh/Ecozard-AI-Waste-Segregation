from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
from PIL import Image
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

classifier = pipeline(
    "image-classification",
    model="google/vit-base-patch16-224"
)

def classify_waste(label):
    label = label.lower()

    recyclable = [
        "plastic", "bottle", "paper", "book", "glass",
        "can", "metal", "tin", "aluminum", "container",
        "bag", "wrapper", "packet", "foil", "pouch"
    ]

    organic = [
        "banana", "food", "fruit",
        "egg", "leaf", "flower", "peel"
    ]

    hazardous = [
        "battery", "bulb", "lamp", "light",
        "chemical", "medicine", "electronic", "spray"
    ]

    if any(word in label for word in recyclable):
        return "Recyclable"
    elif any(word in label for word in organic):
        return "Organic"
    elif any(word in label for word in hazardous):
        return "Hazardous"
    else:
        return "Uncertain"

wizard_messages = {
    "Recyclable": "✨ Recyclo Spell cast! Place this in the dry waste bin.",
    "Organic": "🌱 Naturia Charm activated! Perfect for composting.",
    "Hazardous": "⚠️ Caution Hex detected! Dispose safely.",
    "Uncertain": "🤔 My magic is unclear. Can you help choose the right category?"
}

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes))

    results = classifier(image)
    label = results[0]["label"]
    confidence = results[0]["score"]

    category = classify_waste(label)
    if confidence < 0.6:
        category = "Uncertain"

    return {
        "detected_object": label,
        "confidence": round(confidence, 2),
        "waste_category": category,
        "message": wizard_messages[category]
    }

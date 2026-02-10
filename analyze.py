import os
from transformers import pipeline
from PIL import Image

# Load pretrained image classification model
classifier = pipeline(
    "image-classification",
    model="google/vit-base-patch16-224"
)

image_folder = "images"

print("🧙‍♂️ Ecozard is analyzing waste...\n")

for img_name in os.listdir(image_folder):
    if not img_name.lower().endswith((".jpg", ".png", ".jpeg")):
        continue

    img_path = os.path.join(image_folder, img_name)
    image = Image.open(img_path)

    results = classifier(image)

    label = results[0]["label"]
    confidence = results[0]["score"]

    print(f"{img_name} → {label} ({confidence:.2f})")

def classify_waste(label):
    label = label.lower()

    recyclable = [
        "plastic", "bottle", "paper", "book", "glass",
        "can", "metal", "tin", "aluminum", "container"
    ]

    organic = [
        "banana", "vegetable", "food", "fruit",
        "egg", "peel", "leaf", "flower"
    ]

    hazardous = [
        "battery", "bulb", "lamp", "light",
        "chemical", "medicine", "electronic", "spray"
    ]

    if any(word in label for word in recyclable):
        return "♻️ Recyclable"
    elif any(word in label for word in organic):
        return "🌱 Organic"
    elif any(word in label for word in hazardous):
        return "🔮 Hazardous"
    else:
        return "❓ Uncertain"


category = classify_waste(label)

if confidence < 0.6:
    category = "❓ Uncertain"
    message = "🤔 My magic is unclear. Can you help choose the right category?"
else:
    messages = {
        "♻️ Recyclable": "✨ Recyclo Spell cast! Place it in the dry waste bin.",
        "🌱 Organic": "🌿 Naturia Charm activated! Perfect for composting.",
        "🔮 Hazardous": "⚠️ Caution Hex detected! Dispose safely.",
    }
    message = messages.get(category, "Please dispose responsibly.")

print(f"{img_name}")
print(f"  Detected: {label} ({confidence:.2f})")
print(f"  Category: {category}")
print(f"  Ecozard says: {message}\n")

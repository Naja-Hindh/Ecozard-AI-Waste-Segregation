def classify_waste(label: str, confidence: float) -> dict:
    label = label.lower()

    OBJECT_TO_WASTE = {
        # Organic
        "banana": "Organic",
        "banana peel": "Organic",
        "apple": "Organic",
        "fruit": "Organic",
        "vegetable": "Organic",
        "food": "Organic",
        "peel": "Organic",

        # Recyclable
        "plastic bottle": "Recyclable",
        "bottle": "Recyclable",
        "bottle": "Recyclable",
        "paper": "Recyclable",
        "paper cup": "Recyclable",
        "cup": "Recyclable",
        "coffee cup": "Recyclable",
        "can": "Recyclable",
        "tin": "Recyclable",
        "aluminum": "Recyclable",
        "glass": "Recyclable",

        # Hazardous
        "battery": "Hazardous",
        "bulb": "Hazardous",
        "lamp": "Hazardous",
        "medicine": "Hazardous",
        "electronic": "Hazardous",
        "spray": "Hazardous"
    }

    category = "Uncertain"

    for keyword, value in OBJECT_TO_WASTE.items():
        if keyword in label:
            category = value
            break

    # confidence-based safety
    if confidence < 0.6:
        category = "Uncertain"

    wizard_messages = {
        "Recyclable": "✨ Recyclo Spell cast! Place this in the dry waste bin.",
        "Organic": "🌱 Naturia Charm activated! Perfect for composting.",
        "Hazardous": "⚠️ Caution Hex detected! Dispose safely.",
        "Uncertain": "🤔 My magic is unclear. Can you help choose the right category?"
    }

    explanation = f"Detected '{label}' with confidence {confidence:.2f}"
    if category == "Uncertain":
        explanation = "My magic is unclear. The object could not be confidently identified."

    return {
        "waste_category": category,
        "message": wizard_messages[category],
        "explanation": explanation
    }

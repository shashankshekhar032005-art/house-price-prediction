
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load trained model
model = joblib.load("house_price_model.pkl")


# =========================================================
# HOME
# =========================================================

@app.route("/")
def home():
    return "House Price Prediction API is running!"


# =========================================================
# PREDICTION
# =========================================================

@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    # -----------------------------------------------------
    # Create house dataframe
    # -----------------------------------------------------

    house_data = pd.DataFrame([{
        "area": data["area"],
        "bedrooms": data["bedrooms"],
        "bathrooms": data["bathrooms"],
        "stories": data["stories"],
        "mainroad": data["mainroad"],
        "guestroom": data["guestroom"],
        "basement": data["basement"],
        "hotwaterheating": data["hotwaterheating"],
        "airconditioning": data["airconditioning"],
        "parking": data["parking"],
        "prefarea": data["prefarea"],
        "furnishingstatus": data["furnishingstatus"]
    }])

    # -----------------------------------------------------
    # Original prediction
    # -----------------------------------------------------

    original_prediction = float(
        model.predict(house_data)[0]
    )


    # =====================================================
    # FEATURE IMPACT
    # =====================================================

    feature_impacts = []


    # -----------------------------------------------------
    # Helper function
    # -----------------------------------------------------

    def calculate_impact(feature_name, modified_data, display_value):

        changed_prediction = float(
            model.predict(modified_data)[0]
        )

        impact = original_prediction - changed_prediction

        feature_impacts.append({
            "feature": feature_name,
            "value": display_value,
            "impact": round(impact, 2)
        })


    # =====================================================
    # AREA
    # =====================================================

    modified = house_data.copy()

    modified["area"] = modified["area"] * 0.8

    calculate_impact(
        "Property Area",
        modified,
        f'{int(data["area"]):,} sq ft'
    )


    # =====================================================
    # BEDROOMS
    # =====================================================

    if int(data["bedrooms"]) > 1:

        modified = house_data.copy()

        modified["bedrooms"] = (
            int(data["bedrooms"]) - 1
        )

        calculate_impact(
            "Bedrooms",
            modified,
            f'{data["bedrooms"]} bedrooms'
        )


    # =====================================================
    # BATHROOMS
    # =====================================================

    if int(data["bathrooms"]) > 1:

        modified = house_data.copy()

        modified["bathrooms"] = (
            int(data["bathrooms"]) - 1
        )

        calculate_impact(
            "Bathrooms",
            modified,
            f'{data["bathrooms"]} bathrooms'
        )


    # =====================================================
    # STORIES
    # =====================================================

    if int(data["stories"]) > 1:

        modified = house_data.copy()

        modified["stories"] = (
            int(data["stories"]) - 1
        )

        calculate_impact(
            "Stories",
            modified,
            f'{data["stories"]} stories'
        )


    # =====================================================
    # PARKING
    # =====================================================

    if int(data["parking"]) > 0:

        modified = house_data.copy()

        modified["parking"] = (
            int(data["parking"]) - 1
        )

        calculate_impact(
            "Parking",
            modified,
            f'{data["parking"]} spaces'
        )


    # =====================================================
    # YES / NO FEATURES
    # =====================================================

    binary_features = [
        ("mainroad", "Main Road"),
        ("guestroom", "Guest Room"),
        ("basement", "Basement"),
        ("hotwaterheating", "Hot Water Heating"),
        ("airconditioning", "Air Conditioning"),
        ("prefarea", "Preferred Area")
    ]


    for column, display_name in binary_features:

        modified = house_data.copy()

        current_value = data[column]

        opposite_value = (
            "no" if current_value == "yes" else "yes"
        )

        modified[column] = opposite_value

        calculate_impact(
            display_name,
            modified,
            current_value.capitalize()
        )


    # =====================================================
    # FURNISHING
    # =====================================================

    modified = house_data.copy()

    current_furnishing = data["furnishingstatus"]

    if current_furnishing == "furnished":

        comparison = "unfurnished"

    elif current_furnishing == "unfurnished":

        comparison = "furnished"

    else:

        comparison = "unfurnished"

    modified["furnishingstatus"] = comparison

    calculate_impact(
        "Furnishing",
        modified,
        current_furnishing.replace("-", " ").title()
    )


    # =====================================================
    # SORT FEATURES
    # =====================================================

    feature_impacts.sort(
        key=lambda item: abs(item["impact"]),
        reverse=True
    )


    # Keep strongest 6
    feature_impacts = feature_impacts[:6]


    # =====================================================
    # EXPLANATION
    # =====================================================

    strongest = feature_impacts[0]

    if strongest["impact"] > 0:

        explanation = (
            f'{strongest["feature"]} is one of the strongest '
            f'positive factors affecting this estimated price.'
        )

    elif strongest["impact"] < 0:

        explanation = (
            f'{strongest["feature"]} has a noticeable '
            f'negative effect on the estimated property value.'
        )

    else:

        explanation = (
            "The selected property features have a relatively "
            "balanced effect on the estimated price."
        )


    # =====================================================
    # RESPONSE
    # =====================================================

    return jsonify({
        "predicted_price": round(
            original_prediction,
            2
        ),

        "feature_impacts": feature_impacts,

        "explanation": explanation
    })


# =========================================================
# RUN SERVER
# =========================================================

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
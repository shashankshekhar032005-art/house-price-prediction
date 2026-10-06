import requests

url = "http://127.0.0.1:5000/predict"

house_data = {
    "area": 5000,
    "bedrooms": 3,
    "bathrooms": 2,
    "stories": 2,
    "mainroad": "yes",
    "guestroom": "no",
    "basement": "yes",
    "hotwaterheating": "no",
    "airconditioning": "yes",
    "parking": 2,
    "prefarea": "yes",
    "furnishingstatus": "furnished"
}

response = requests.post(url, json=house_data)

print("Status Code:", response.status_code)
print("Response:", response.json())
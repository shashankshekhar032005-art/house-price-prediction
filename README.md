# 🏠 HouseValue AI

### Intelligent House Price Prediction System

HouseValue AI is a machine learning powered web application that predicts the estimated value of a property based on its characteristics such as area, bedrooms, bathrooms, stories, parking, furnishing status, and additional facilities.

The system combines a **Gradient Boosting Regression model**, **Flask REST API**, and **React frontend** to provide an interactive property valuation experience.

---

## 🌐 Project Overview

HouseValue AI allows users to enter property details and receive an estimated property price through a trained machine learning model.

The application also provides:

- 🧠 Feature-based price explanation
- 📊 Prediction analytics
- 📈 Prediction history
- 💰 Price per square-foot estimation
- ⚡ Interactive and responsive interface
- 🎨 Modern dark glassmorphism UI

---

## ✨ Features

### 🏠 House Price Prediction

Enter property information including:

- Area
- Bedrooms
- Bathrooms
- Stories
- Parking spaces
- Main road availability
- Guest room
- Basement
- Hot water heating
- Air conditioning
- Preferred area
- Furnishing status

The machine learning model processes these features and generates an estimated property value.

---

### 🧠 Why This Price?

HouseValue AI provides an explanation of the prediction by showing the features that influenced the estimated price.

The application displays:

- Feature name
- Feature value
- Positive or negative impact
- Estimated impact amount
- AI-generated explanation

This makes the prediction easier to understand instead of treating the ML model as a complete black box.

---

### 📊 Prediction Analytics

The application visualizes previous predictions using interactive charts.

Current analytics include:

- Predicted property value trend
- Area vs predicted price

Charts are implemented using **Recharts**.

---

### 🕒 Prediction History

Recent predictions are automatically stored in the browser using `localStorage`.

The history contains:

- Prediction date
- Property area
- Bedrooms
- Bathrooms
- Parking
- Furnishing status
- Predicted price

Users can also clear their prediction history.

---

### 💰 Price Insights

After a prediction, the application displays:

- Exact predicted property value
- Value in Lakhs/Crores
- Estimated price per square foot

---

## 🤖 Machine Learning

The project uses **Gradient Boosting Regression** for house price prediction.

### Model Performance

| Metric | Value |
|---|---:|
| R² Score | 67.27% |
| MAE | ₹9.51L |
| RMSE | ₹12.86L |
| Estimators | 200 |

### Dataset

- Training records: **545**
- Property features: **12**

The model is trained using housing data containing property characteristics and corresponding selling prices.

---

## 🛠️ Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-2026-blue?logo=react)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow?logo=javascript)
![CSS3](https://img.shields.io/badge/CSS3-Styling-blue?logo=css3)
![Recharts](https://img.shields.io/badge/Recharts-Data%20Visualization-orange)

- React
- JavaScript
- CSS
- Recharts
- Vite

### Backend

![Python](https://img.shields.io/badge/Python-3.x-blue?logo=python)
![Flask](https://img.shields.io/badge/Flask-REST%20API-black?logo=flask)

- Python
- Flask
- REST API

### Machine Learning

![Scikit Learn](https://img.shields.io/badge/Scikit--Learn-Machine%20Learning-orange?logo=scikit-learn)

- Scikit-Learn
- Gradient Boosting Regression
- Feature analysis
- Model evaluation

---

## 📁 Project Structure

```text
house-price-prediction/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── app.py
│   ├── model/
│   ├── requirements.txt
│   └── ...
│
├── .gitignore
└── README.md
```

> Update the folder names above if your actual project structure is different.

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/shashankshekhar032005-art/house-price-prediction.git
```

Move into the project:

```bash
cd house-price-prediction
```

---

## 🐍 Backend Setup

Move into the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install the required packages:

```bash
pip install -r requirements.txt
```

Start the Flask server:

```bash
python app.py
```

The backend should run on:

```text
http://127.0.0.1:5000
```

---

## ⚛️ Frontend Setup

Open another terminal and move into the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the URL shown by Vite in your browser.

---

## 🔄 Application Workflow

```text
User
  │
  ▼
React Frontend
  │
  │ Property Details
  ▼
Flask REST API
  │
  ▼
Gradient Boosting Model
  │
  ▼
Predicted House Price
  │
  ├──► Price Display
  ├──► Why This Price
  ├──► Prediction History
  └──► Analytics
```

---

## 🎨 User Interface

HouseValue AI uses a modern dark interface with:

- Glassmorphism cards
- Gradient elements
- Interactive hover effects
- Responsive layouts
- Smooth animations
- Data visualization
- Mobile-friendly design

---

## 🔮 Future Improvements

Possible future improvements include:

- 🌐 Production deployment
- 📍 Location-based property valuation
- 🗺️ Map integration
- 📊 Larger and more diverse datasets
- 🧠 Advanced model comparison
- 📄 Downloadable prediction reports
- 👤 User authentication
- ☁️ Cloud database integration
- 📱 Progressive Web App support

---

## 🚀 Deployment

The application can be deployed using:

- **Frontend:** Render / Netlify / Vercel
- **Backend:** Render / Railway
- **Model:** Hosted with the Flask backend

The live deployment link will be added here after deployment.

### Live Demo

🔗 `https://housepps.netlify.app`

### GitHub Repository

🔗 `https://github.com/YOUR-USERNAME/house-price-prediction`

---

## 👨‍💻 Author

### Shashank Shekhar

BCA Student | Aspiring AI/ML Engineer & Full Stack Developer

Interested in:

- Artificial Intelligence
- Machine Learning
- Full Stack Development
- Data Science
- Intelligent Web Applications

---

## ⭐ Support

If you found this project interesting, consider giving the repository a ⭐ on GitHub.

---

## 📜 License

This project is created for educational and portfolio purposes.

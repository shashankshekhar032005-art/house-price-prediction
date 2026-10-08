import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    area: "",
    bedrooms: "",
    bathrooms: "",
    stories: "",
    mainroad: "yes",
    guestroom: "no",
    basement: "no",
    hotwaterheating: "no",
    airconditioning: "no",
    parking: "",
    prefarea: "no",
    furnishingstatus: "furnished",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Why This Price
  const [featureImpacts, setFeatureImpacts] = useState([]);
  const [explanation, setExplanation] = useState("");

  // Prediction history
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem("predictionHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setPrediction(null);
    setFeatureImpacts([]);
    setExplanation("");

    try {
      const response = await fetch("https://house-price-prediction-y80k.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          area: Number(formData.area),
          bedrooms: Number(formData.bedrooms),
          bathrooms: Number(formData.bathrooms),
          stories: Number(formData.stories),
          parking: Number(formData.parking),
        }),
      });

      if (!response.ok) {
        throw new Error("Prediction request failed");
      }

      const data = await response.json();

      setPrediction(data.predicted_price);

      setFeatureImpacts(data.feature_impacts || []);
      setExplanation(data.explanation || "");

      const newPrediction = {
        id: Date.now(),
        area: Number(formData.area),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        stories: Number(formData.stories),
        parking: Number(formData.parking),
        furnishingstatus: formData.furnishingstatus,
        price: data.predicted_price,
        date: new Date().toLocaleString("en-IN"),
      };

      const updatedHistory = [newPrediction, ...history].slice(0, 10);

      setHistory(updatedHistory);

      localStorage.setItem(
        "predictionHistory",
        JSON.stringify(updatedHistory)
      );
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to the prediction server. Make sure Flask is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("predictionHistory");
  };

  const resetPrediction = () => {
    setPrediction(null);
    setFeatureImpacts([]);
    setExplanation("");
    setError("");

    window.location.hash = "predict";
  };

  const chartData = [...history]
    .reverse()
    .map((item, index) => ({
      name: `#${index + 1}`,
      price: Number(item.price),
      area: Number(item.area),
    }));

  const maxImpact =
    featureImpacts.length > 0
      ? Math.max(
          ...featureImpacts.map((item) => Math.abs(Number(item.impact)))
        )
      : 1;

  const formatPrice = (price) => {
    return Number(price).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    });
  };

  const formatIndianValue = (price) => {
    const value = Number(price);

    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Crore`;
    }

    return `₹${(value / 100000).toFixed(2)} Lakh`;
  };

  const getPricePerSqft = () => {
    if (!prediction || !formData.area) return 0;

    return Math.round(
      Number(prediction) / Number(formData.area)
    ).toLocaleString("en-IN");
  };

  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-container">

          <div className="logo">
            <span className="logo-icon">⌂</span>
            <span>HouseValue AI</span>
          </div>

          <div className="nav-links">
            <a href="#predict">Predict</a>
            <a href="#performance">Model</a>
            <a href="#history">History</a>
            <a href="#analytics">Analytics</a>
            <a href="#about">About</a>
          </div>

        </div>
      </nav>


      {/* HERO */}
      <section className="hero">

        <div className="hero-content">

          <div className="hero-badge">
            <span>✦</span>
            MACHINE LEARNING POWERED
          </div>

          <h1>
            Predict Your
            <span> Property Value</span>
          </h1>

          <p>
            Get an intelligent house price estimate using a Gradient Boosting
            Machine Learning model trained on real housing data.
          </p>

          <a href="#predict" className="hero-button">
            Start Prediction
            <span>→</span>
          </a>

        </div>

        <div className="hero-decoration">
          <div className="hero-circle circle-one"></div>
          <div className="hero-circle circle-two"></div>
          <div className="hero-grid"></div>
        </div>

      </section>


      {/* PREDICTION */}
      <section id="predict" className="prediction-section">

        <div className="section-heading">
          <span>PROPERTY ANALYSIS</span>

          <h2>Enter Property Details</h2>

          <p>
            Provide the property characteristics below to generate an estimated
            market value.
          </p>
        </div>


        <div className="prediction-container">

          {/* FORM */}
          <div className="form-card">

            <div className="card-header">

              <div>
                <span className="card-label">PROPERTY INPUT</span>
                <h3>House Information</h3>
              </div>

              <div className="card-icon">⌂</div>

            </div>


            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                <div className="form-group">
                  <label>Area (sq ft)</label>

                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="e.g. 5000"
                    required
                  />
                </div>


                <div className="form-group">
                  <label>Bedrooms</label>

                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    placeholder="e.g. 3"
                    min="1"
                    required
                  />
                </div>


                <div className="form-group">
                  <label>Bathrooms</label>

                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    placeholder="e.g. 2"
                    min="1"
                    required
                  />
                </div>


                <div className="form-group">
                  <label>Stories</label>

                  <input
                    type="number"
                    name="stories"
                    value={formData.stories}
                    onChange={handleChange}
                    placeholder="e.g. 2"
                    min="1"
                    required
                  />
                </div>


                <div className="form-group">
                  <label>Parking Spaces</label>

                  <input
                    type="number"
                    name="parking"
                    value={formData.parking}
                    onChange={handleChange}
                    placeholder="e.g. 2"
                    min="0"
                    required
                  />
                </div>


                <div className="form-group">
                  <label>Furnishing Status</label>

                  <select
                    name="furnishingstatus"
                    value={formData.furnishingstatus}
                    onChange={handleChange}
                  >
                    <option value="furnished">Furnished</option>
                    <option value="semi-furnished">Semi-Furnished</option>
                    <option value="unfurnished">Unfurnished</option>
                  </select>

                </div>

              </div>


              <div className="features-title">
                Additional Features
              </div>


              <div className="toggle-grid">

                <div className="form-group">
                  <label>Main Road</label>

                  <select
                    name="mainroad"
                    value={formData.mainroad}
                    onChange={handleChange}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>

                </div>


                <div className="form-group">
                  <label>Guest Room</label>

                  <select
                    name="guestroom"
                    value={formData.guestroom}
                    onChange={handleChange}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>

                </div>


                <div className="form-group">
                  <label>Basement</label>

                  <select
                    name="basement"
                    value={formData.basement}
                    onChange={handleChange}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>

                </div>


                <div className="form-group">
                  <label>Hot Water Heating</label>

                  <select
                    name="hotwaterheating"
                    value={formData.hotwaterheating}
                    onChange={handleChange}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>

                </div>


                <div className="form-group">
                  <label>Air Conditioning</label>

                  <select
                    name="airconditioning"
                    value={formData.airconditioning}
                    onChange={handleChange}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>

                </div>


                <div className="form-group">
                  <label>Preferred Area</label>

                  <select
                    name="prefarea"
                    value={formData.prefarea}
                    onChange={handleChange}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>

                </div>

              </div>


              <button
                type="submit"
                className="predict-button"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing Property...
                  </>
                ) : (
                  <>
                    Predict House Price
                    <span>→</span>
                  </>
                )}

              </button>

            </form>

          </div>


          {/* RESULT */}
          <div className="result-card">

            <div className="result-header">

              <div>
                <span className="card-label">ESTIMATED VALUE</span>
                <h3>Prediction Result</h3>
              </div>

              <div className="result-icon">₹</div>

            </div>


            {loading ? (

              <div className="result-loading">

                <div className="loading-circle"></div>

                <p>Analyzing property features...</p>

              </div>

            ) : prediction ? (

              <div className="result-content">

                <div className="price-label">
                  Predicted Property Value
                </div>


                <div className="price">
                  ₹{formatPrice(prediction)}
                </div>


                <div className="price-secondary">
                  {formatIndianValue(prediction)}
                </div>


                <div className="price-per-sqft">
                  ₹{getPricePerSqft()}
                  <span> / sq ft</span>
                </div>


                <div className="prediction-status">

                  <span>✓</span>

                  Prediction generated successfully

                </div>


                <div className="result-summary">

                  <div>
                    <span>Area</span>

                    <strong>
                      {Number(formData.area).toLocaleString("en-IN")} sq ft
                    </strong>
                  </div>


                  <div>
                    <span>Bedrooms</span>

                    <strong>
                      {formData.bedrooms}
                    </strong>
                  </div>


                  <div>
                    <span>Bathrooms</span>

                    <strong>
                      {formData.bathrooms}
                    </strong>
                  </div>


                  <div>
                    <span>Parking</span>

                    <strong>
                      {formData.parking}
                    </strong>
                  </div>

                </div>


                {/* NEW PREDICTION BUTTON */}
                <button
                  className="new-prediction-button"
                  onClick={resetPrediction}
                >
                  + New Prediction
                </button>

              </div>

            ) : (

              <div className="result-empty">

                <div className="empty-house">⌂</div>

                <h3>Your prediction will appear here</h3>

                <p>
                  Fill in the property details and click predict to see the
                  estimated value.
                </p>

              </div>

            )}


            {error && (
              <div className="error-message">
                ⚠ {error}
              </div>
            )}

          </div>

        </div>

      </section>


      {/* WHY THIS PRICE */}
      {prediction && featureImpacts.length > 0 && (

        <section className="why-price-section">

          <div className="section-heading">

            <span>MODEL EXPLANATION</span>

            <h2>Why This Price?</h2>

            <p>
              Understand which property features influenced the estimated
              value.
            </p>

          </div>


          <div className="why-price-card">

            <div className="why-price-header">

              <div>

                <span className="card-label">
                  FEATURE IMPACT
                </span>

                <h3>
                  What influenced your prediction?
                </h3>

              </div>

              <div className="why-price-icon">
                ✦
              </div>

            </div>


            <div className="impact-list">

              {featureImpacts.map((item, index) => {

                const impact = Number(item.impact);

                const positive = impact >= 0;

                const width =
                  maxImpact > 0
                    ? Math.min(
                        (Math.abs(impact) / maxImpact) * 100,
                        100
                      )
                    : 0;

                return (

                  <div
                    className={`impact-item ${
                      positive
                        ? "impact-positive"
                        : "impact-negative"
                    }`}
                    key={index}
                  >

                    <div className="impact-top">

                      <div className="impact-info">

                        <div className="impact-feature">

                          <span className="impact-number">
                            0{index + 1}
                          </span>

                          {item.feature}

                        </div>


                        <div className="impact-value">
                          {item.value}
                        </div>

                      </div>


                      <div
                        className={`impact-amount ${
                          positive
                            ? "positive-text"
                            : "negative-text"
                        }`}
                      >

                        {positive ? "+" : "-"}₹
                        {Math.abs(impact).toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 0,
                          }
                        )}

                      </div>

                    </div>


                    <div className="impact-bar-container">

                      <div
                        className={`impact-bar ${
                          positive
                            ? "positive"
                            : "negative"
                        }`}
                        style={{
                          width: `${width}%`,
                        }}
                      ></div>

                    </div>

                  </div>

                );

              })}

            </div>


            {explanation && (

              <div className="explanation-box">

                <div className="explanation-icon">
                  💡
                </div>

                <div className="explanation-content">

                  <span>
                    AI INSIGHT
                  </span>

                  <p>
                    {explanation}
                  </p>

                </div>

              </div>

            )}

          </div>

        </section>

      )}


      {/* MODEL PERFORMANCE */}
      <section
        id="performance"
        className="performance-section"
      >

        <div className="section-heading">

          <span>
            MACHINE LEARNING MODEL
          </span>

          <h2>
            Model Performance
          </h2>

          <p>
            Our prediction system uses Gradient Boosting Regression for
            intelligent price estimation.
          </p>

        </div>


        <div className="metrics-grid">

          <div className="metric-card">

            <div className="metric-icon">
              R²
            </div>

            <div className="metric-value">
              67.27%
            </div>

            <div className="metric-name">
              R² Score
            </div>

            <p>
              Model accuracy score
            </p>

          </div>


          <div className="metric-card">

            <div className="metric-icon">
              ₹
            </div>

            <div className="metric-value">
              ₹9.51L
            </div>

            <div className="metric-name">
              MAE
            </div>

            <p>
              Mean absolute error
            </p>

          </div>


          <div className="metric-card">

            <div className="metric-icon">
              σ
            </div>

            <div className="metric-value">
              ₹12.86L
            </div>

            <div className="metric-name">
              RMSE
            </div>

            <p>
              Root mean squared error
            </p>

          </div>


          <div className="metric-card">

            <div className="metric-icon">
              ⚙
            </div>

            <div className="metric-value">
              200
            </div>

            <div className="metric-name">
              Estimators
            </div>

            <p>
              Gradient boosting trees
            </p>

          </div>

        </div>

      </section>


      {/* HISTORY */}
      <section
        id="history"
        className="history-section"
      >

        <div className="section-heading history-heading">

          <div>

            <span>
              PREDICTION HISTORY
            </span>

            <h2>
              Recent Predictions
            </h2>

            <p>
              Your latest property price predictions.
            </p>

          </div>


          {history.length > 0 && (

            <button
              className="clear-button"
              onClick={clearHistory}
            >
              Clear History
            </button>

          )}

        </div>


        <div className="history-container">

          {history.length === 0 ? (

            <div className="history-empty">

              <div className="history-empty-icon">
                ◷
              </div>

              <h3>
                No predictions yet
              </h3>

              <p>
                Your prediction history will appear here after you analyze a
                property.
              </p>

              <a href="#predict">
                Make your first prediction →
              </a>

            </div>

          ) : (

            <div className="history-table-wrapper">

              <table className="history-table">

                <thead>

                  <tr>

                    <th>Date</th>
                    <th>Area</th>
                    <th>Bedrooms</th>
                    <th>Bathrooms</th>
                    <th>Parking</th>
                    <th>Furnishing</th>
                    <th>Predicted Price</th>

                  </tr>

                </thead>


                <tbody>

                  {history.map((item) => (

                    <tr key={item.id}>

                      <td>
                        {item.date}
                      </td>

                      <td>
                        {item.area.toLocaleString("en-IN")} sq ft
                      </td>

                      <td>
                        {item.bedrooms}
                      </td>

                      <td>
                        {item.bathrooms}
                      </td>

                      <td>
                        {item.parking}
                      </td>

                      <td>
                        {item.furnishingstatus}
                      </td>

                      <td className="history-price">
                        ₹{formatPrice(item.price)}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </section>


      {/* ANALYTICS */}
      <section
        id="analytics"
        className="analytics-section"
      >

        <div className="section-heading">

          <span>
            PREDICTION ANALYTICS
          </span>

          <h2>
            Visualize Your Predictions
          </h2>

          <p>
            Analyze how your predicted property values change across different
            properties.
          </p>

        </div>


        {history.length === 0 ? (

          <div className="analytics-empty">

            <div className="analytics-empty-icon">
              ◈
            </div>

            <h3>
              No analytics available yet
            </h3>

            <p>
              Make a few predictions to generate charts and analytics.
            </p>

            <a href="#predict">
              Start Predicting →
            </a>

          </div>

        ) : (

          <div className="charts-grid">

            <div className="chart-card">

              <div className="chart-header">

                <div>

                  <span className="chart-label">
                    PRICE TREND
                  </span>

                  <h3>
                    Predicted Property Values
                  </h3>

                </div>

                <div className="chart-icon">
                  ₹
                </div>

              </div>


              <div className="chart-wrapper">

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <AreaChart data={chartData}>

                    <defs>

                      <linearGradient
                        id="priceGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >

                        <stop
                          offset="5%"
                          stopOpacity={0.35}
                        />

                        <stop
                          offset="95%"
                          stopOpacity={0}
                        />

                      </linearGradient>

                    </defs>


                    <CartesianGrid
                      strokeDasharray="3 3"
                      opacity={0.12}
                    />


                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 12,
                      }}
                    />


                    <YAxis
                      tick={{
                        fontSize: 12,
                      }}
                      tickFormatter={(value) =>
                        `₹${(
                          value / 100000
                        ).toFixed(0)}L`
                      }
                    />


                    <Tooltip
                      formatter={(value) => [
                        `₹${Number(value).toLocaleString(
                          "en-IN"
                        )}`,
                        "Price",
                      ]}
                    />


                    <Area
                      type="monotone"
                      dataKey="price"
                      strokeWidth={3}
                      fill="url(#priceGradient)"
                    />

                  </AreaChart>

                </ResponsiveContainer>

              </div>

            </div>


            <div className="chart-card">

              <div className="chart-header">

                <div>

                  <span className="chart-label">
                    PROPERTY ANALYSIS
                  </span>

                  <h3>
                    Area vs Price
                  </h3>

                </div>

                <div className="chart-icon">
                  ⌂
                </div>

              </div>


              <div className="chart-wrapper">

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <LineChart data={chartData}>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      opacity={0.12}
                    />


                    <XAxis
                      dataKey="area"
                      tick={{
                        fontSize: 12,
                      }}
                      tickFormatter={(value) =>
                        `${value} ft²`
                      }
                    />


                    <YAxis
                      tick={{
                        fontSize: 12,
                      }}
                      tickFormatter={(value) =>
                        `₹${(
                          value / 100000
                        ).toFixed(0)}L`
                      }
                    />


                    <Tooltip
                      formatter={(value, name) => {

                        if (name === "price") {

                          return [
                            `₹${Number(
                              value
                            ).toLocaleString(
                              "en-IN"
                            )}`,
                            "Price",
                          ];

                        }

                        return [
                          value,
                          "Area",
                        ];

                      }}
                    />


                    <Line
                      type="monotone"
                      dataKey="price"
                      strokeWidth={3}
                      dot={{
                        r: 5,
                      }}
                      activeDot={{
                        r: 8,
                      }}
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>

            </div>

          </div>

        )}

      </section>


      {/* ABOUT */}
      <section
        id="about"
        className="about-section"
      >

        <div className="about-container">

          <div className="about-content">

            <span>
              ABOUT THE PROJECT
            </span>

            <h2>
              Intelligent Property
              <br />
              Valuation with ML
            </h2>

            <p>
              HouseValue AI is a machine learning based house price prediction
              system designed to estimate property values using multiple
              property characteristics.
            </p>

            <p>
              The system uses a Gradient Boosting Regression model trained on
              housing data and provides both predictions and feature-based
              insights to make the results easier to understand.
            </p>


            <div className="technology-list">

              <span>
                Python
              </span>

              <span>
                Scikit-Learn
              </span>

              <span>
                Flask
              </span>

              <span>
                React
              </span>

              <span>
                Recharts
              </span>

            </div>

          </div>


          <div className="about-stats">

            <div className="about-stat">

              <strong>
                545
              </strong>

              <span>
                Training Records
              </span>

            </div>


            <div className="about-stat">

              <strong>
                12
              </strong>

              <span>
                Property Features
              </span>

            </div>


            <div className="about-stat">

              <strong>
                67.27%
              </strong>

              <span>
                R² Score
              </span>

            </div>


            <div className="about-stat">

              <strong>
                ML
              </strong>

              <span>
                Powered
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="footer">

        <div className="footer-content">

          <div className="logo">

            <span className="logo-icon">
              ⌂
            </span>

            <span>
              HouseValue AI
            </span>

          </div>

          <p>
            Intelligent property valuation powered by Machine Learning.
          </p>

          <span className="footer-copy">
            © 2026 HouseValue AI. Built with React + Flask + ML.
          </span>

        </div>

      </footer>

    </div>
  );
}

export default App;

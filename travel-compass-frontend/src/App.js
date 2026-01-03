import React, { useState } from 'react';
import axios from 'axios';
import { Compass, RefreshCw, ChevronRight,Calendar,Clock } from 'lucide-react';

// Components
import TripForm from './components/TripForm';
import MapView from './components/MapView';
import Timeline from './components/Timeline';
import DayDetailView from "./components/DayDetailView";

// Services
import { simulateApiCall, simulatePolling } from './services/mockApi';

import './App.css';

const API_BASE_URL = "http://localhost:8080/api/plans";
const PROXY_PHOTO_URL = "http://localhost:8080/api/photos"; // Photos Proxy

function App() {
  const [plan, setPlan] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };


  const handleFormSubmitMock = async (formData) => {
    setLoading(true);
    setPlan(null);
    setSelectedDay(null);
    setStatusMessage("Connecting to Travel Service...");

    // Stage 1: Initial Request
    const response = await simulateApiCall(formData);

    if (response.status === 202) {
      setStatusMessage("AI is crafting your itinerary & fetching photos...");

      // Stage 2: Simulate the background Kafka/AI process
      const result = await simulatePolling();

      setPlan(result.data);
      setLoading(false);
    }
  };

  /**
   * REAL SUBMISSION (For Production)
   */
  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setPlan(null);
    setSelectedDay(null);
    setStatusMessage("Checking for existing plans...");

    try {
      const response = await axios.post(`${API_BASE_URL}/generate`, formData);

      if (response.status === 200) {
        setPlan(response.data);
        setLoading(false);
      } else if (response.status === 202) {
        const planId = response.data.id;
        setStatusMessage("AI is generating your trip... this takes a few seconds.");
        startPolling(planId);
      }
    } catch (error) {
      console.error("Error:", error);
      setStatusMessage("Failed to connect to server.");
      setLoading(false);
    }
  };

  const startPolling = (planId) => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/${planId}`);
        if (res.data && res.data.itinerary && res.data.itinerary.length > 0) {
          setPlan(res.data);
          setLoading(false);
          clearInterval(interval);
        }
      } catch (err) {
        console.log("Waiting for backend...");
      }
    }, 3000);
  };

  return (
      <div className="dashboard">
        {/* Sidebar Section */}
        <div className="itinerary-sidebar">
          <div className="sidebar-header">
            <Compass className="logo-icon" size={24} />
            <h1>TravelCompass</h1>
          </div>

          <div className="sidebar-content">
            {loading ? (
                /* 1. LOADING VIEW */
                <div className="loading-container">
                  <div className="spinner-wrapper">
                    <RefreshCw className="animate-spin" size={48} />
                  </div>
                  <h2>Preparing your adventure...</h2>
                  <p className="status-text">{statusMessage}</p>
                  <div className="progress-bar-bg">
                    <div className={`progress-fill ${statusMessage.includes('AI') ? 'filling' : ''}`}></div>
                  </div>
                </div>
            ) : !plan ? (
                /* 2. FORM VIEW */
                <div className="form-wrapper">
                  {/* Pass the handleFormSubmit function into the TripForm component */}
                  <TripForm onSubmit={handleFormSubmit} />
                </div>
            ) : selectedDay ? (
                /* 3. DETAILED DAY VIEW */
                <DayDetailView
                    day={selectedDay}
                    onBack={() => setSelectedDay(null)}
                />
            ) : (
                /* 4. FULL TRIP OVERVIEW */
                <div className="results-container">
                  <button onClick={() => setPlan(null)} className="back-btn">
                    ← Create New Trip
                  </button>
                  <div className="plan-summary">
                    <h2>{plan.destination}</h2>
                    <div className="date-badge">
                      <Calendar size={14} />
                      <span>{formatDate(plan.startDate)}</span>
                      <span className="date-separator">→</span>
                      <span>{formatDate(plan.endDate)}</span>
                    </div>
                  </div>
                  <Timeline
                      itinerary={plan.itinerary}
                      onDayClick={(day) => setSelectedDay(day)}
                  />
                </div>
            )}
          </div>
        </div>

        {/* Map Section */}
        <div className="map-main">
          <MapView plan={plan} activeDay={selectedDay} />
        </div>
      </div>
  );
}

export default App;
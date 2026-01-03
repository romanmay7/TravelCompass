import React, { useState } from 'react';
import axios from 'axios';
import {
  Compass,
  RefreshCw,
  ChevronRight,
  Calendar,
  Map as MapIcon,
  List,
  LogOut,
  User as UserIcon
} from 'lucide-react';

// Components
import TripForm from './components/TripForm';
import MapView from './components/MapView';
import Timeline from './components/Timeline';
import DayDetailView from "./components/DayDetailView";
import UserPlansList from "./components/UserPlansList"; // Component to list user's trips
import LoginView from "./components/LoginView";       // The login screen

// Context
import { useAuth } from './context/AuthContext';

import './App.css';

const API_BASE_URL = "http://localhost:8080/api/plans";

function App() {
  const { user, logout } = useAuth();

  // View State
  const [currentView, setCurrentView] = useState('generator'); // 'generator' or 'my-plans'
  const [plan, setPlan] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  /**
   * Helper: Format Dates for UI
   */
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  /**
   * Action: Start Polling for AI results
   */
  const startPolling = (planId) => {
    const interval = setInterval(async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` }
        };

        const res = await axios.get(`${API_BASE_URL}/${planId}`, config);

        // Check if backend returned the full object (Status 200)
        // instead of "Processing..." (Status 202)
        if (res.status === 200 && res.data.itinerary?.length > 0) {
          setPlan(res.data);
          setLoading(false);
          clearInterval(interval);
        }
      } catch (err) {
        console.log("Still waiting for AI worker...");
      }
    }, 3000);
  };

  /**
   * Action: Handle New Trip Generation
   */
  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setPlan(null);
    setSelectedDay(null);
    setStatusMessage("Connecting to Travel Service...");

    try {
      // 1. Prepare the payload with the userId
      const requestPayload = { ...formData, userId: user.id };

      // 2. Prepare the Security Header
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}` // This is what the JwtFilter looks for
        }
      };

      // 3. Send the request with the config
      const response = await axios.post(`${API_BASE_URL}/generate`, requestPayload, config);

      if (response.status === 200) {
        setPlan(response.data);
        setLoading(false);
      } else if (response.status === 202) {
        const planId = response.data.id;
        setStatusMessage("AI is crafting your itinerary... please wait.");
        startPolling(planId); // Make sure startPolling also uses the token!
      }
    } catch (error) {
      console.error("Error generating trip:", error);
      // Add specific check for 403/401
      if (error.response?.status === 403 || error.response?.status === 401) {
        setStatusMessage("Session expired. Please log in again.");
      } else {
        setStatusMessage("Failed to connect to server.");
      }
      setLoading(false);
    }
  };

  /**
   * Action: Select a plan from the "My Plans" list
   */
  const handleViewPlan = (selectedPlan) => {
    setPlan(selectedPlan);
    setCurrentView('generator'); // Switch back to the dashboard/map view
    setSelectedDay(null);
  };

  // Guard Clause: If not logged in, show Login Screen
  if (!user) {
    return <LoginView />;
  }

  return (
      <div className="app-layout">
        {/* --- TOP NAVIGATION BAR --- */}
        <header className="top-nav">
          <div className="nav-brand">
            <Compass className="brand-icon" size={28} />
            <span>TravelCompass</span>
          </div>

          <div className="nav-toggle-group">
            <button
                className={`toggle-btn ${currentView === 'generator' ? 'active' : ''}`}
                onClick={() => {
                  setCurrentView('generator');
                  setPlan(null); // Reset to form when clicking "New Trip"
                }}
            >
              <MapIcon size={18} />
              <span>New Trip</span>
            </button>

            <button
                className={`toggle-btn ${currentView === 'my-plans' ? 'active' : ''}`}
                onClick={() => setCurrentView('my-plans')}
            >
              <List size={18} />
              <span>My Plans</span>
            </button>
          </div>

          <div className="nav-user-area">
            <div className="user-profile">
              <UserIcon size={18} />
              <span>{user.name}</span>
            </div>
            <button onClick={logout} className="logout-action-btn" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* --- MAIN DASHBOARD AREA --- */}
        <div className="dashboard">
          <div className="itinerary-sidebar">
            <div className="sidebar-content">

              {/* VIEW 1: USER PLANS LIST */}
              {currentView === 'my-plans' ? (
                      <UserPlansList onSelectPlan={handleViewPlan} />
                  ) :

                  /* VIEW 2: LOADING STATE */
                  loading ? (
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
                      ) :

                      /* VIEW 3: INPUT FORM */
                      !plan ? (
                              <div className="form-wrapper">
                                <TripForm onSubmit={handleFormSubmit} />
                              </div>
                          ) :

                          /* VIEW 4: DETAILED DAY VIEW (When a day is clicked) */
                          selectedDay ? (
                              <DayDetailView
                                  day={selectedDay}
                                  onBack={() => setSelectedDay(null)}
                              />
                          ) : (
                              /* VIEW 5: FULL TRIP OVERVIEW (Timeline) */
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

          {/* MAP SECTION (Constant across all generator views) */}
          <div className="map-main">
            <MapView plan={plan} activeDay={selectedDay} />
          </div>
        </div>
      </div>
  );
}

export default App;
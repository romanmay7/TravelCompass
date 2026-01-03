import React, { useState } from 'react';
import axios from 'axios';
import { Compass, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginView = () => {
    const { login } = useAuth();
    const [isSignup, setIsSignup] = useState(false); // Toggle between Login and Signup
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const AUTH_URL = "http://localhost:8080/api/auth";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = isSignup ? `${AUTH_URL}/signup` : `${AUTH_URL}/login`;

            // Real API Call to your Spring Boot Backend
            const response = await axios.post(endpoint, formData);

            // response.data contains: { id, name, email, token }
            login(response.data);

        } catch (err) {
            setError(err.response?.data || "Authentication failed. Check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <Compass className="logo-icon-large" size={48} color="#2563eb" />
                    <h1>TravelCompass</h1>
                    <p>{isSignup ? "Create your account" : "Welcome back, traveler"}</p>
                </div>

                <form className="email-form" onSubmit={handleSubmit}>
                    {isSignup && (
                        <div className="input-group">
                            <User size={18} />
                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <Mail size={18} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div className="input-group">
                        <Lock size={18} />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Processing..." : (isSignup ? "Create Account" : "Sign In")}
                        <ArrowRight size={18} />
                    </button>
                </form>

                <div className="login-footer">
                    <button
                        type="button"
                        onClick={() => setIsSignup(!isSignup)}
                        className="toggle-auth-btn"
                    >
                        {isSignup ? "Already have an account? Sign In" : "New here? Create an account"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginView;
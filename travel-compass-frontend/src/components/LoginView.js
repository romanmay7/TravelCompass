import React, { useState } from 'react';
import axios from 'axios';
import { Compass, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginView = () => {
    const { login } = useAuth();
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // API Base URL
    const AUTH_URL = "http://localhost:8080/api/auth";

    // Google Auth Entry Point (Handled by Spring Security OAuth2)
    const GOOGLE_AUTH_URL = "http://localhost:8080/oauth2/authorization/google";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = isSignup ? `${AUTH_URL}/signup` : `${AUTH_URL}/login`;
            const response = await axios.post(endpoint, formData);

            // Expects: { id, name, email, token }
            login(response.data);
        } catch (err) {
            setError(err.response?.data || "Authentication failed. Check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        // Redirect the whole browser window to the backend's Google trigger
        window.location.href = GOOGLE_AUTH_URL;
    };

    return (
        <div className="login-page">
            <style>{`
                .login-page { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f1f5f9; padding: 20px; font-family: sans-serif; }
                .login-card { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); width: 100%; max-width: 400px; }
                .login-header { text-align: center; margin-bottom: 30px; }
                .login-header h1 { margin: 10px 0 5px; color: #1e293b; }
                .login-header p { color: #64748b; }
                .input-group { position: relative; margin-bottom: 15px; display: flex; align-items: center; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0 12px; }
                .input-group input { width: 100%; border: none; padding: 12px; outline: none; background: transparent; }
                .submit-btn { width: 100%; background: #2563eb; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: background 0.2s; }
                .submit-btn:hover { background: #1d4ed8; }
                .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
                .divider { display: flex; align-items: center; text-align: center; margin: 20px 0; color: #94a3b8; font-size: 14px; }
                .divider::before, .divider::after { content: ''; flex: 1; border-bottom: 1px solid #e2e8f0; }
                .divider span { margin: 0 10px; }
                .google-btn { width: 100%; background: white; border: 1px solid #e2e8f0; padding: 10px; border-radius: 8px; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: background 0.2s; font-weight: 500; color: #334155; }
                .google-btn:hover { background: #f8fafc; }
                .google-btn img { width: 18px; height: 18px; }
                .error-message { color: #ef4444; font-size: 14px; margin-bottom: 15px; text-align: center; }
                .toggle-auth-btn { background: none; border: none; color: #2563eb; font-weight: 500; cursor: pointer; width: 100%; margin-top: 20px; font-size: 14px; }
            `}</style>

            <div className="login-card">
                <div className="login-header">
                    <Compass size={48} color="#2563eb" style={{margin:'0 auto'}} />
                    <h1>TravelCompass</h1>
                    <p>{isSignup ? "Create your account" : "Welcome back, traveler"}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <div className="input-group">
                            <User size={18} color="#64748b" />
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
                        <Mail size={18} color="#64748b" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div className="input-group">
                        <Lock size={18} color="#64748b" />
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

                <div className="divider">
                    <span>or</span>
                </div>

                <button type="button" className="google-btn" onClick={handleGoogleLogin}>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                    Continue with Google
                </button>

                <button
                    type="button"
                    onClick={() => setIsSignup(!isSignup)}
                    className="toggle-auth-btn"
                >
                    {isSignup ? "Already have an account? Sign In" : "New here? Create an account"}
                </button>
            </div>
        </div>
    );
};

export default LoginView;
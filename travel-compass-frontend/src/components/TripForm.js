import React, { useState } from 'react';
import { Plane, Calendar, Star, Loader2 } from 'lucide-react';

const TripForm = ({ onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        destination: '',
        startDate: '',
        endDate: '',
        interests: []
    });

    const availableInterests = ['Sightseeing', 'Dining', 'Adventure', 'Relaxing', 'Culture', 'Extreme Sports'];

    const handleInterestToggle = (interest) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="form-overlay">
            <form className="trip-form" onSubmit={handleSubmit}>
                <div className="form-header">
                    <Plane size={32} className="icon-blue" />
                    <h2>Start Your Adventure</h2>
                    <p>Tell us where you want to go and what you love.</p>
                </div>

                <div className="input-group">
                    <label>Destination</label>
                    <input
                        type="text"
                        placeholder="e.g. Paris, Tokyo, New York"
                        value={formData.destination}
                        onChange={(e) => setFormData({...formData, destination: e.target.value})}
                        required
                    />
                </div>

                <div className="date-row">
                    <div className="input-group">
                        <label>Start Date</label>
                        <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>End Date</label>
                        <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                            required
                        />
                    </div>
                </div>

                <div className="interests-section">
                    <label>Interests</label>
                    <div className="interest-chips">
                        {availableInterests.map(interest => (
                            <button
                                type="button"
                                key={interest}
                                className={formData.interests.includes(interest) ? 'active' : ''}
                                onClick={() => handleInterestToggle(interest)}
                            >
                                {interest}
                            </button>
                        ))}
                    </div>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? <><Loader2 className="animate-spin" /> Generating Plan...</> : 'Plan My Trip'}
                </button>
            </form>
        </div>
    );
};

export default TripForm;
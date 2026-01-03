import React from 'react';
import { ChevronRight, Calendar } from 'lucide-react';

const Timeline = ({ itinerary, onDayClick }) => {
    return (
        <div className="timeline-list">
            {itinerary.map((day) => (
                <button
                    key={day.dayNumber}
                    className="day-selector-btn"
                    onClick={() => onDayClick(day)}
                >
                    <div className="day-badge">
                        <Calendar size={16} />
                        <span>Day {day.dayNumber}</span>
                    </div>

                    <div className="day-content">
                        <span className="day-theme">{day.theme}</span>
                        <span className="activity-count">{day.activities.length} activities</span>
                    </div>

                    <ChevronRight className="arrow-icon" size={20} />
                </button>
            ))}
        </div>
    );
};

export default Timeline;
import React, { useState } from 'react';
import { ArrowLeft, Clock, X, ZoomIn } from 'lucide-react';
import {getActivityImages} from "../utils/getActivityImages";

const DayDetailView = ({ day, onBack }) => {
    const [selectedImg, setSelectedImg] = useState(null);

    return (
        <div className="day-detail-container">
            {/* 1. IMAGE MODAL (LIGHTBOX) */}
            {selectedImg && (
                <div className="modal-overlay" onClick={() => setSelectedImg(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setSelectedImg(null)}>
                            <X size={30} />
                        </button>
                        <img src={selectedImg} alt="Enlarged view" className="modal-image" />
                    </div>
                </div>
            )}

            {/* 2. HEADER */}
            <button onClick={onBack} className="back-to-overview-btn">
                <ArrowLeft size={18} /> Back to Full Plan
            </button>

            <div className="detail-header">
                <h2>Day {day.dayNumber}: {day.theme}</h2>
            </div>

            {/* 3. ACTIVITIES */}
            <div className="detail-activities">
                {day.activities.map((act, i) => {
                    // Get the unified list of images
                    const images = getActivityImages(act);

                    return (
                        <div key={i} className="activity-detail-card">
                            <div className="time-tag"><Clock size={14}/> {act.time}</div>
                            <h3>{act.siteName}</h3>
                            <p>{act.description}</p>

                            <div className="horizontal-gallery">
                                {images.map((url, imgIdx) => (
                                    <div
                                        key={imgIdx}
                                        className="gallery-item"
                                        onClick={() => setSelectedImg(url)}
                                    >
                                        <img src={url} alt={act.siteName} className="gallery-img" />
                                        <div className="img-hover-overlay">
                                            <ZoomIn size={20} color="white" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DayDetailView;
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- START ICON FIX ---
// This explicitly sets the URLs for the marker icons to prevent broken image icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
// --- END ICON FIX ---

/**
 * 🚀 SMART CAMERA: MapController
 */
function MapController({ allPositions, activeDay }) {
    const map = useMap();

    useEffect(() => {
        if (allPositions && allPositions.length > 0) {
            const bounds = L.latLngBounds(allPositions);

            // Calculate the distance between corners to see if it's a city or a country
            const distance = bounds.getNorthEast().distanceTo(bounds.getSouthWest());
            const isCityTrip = distance < 20000; // Less than 20km = likely a city trip

            map.fitBounds(bounds, {
                // Large padding for countries, small padding for cities
                padding: isCityTrip ? [30, 30] : [60, 60],

                // CRITICAL:
                // If it's a city trip, we don't want to be at Zoom 6 (world view)
                // If it's a country trip, we don't want to be at Zoom 18 (street view)
                maxZoom: activeDay ? 15 : (isCityTrip ? 13 : 7),

                animate: true,
                duration: 1.5
            });
        }
    }, [allPositions, activeDay, map]);

    return null;
}

const MapView = ({ plan, activeDay }) => {
    // Gather ALL coordinates for the whole trip for the Polyline
    const allTripPositions = plan?.itinerary?.flatMap(day =>
        day.activities.map(act => [act.coordinates.lat, act.coordinates.lng])
    ) || [];

    // Filter markers only for the currently displayed view
    const displayItinerary = activeDay ? [activeDay] : (plan?.itinerary || []);

    // Coordinates specifically for the MapController to focus on
    const focalPositions = activeDay
        ? activeDay.activities.map(act => [act.coordinates.lat, act.coordinates.lng])
        : allTripPositions;

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <MapContainer
                center={[13.7367, 100.5231]}
                zoom={5}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />

                <MapController allPositions={focalPositions} activeDay={activeDay} />

                {displayItinerary.map((day) =>
                    day.activities.map((act, i) => (
                        <Marker
                            key={`${day.dayNumber}-${act.siteName}-${i}`}
                            position={[act.coordinates.lat, act.coordinates.lng]}
                        >
                            <Popup>
                                <div style={{ minWidth: '150px' }}>
                                    <strong style={{ fontSize: '14px' }}>{act.siteName}</strong>
                                    <p style={{ margin: '5px 0', fontSize: '12px' }}>{act.description}</p>
                                    {act.imageUrls && act.imageUrls.length > 0 && (
                                        <img
                                            src={act.imageUrls[0]}
                                            alt={act.siteName}
                                            style={{ width: '100%', borderRadius: '4px', marginTop: '5px' }}
                                        />
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    ))
                )}

                {allTripPositions.length > 1 && (
                    <Polyline
                        positions={allTripPositions}
                        color="#3b82f6"
                        weight={3}
                        dashArray="10, 10"
                        opacity={0.6}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default MapView;
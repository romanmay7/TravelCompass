import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ChevronRight } from 'lucide-react';
import TripForm from "./TripForm";

const UserPlansList = ({ onSelectPlan }) => {
    const [plans, setPlans] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        // Only fetch if user and token exist
        if (user && user.token) {
            axios.get(`http://localhost:8080/api/plans/user/${user.id}`, {
                headers: {
                    // This is the missing piece!
                    Authorization: `Bearer ${user.token}`
                }
            })
                .then(res => setPlans(res.data))
                .catch(err => console.error("Error fetching plans:", err));
        }
    }, [user.id, user.token]); // Add user.token to dependency array

    return (
        <div className="user-plans-list">
            <h3>Your Trips</h3>
            {plans.length === 0 ? <p>No trips found yet.</p> :
                plans.map(p => (
                    <div key={p.id} className="plan-card" onClick={() => onSelectPlan(p)}>
                        <h4>{p.destination}</h4>
                        <small>{new Date(p.startDate).toLocaleDateString()}</small>
                        <ChevronRight size={16} />
                    </div>
                ))
            }
        </div>
    );
};

export default UserPlansList;
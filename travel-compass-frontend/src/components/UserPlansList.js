import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ChevronRight } from 'lucide-react';
import TripForm from "./TripForm";

const UserPlansList = ({ onSelectPlan }) => {
    const [plans, setPlans] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchPlans = async () => {
            if (!user?.token || !user?.id) return;

            try {
                const res = await axios.get(`http://localhost:8080/api/plans/user/${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                setPlans(res.data);
            } catch (err) {
                console.error("Error fetching plans:", err.response?.status);
                // If you get a 403 here, your JWT is invalid or expired
            }
        };

        fetchPlans();
    }, [user?.id, user?.token]);

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
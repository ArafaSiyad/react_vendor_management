import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Users, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState({ orders: 0, vendors: 0, active: 0, closed: 0 });
    const { user } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const ordersRes = await axios.get('http://localhost:5000/api/orders', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                const vendorsRes = await axios.get('http://localhost:5000/api/vendors', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });

                const orders = ordersRes.data;
                setStats({
                    orders: orders.length,
                    vendors: vendorsRes.data.length,
                    active: orders.filter(o => o.status !== 'Closed' && o.status !== 'Cancelled').length,
                    closed: orders.filter(o => o.status === 'Closed').length
                });
            } catch (error) {
                console.error('Error fetching stats', error);
            }
        };
        fetchStats();
    }, [user]);

    const statCards = [
        { label: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: '#6366f1' },
        { label: 'Active POs', value: stats.active, icon: Clock, color: '#f59e0b' },
        { label: 'Fulfilled', value: stats.closed, icon: CheckCircle, color: '#22c55e' },
        { label: 'Total Vendors', value: stats.vendors, icon: Users, color: '#8b5cf6' }
    ];

    return (
        <div className="fade-in" style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Welcome, {user.name}</h1>
                <p style={{ color: 'var(--text-muted)' }}>Here is what's happening in your supply chain today.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {statCards.map((stat, i) => (
                    <div key={i} className="glass" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ background: `${stat.color}20`, padding: '0.75rem', borderRadius: '12px' }}>
                                <stat.icon color={stat.color} size={24} />
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)', display: 'flex', alignItems: 'center' }}>
                                <TrendingUp size={14} style={{ marginRight: '4px' }} /> +12%
                            </span>
                        </div>
                        <div style={{ fontSize: '1.875rem', fontWeight: 800 }}>{stat.value}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="glass" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Recent Activity</h3>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>
                        All systems operational.
                        <br /><br />
                        <Link to="/orders" className="btn btn-primary" style={{ display: 'inline-flex', marginTop: '1rem' }}>View All Orders</Link>
                    </div>
                </div>
                <div className="glass" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Workflow Efficiency</h3>
                    <div style={{ height: '150px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--border)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
                        Chart Placeholder
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

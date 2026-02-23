import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, Clock, User, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';

const TRANSITION_MAP = {
    'Created': {
        nextStates: ['Approved', 'Cancelled'],
        allowedRoles: ['Admin']
    },
    'Approved': {
        nextStates: ['Delivered', 'Cancelled'],
        allowedRoles: ['Admin', 'Staff']
    },
    'Delivered': {
        nextStates: ['Closed'],
        allowedRoles: ['Admin', 'Staff']
    },
    'Closed': { nextStates: [], allowedRoles: [] },
    'Cancelled': { nextStates: [], allowedRoles: [] }
};

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/orders/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setOrder(data);
        } catch (error) {
            console.error('Error fetching order', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTransition = async (nextStatus) => {
        setError('');
        try {
            await axios.put(`http://localhost:5000/api/orders/${id}/status`, {
                nextStatus,
                comments
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setComments('');
            fetchOrder();
        } catch (error) {
            setError(error.response?.data?.message || 'Transition failed');
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
    if (!order) return <div style={{ padding: '2rem' }}>Order not found</div>;

    const rules = TRANSITION_MAP[order.status] || { nextStates: [], allowedRoles: [] };
    const canTransition = rules.allowedRoles.includes(user.role);

    return (
        <div className="fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <button
                onClick={() => navigate('/orders')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.9rem' }}
            >
                <ChevronLeft size={18} /> Back to Orders
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                {/* Main content */}
                <div>
                    <div className="glass" style={{ padding: '2rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                            <div>
                                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Purchase Order #{order.poNumber}</h1>
                                <p style={{ color: 'var(--text-muted)' }}>Created on {new Date(order.orderDate).toLocaleDateString()}</p>
                            </div>
                            <span className={`status-badge status-${order.status.toLowerCase()}`} style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                                {order.status}
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                            <div>
                                <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Vendor Details</h3>
                                <p style={{ fontWeight: 600 }}>{order.vendor.name}</p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{order.vendor.vendorCode}</p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{order.vendor.address}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Order Total</h3>
                                <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>${order.totalAmount.toLocaleString()}</p>
                            </div>
                        </div>

                        <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>Order Items</h3>
                        <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: 'rgba(255,255,255,0.03)' }}>
                                    <tr>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem' }}>Description</th>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.8rem' }}>Qty</th>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.8rem' }}>Price</th>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.8rem' }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item, idx) => (
                                        <tr key={idx} style={{ borderTop: '1px solid var(--border)' }}>
                                            <td style={{ padding: '0.75rem 1rem' }}>{item.description}</td>
                                            <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>{item.quantity}</td>
                                            <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>${item.price.toLocaleString()}</td>
                                            <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600 }}>${(item.quantity * item.price).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="glass" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock size={20} color="var(--primary)" /> Timeline & History
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {order.history.slice().reverse().map((event, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: idx === 0 ? 'var(--primary)' : 'var(--border)', boxShadow: idx === 0 ? '0 0 0 4px rgba(99, 102, 241, 0.2)' : 'none' }}></div>
                                        {idx !== order.history.length - 1 && <div style={{ width: '2px', flex: 1, background: 'var(--border)', margin: '4px 0' }}></div>}
                                    </div>
                                    <div style={{ paddingBottom: idx !== order.history.length - 1 ? '0.5rem' : 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{event.status}</span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• {new Date(event.changedAt).toLocaleString()}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                            <User size={14} /> {event.changedBy?.name} ({event.changedBy?.role})
                                        </div>
                                        {event.comments && (
                                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid var(--border)' }}>
                                                <MessageSquare size={14} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> {event.comments}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Transitions */}
                <div>
                    <div className="glass" style={{ padding: '1.5rem', position: 'sticky', top: '7rem' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.5rem', letterSpacing: '1px' }}>
                            State Management
                        </h3>

                        {error && (
                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.8rem', display: 'flex', gap: '0.5rem' }}>
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        {!canTransition && rules.nextStates.length > 0 && (
                            <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--warning)', color: 'var(--warning)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.8rem', display: 'flex', gap: '0.5rem' }}>
                                <AlertCircle size={16} /> Only {rules.allowedRoles.join('/')} can update this status.
                            </div>
                        )}

                        <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                            <label>Transition Comments</label>
                            <textarea
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                placeholder="Add a note about this change..."
                                style={{ width: '100%', height: '80px', background: 'var(--bg-dark)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', padding: '0.75rem', fontSize: '0.875rem', resize: 'none' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {rules.nextStates.length > 0 ? (
                                rules.nextStates.map(state => (
                                    <button
                                        key={state}
                                        className={`btn ${state === 'Cancelled' ? 'btn-outline' : 'btn-primary'}`}
                                        disabled={!canTransition}
                                        onClick={() => handleTransition(state)}
                                        style={{ width: '100%', justifyContent: 'center', opacity: canTransition ? 1 : 0.5 }}
                                    >
                                        {state === 'Cancelled' ? 'Cancel Order' : `Move to ${state}`}
                                    </button>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--success)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                    <CheckCircle2 size={32} />
                                    <span style={{ fontWeight: 600 }}>Workflow Completed</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order reached terminal state: {order.status}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;

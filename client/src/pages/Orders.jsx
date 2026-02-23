import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Eye, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/orders', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    const getStatusClass = (status) => {
        return `status-badge status-${status.toLowerCase()}`;
    };

    return (
        <div className="fade-in" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Purchase Orders</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage and track your order lifecycles</p>
                </div>
                {(user.role === 'Admin' || user.role === 'Staff') && (
                    <button className="btn btn-primary">
                        <Plus size={20} /> Create New PO
                    </button>
                )}
            </div>

            <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Search size={20} color="var(--text-muted)" />
                <input
                    type="text"
                    placeholder="Search by PO number or vendor..."
                    style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                />
            </div>

            <div className="glass" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>PO Number</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Vendor</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Amount</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', textTransform: 'uppercase' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600 }}>#{order.poNumber}</td>
                                <td style={{ padding: '1.25rem 1.5rem' }}>{order.vendor.name}</td>
                                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    {new Date(order.orderDate).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                    <span className={getStatusClass(order.status)}>{order.status}</span>
                                </td>
                                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600 }}>${order.totalAmount.toLocaleString()}</td>
                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                    <button
                                        className="btn btn-outline"
                                        style={{ padding: '0.5rem' }}
                                        onClick={() => navigate(`/orders/${order._id}`)}
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {orders.length === 0 && !loading && (
                    <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No purchase orders found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, Building2 } from 'lucide-react';

const Vendors = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/vendors', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setVendors(data);
            } catch (error) {
                console.error('Error fetching vendors', error);
            } finally {
                setLoading(false);
            }
        };
        fetchVendors();
    }, [user]);

    return (
        <div className="fade-in" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Vendor Directory</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage and onboard your supply chain partners</p>
                </div>
                {(user.role === 'Admin' || user.role === 'Staff') && (
                    <button className="btn btn-primary">
                        <Plus size={20} /> Register Vendor
                    </button>
                )}
            </div>

            <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Search size={20} color="var(--text-muted)" />
                <input
                    type="text"
                    placeholder="Search vendors by name or code..."
                    style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {vendors.map((vendor) => (
                    <div key={vendor._id} className="glass" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ background: 'var(--bg-dark)', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                <Building2 size={24} color="var(--primary)" />
                            </div>
                            <div>
                                <h3 style={{ fontWeight: 700 }}>{vendor.name}</h3>
                                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>{vendor.vendorCode}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                            <div style={{ color: 'var(--text-muted)' }}>
                                <strong style={{ color: 'var(--text-main)' }}>Contact:</strong> {vendor.contactDetails}
                            </div>
                            <div style={{ color: 'var(--text-muted)' }}>
                                <strong style={{ color: 'var(--text-main)' }}>Address:</strong> {vendor.address}
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                            <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>Edit Profile</button>
                            <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>View Analytics</button>
                        </div>
                    </div>
                ))}
            </div>

            {vendors.length === 0 && !loading && (
                <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No vendors registered yet.
                </div>
            )}
        </div>
    );
};

export default Vendors;

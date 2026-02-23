import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, ShoppingCart, LogOut, Package } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass" style={{
            margin: '1rem',
            padding: '0.75rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: '1rem',
            zIndex: 100
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Package size={28} color="var(--primary)" />
                <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.5px' }}>VENDOR<span style={{ color: 'var(--primary)' }}>FLOW</span></span>
            </div>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <LayoutDashboard size={18} /> Dashboard
                </Link>
                <Link to="/orders" style={{ color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <ShoppingCart size={18} /> Orders
                </Link>
                <Link to="/vendors" style={{ color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <Users size={18} /> Vendors
                </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.role}</div>
                </div>
                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem' }}>
                    <LogOut size={18} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;

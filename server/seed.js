require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Vendor = require('./models/Vendor');
const PurchaseOrder = require('./models/PurchaseOrder');
const { PO_STATUS } = require('./utils/orderWorkflow');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Vendor.deleteMany({});
        await PurchaseOrder.deleteMany({});

        // 1. Create Users
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@test.com',
            password: '123456',
            role: 'Admin'
        });

        const staff = await User.create({
            name: 'Staff Member',
            email: 'staff@test.com',
            password: '123456',
            role: 'Staff'
        });

        const vendorUser = await User.create({
            name: 'Vendor Partner',
            email: 'vendor@test.com',
            password: '123456',
            role: 'Vendor'
        });

        console.log('Users seeded.');

        // 2. Create Vendors
        const vendor1 = await Vendor.create({
            name: 'Global Tech Solutions',
            contactDetails: 'support@globaltech.com | +1 555-0123',
            address: '123 Innovation Drive, Silicon Valley, CA',
            vendorCode: 'VND-GTS-001'
        });

        const vendor2 = await Vendor.create({
            name: 'Apex Manufacturing',
            contactDetails: 'info@apex.com | +1 555-9876',
            address: '456 Industrial Way, Detroit, MI',
            vendorCode: 'VND-APX-002'
        });

        console.log('Vendors seeded.');

        // 3. Create Purchase Orders
        await PurchaseOrder.create({
            poNumber: 'PO-2024-001',
            vendor: vendor1._id,
            items: [
                { description: 'High-Performance Laptops', quantity: 5, price: 1200 },
                { description: 'External Monitors', quantity: 10, price: 300 }
            ],
            totalAmount: 9000,
            status: PO_STATUS.CREATED,
            history: [{
                status: PO_STATUS.CREATED,
                changedBy: admin._id,
                comments: 'Quarterly hardware refresh initialization'
            }]
        });

        const approvedPO = await PurchaseOrder.create({
            poNumber: 'PO-2024-002',
            vendor: vendor2._id,
            items: [
                { description: 'Raw Material - Aluminum', quantity: 50, price: 200 }
            ],
            totalAmount: 10000,
            status: PO_STATUS.APPROVED,
            history: [
                { status: PO_STATUS.CREATED, changedBy: staff._id, comments: 'Production restock' },
                { status: PO_STATUS.APPROVED, changedBy: admin._id, comments: 'Budget approved' }
            ]
        });

        console.log('Orders seeded.');
        console.log('Seeding complete! Use admin@test.com / 123456 to log in.');
        process.exit();
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedData();

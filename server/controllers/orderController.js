const PurchaseOrder = require('../models/PurchaseOrder');
const { validateTransition } = require('../utils/orderWorkflow');

// @desc    Create a new PO
// @route   POST /api/orders
// @access  Private (Staff/Admin)
const createOrder = async (req, res) => {
    try {
        const { poNumber, vendor, items, totalAmount } = req.body;
        const order = new PurchaseOrder({
            poNumber,
            vendor,
            items,
            totalAmount,
            history: [{
                status: 'Created',
                changedBy: req.user._id,
                comments: 'Order Initialized'
            }]
        });
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
    try {
        let query = {};
        // Vendors can only see their own orders (assuming user model links to vendor if role is Vendor)
        if (req.user.role === 'Vendor') {
            // This would require a link between User and Vendor which we can add later if needed
            // For now, let's assume Vendors see nothing unless we filter by vendor ID
            return res.status(403).json({ message: 'Vendor access to orders not yet fully implemented' });
        }

        const orders = await PurchaseOrder.find(query).populate('vendor', 'name vendorCode');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status (The Centralized State Transition logic)
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
    try {
        const { nextStatus, comments } = req.body;
        const order = await PurchaseOrder.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Centralized Validation Check
        const validation = validateTransition(order.status, nextStatus, req.user.role);

        if (!validation.isValid) {
            return res.status(400).json({ message: validation.message });
        }

        // Apply Transition
        order.status = nextStatus;
        order.history.push({
            status: nextStatus,
            changedBy: req.user._id,
            comments: comments || `Status changed to ${nextStatus}`
        });

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await PurchaseOrder.findById(req.params.id)
            .populate('vendor', 'name contactDetails address vendorCode')
            .populate('history.changedBy', 'name role');

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getOrders,
    updateOrderStatus,
    getOrderById
};

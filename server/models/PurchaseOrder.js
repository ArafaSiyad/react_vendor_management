const mongoose = require('mongoose');
const { PO_STATUS } = require('../utils/orderWorkflow');

const poItemSchema = new mongoose.Schema({
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
});

const purchaseOrderSchema = new mongoose.Schema({
    poNumber: { type: String, required: true, unique: true },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    items: [poItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: Object.values(PO_STATUS),
        default: PO_STATUS.CREATED
    },
    orderDate: { type: Date, default: Date.now },
    history: [
        {
            status: String,
            changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            changedAt: { type: Date, default: Date.now },
            comments: String
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);

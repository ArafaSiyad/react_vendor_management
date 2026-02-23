const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contactDetails: { type: String, required: true },
    address: { type: String, required: true },
    vendorCode: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);

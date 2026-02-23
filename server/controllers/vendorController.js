const Vendor = require('../models/Vendor');

// @desc    Get all vendors
// @route   GET /api/vendors
// @access  Private (Staff/Admin)
const getVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find({});
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a vendor
// @route   POST /api/vendors
// @access  Private (Staff/Admin)
const createVendor = async (req, res) => {
    try {
        const { name, contactDetails, address, vendorCode } = req.body;
        const vendor = new Vendor({ name, contactDetails, address, vendorCode });
        const createdVendor = await vendor.save();
        res.status(201).json(createdVendor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getVendors, createVendor };

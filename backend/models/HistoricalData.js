const mongoose = require('mongoose');

const HistoricalDataSchema = new mongoose.Schema({
    batch: {
        type: Number, // e.g., 2023, 2024
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    studentName: String,
    company: {
        type: String,
        required: true
    },
    package: {
        type: Number, // In LPA
        required: true
    },
    status: {
        type: String,
        enum: ['Placed', 'Opted Out', 'Not Placed'],
        default: 'Placed'
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('HistoricalData', HistoricalDataSchema);

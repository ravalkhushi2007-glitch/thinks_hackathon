const mongoose = require('mongoose');

const PlacementRecordSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    package: {
        type: Number, // In LPA
        required: true
    },
    skillsRequired: [String],
    hiringYear: {
        type: Number,
        required: true
    },
    selectedStudentsCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PlacementRecord', PlacementRecordSchema);

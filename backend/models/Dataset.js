const mongoose = require('mongoose');

const DatasetSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recordsCount: {
        type: Number,
        default: 0
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    // Storing path or reference to the actual data if needed, or simply ingesting it into PlacementRecords
    filePath: String
});

module.exports = mongoose.model('Dataset', DatasetSchema);

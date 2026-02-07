const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recommendedSkills: [String],
    placementProbability: Number,
    suggestedCourses: [String],
    hiringCompanies: [{
        name: String,
        avg_salary: String,
        skills: [String],
        url: String
    }],
    generatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Recommendation', RecommendationSchema);

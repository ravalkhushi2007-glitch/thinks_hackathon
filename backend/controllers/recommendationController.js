const axios = require('axios');
const Recommendation = require('../models/Recommendation');

exports.getRecommendations = async (req, res) => {
    try {
        const user = req.user;

        // Prepare data for ML service
        const studentData = {
            skills: user.profile?.skills || [],
            gpa: user.profile?.gpa || 0,
            interests: user.profile?.interests || [],
            domain: user.profile?.domain || 'General'
        };

        console.log(`[Backend] Analyzing for User: ${user.email}, Domain: ${studentData.domain}`);
        console.log(`[Backend] Sending Skills: ${JSON.stringify(studentData.skills)}`);

        // Call ML Service
        const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
        const response = await axios.post(`${mlServiceUrl}/recommend`, studentData);

        const { recommended_skills, placement_probability, suggested_courses, hiring_companies } = response.data;

        // Save recommendation
        let recommendation = await Recommendation.findOne({ studentId: user._id });
        if (recommendation) {
            recommendation.recommendedSkills = recommended_skills;
            recommendation.placementProbability = placement_probability;
            recommendation.suggestedCourses = suggested_courses;
            recommendation.hiringCompanies = hiring_companies;
            recommendation.generatedAt = Date.now();
            await recommendation.save();
        } else {
            recommendation = await Recommendation.create({
                studentId: user._id,
                recommendedSkills: recommended_skills,
                placementProbability: placement_probability,
                suggestedCourses: suggested_courses,
                hiringCompanies: hiring_companies
            });
        }

        res.json(recommendation);
    } catch (error) {
        console.error('ML Service Error:', error.message);
        res.status(500).json({ message: 'Error fetching recommendations' });
    }
};

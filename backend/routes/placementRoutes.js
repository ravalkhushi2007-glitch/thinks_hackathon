const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadDataset } = require('../controllers/uploadController');
const { getAnalytics, getTrendAnalysis } = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/authMiddleware');

const upload = multer({ dest: 'uploads/' });

const { getRecommendations } = require('../controllers/recommendationController');

router.post('/upload', protect, admin, upload.single('file'), uploadDataset);
router.get('/analytics', protect, getAnalytics);
router.get('/trends', protect, getTrendAnalysis);
router.post('/recommend', protect, getRecommendations);

module.exports = router;

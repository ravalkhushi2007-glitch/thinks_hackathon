const PlacementRecord = require('../models/PlacementRecord');
const HistoricalData = require('../models/HistoricalData');

exports.getAnalytics = async (req, res) => {
    try {
        const totalPlacements = await PlacementRecord.countDocuments();
        const avgPackage = await PlacementRecord.aggregate([
            { $group: { _id: null, avg: { $avg: '$package' } } }
        ]);

        const topCompanies = await PlacementRecord.aggregate([
            { $group: { _id: '$companyName', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const skillsDistribution = await PlacementRecord.aggregate([
            { $unwind: '$skillsRequired' },
            { $group: { _id: '$skillsRequired', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Add trend data from HistoricalData
        const salaryTrends = await HistoricalData.aggregate([
            { $group: { _id: '$batch', avgSalary: { $avg: '$package' } } },
            { $sort: { _id: 1 } }
        ]);

        const branchTrends = await HistoricalData.aggregate([
            { $group: { _id: '$branch', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({
            totalPlacements,
            avgPackage: avgPackage[0] ? avgPackage[0].avg.toFixed(2) : 0,
            topCompanies,
            topSkills: skillsDistribution,
            salaryTrends: salaryTrends.map(t => ({ year: t._id, salary: t.avgSalary.toFixed(2) })),
            branchTrends: branchTrends.map(t => ({ branch: t._id, count: t.count }))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTrendAnalysis = async (req, res) => {
    try {
        const yearOverYear = await HistoricalData.aggregate([
            {
                $group: {
                    _id: "$batch",
                    avgPackage: { $avg: "$package" },
                    maxPackage: { $max: "$package" },
                    studentCount: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const branchBreakdown = await HistoricalData.aggregate([
            {
                $group: {
                    _id: "$branch",
                    count: { $sum: 1 },
                    avgPackage: { $avg: "$package" }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.json({
            yearOverYear: yearOverYear.map(item => ({
                year: item._id,
                avgPackage: parseFloat(item.avgPackage.toFixed(2)),
                maxPackage: item.maxPackage,
                count: item.studentCount
            })),
            branchBreakdown: branchBreakdown.map(item => ({
                branch: item._id,
                count: item.count,
                avgPackage: parseFloat(item.avgPackage.toFixed(2))
            }))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

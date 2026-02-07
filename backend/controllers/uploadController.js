const Dataset = require('../models/Dataset');
const PlacementRecord = require('../models/PlacementRecord');
const HistoricalData = require('../models/HistoricalData');
const fs = require('fs');
const csv = require('csv-parser');

exports.uploadDataset = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const { filename, path } = req.file;
    const results = [];

    try {
        // Save Dataset Metadata
        const dataset = await Dataset.create({
            filename: req.file.originalname,
            uploadedBy: req.user._id,
            filePath: path
        });

        // Parse CSV and Bulk Insert
        fs.createReadStream(path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {
                    // Check if it's Historical Data (has Batch/Branch) or General Placement Data
                    const isHistorical = results.some(row => row.batch || row.Batch || row.branch || row.Branch);

                    if (isHistorical) {
                        const formattedHistorical = results.map(row => ({
                            batch: parseInt(row.batch || row.Batch || row.year || row.Year),
                            branch: row.branch || row.Branch || 'CSE',
                            studentName: row.name || row.Name || row.student || 'Anonymous',
                            company: row.company || row.Company,
                            package: parseFloat(row.package || row.Package || 0),
                            status: row.status || row.Status || 'Placed'
                        })).filter(r => r.batch && r.company && r.package);

                        await HistoricalData.insertMany(formattedHistorical);
                        dataset.recordsCount = formattedHistorical.length;
                    } else {
                        const formattedRecords = results.map(row => ({
                            companyName: row.company || row.Company,
                            role: row.role || row.Role,
                            package: parseFloat(row.package || row.Package),
                            skillsRequired: (row.skills || row.Skills || '').split(',').map(s => s.trim()),
                            hiringYear: parseInt(row.year || row.Year),
                            selectedStudentsCount: parseInt(row.selected || row.Selected || 1)
                        }));

                        await PlacementRecord.insertMany(formattedRecords);
                        dataset.recordsCount = formattedRecords.length;
                    }

                    await dataset.save();

                    res.status(201).json({
                        message: `Dataset uploaded and processed successfully as ${isHistorical ? 'Historical' : 'Placement'} records`,
                        count: dataset.recordsCount
                    });
                } catch (error) {
                    console.error('CSV Processing Error:', error);
                    res.status(500).json({ message: 'Error processing CSV data', error: error.message });
                } finally {
                    // Optional: Delete file after processing
                    // fs.unlinkSync(path);
                }
            });
    } catch (error) {
        res.status(500).json({ message: 'Server error during upload', error: error.message });
    }
};

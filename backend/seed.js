const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const PlacementRecord = require('./models/PlacementRecord');
const Dataset = require('./models/Dataset');

dotenv.config();

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
        profile: {}
    },
    {
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        password: 'password123',
        role: 'student',
        profile: {
            gpa: 8.5,
            branch: 'CSE',
            year: 4,
            skills: ['Python', 'Django', 'Machine Learning'],
            interests: ['Data Science', 'AI']
        }
    },
    {
        name: 'Priya Patel',
        email: 'priya@example.com',
        password: 'password123',
        role: 'student',
        profile: {
            gpa: 9.2,
            branch: 'ECE',
            year: 4,
            skills: ['C++', 'Embedded Systems', 'IoT'],
            interests: ['Robotics', 'Hardware']
        }
    },
    {
        name: 'Amit Singh',
        email: 'amit@example.com',
        password: 'password123',
        role: 'student',
        profile: {
            gpa: 7.8,
            branch: 'MECH',
            year: 4,
            skills: ['AutoCAD', 'SolidWorks', 'Thermodynamics'],
            interests: ['Automobile', 'Design']
        }
    },
    {
        name: 'Sneha Gupta',
        email: 'sneha@example.com',
        password: 'password123',
        role: 'student',
        profile: {
            gpa: 8.9,
            branch: 'CSE',
            year: 3,
            skills: ['React', 'Node.js', 'MongoDB'],
            interests: ['Web Development', 'Full Stack']
        }
    },
    {
        name: 'Vikram Malhotra',
        email: 'vikram@example.com',
        password: 'password123',
        role: 'student',
        profile: {
            gpa: 6.5,
            branch: 'CIVIL',
            year: 4,
            skills: ['AutoCAD', 'Structural Analysis'],
            interests: ['Construction', 'Infrastructure']
        }
    }
];

const placements = [
    { name: 'Aarav Kumar', company: 'Google', role: 'SDE', package: 2500000, date: '2024-01-15', branch: 'CSE', skills: 'DSA, C++, System Design' },
    { name: 'Vivaan Shah', company: 'Microsoft', role: 'Software Engineer', package: 2200000, date: '2024-01-20', branch: 'CSE', skills: 'Java, Azure, OOPS' },
    { name: 'Aditya Verma', company: 'Amazon', role: 'SDE I', package: 2800000, date: '2024-02-01', branch: 'CSE', skills: 'AWS, Python, DSA' },
    { name: 'Vihaan Reddy', company: 'TCS', role: 'System Engineer', package: 700000, date: '2024-02-10', branch: 'ECE', skills: 'Java, SQL, Communication' },
    { name: 'Arjun Das', company: 'Infosys', role: 'Specialist Programmer', package: 900000, date: '2024-02-15', branch: 'CSE', skills: 'Python, Django, React' },
    { name: 'Sai Krishna', company: 'Wipro', role: 'Project Engineer', package: 650000, date: '2024-02-20', branch: 'MECH', skills: 'C++, SQL' },
    { name: 'Reyansh Gupta', company: 'Accenture', role: 'App Developer', package: 850000, date: '2024-02-25', branch: 'CSE', skills: 'Java, Spring Boot' },
    { name: 'Ayaan Khan', company: 'Capgemini', role: 'Analyst', package: 600000, date: '2024-03-01', branch: 'ECE', skills: 'C, Embedded, SQL' },
    { name: 'Ishaan Joshi', company: 'Goldman Sachs', role: 'Analyst', package: 2000000, date: '2024-03-05', branch: 'CSE', skills: 'C++, Maths, Algo' },
    { name: 'Dhruv Singh', company: 'Adobe', role: 'MTS', package: 2400000, date: '2024-03-10', branch: 'CSE', skills: 'C++, OS, DBMS' },
    { name: 'Kabir Mehta', company: 'Oracle', role: 'Server Technology', package: 1800000, date: '2024-03-15', branch: 'CSE', skills: 'Java, Cloud, SQL' },
    { name: 'Ananya Sharma', company: 'Deloitte', role: 'Consultant', package: 1200000, date: '2024-03-20', branch: 'IT', skills: 'Python, Excel, Tableau' },
    { name: 'Diya Patel', company: 'IBM', role: 'Data Scientist', package: 1500000, date: '2024-03-25', branch: 'CSE', skills: 'Python, ML, AI' },
    { name: 'Saanvi Rao', company: 'Flipkart', role: 'SDE I', package: 1900000, date: '2024-04-01', branch: 'CSE', skills: 'Java, React, System Design' },
    { name: 'Myra Singh', company: 'Walmart', role: 'SDE II', package: 2100000, date: '2024-04-05', branch: 'IT', skills: 'Java, Spring, Microservices' },
    { name: 'Zara Ali', company: 'Uber', role: 'SDE', package: 3000000, date: '2024-04-10', branch: 'CSE', skills: 'Go, Distributed Systems' },
    { name: 'Aadhya Gupta', company: 'Atlassian', role: 'SDE', package: 3200000, date: '2024-04-15', branch: 'CSE', skills: 'Java, React, AWS' },
    { name: 'Pari Verma', company: 'Salesforce', role: 'MTS', package: 2600000, date: '2024-04-20', branch: 'CSE', skills: 'Java, Apex, LWC' },
    { name: 'Swati Reddy', company: 'Cisco', role: 'Network Engineer', package: 1400000, date: '2024-04-25', branch: 'ECE', skills: 'Networking, C, Linux' },
    { name: 'Kavya Nair', company: 'Juniper', role: 'Software Engineer', package: 1600000, date: '2024-04-30', branch: 'ECE', skills: 'C++, Networking, OS' },
    { name: 'Rohan Malhotra', company: 'Nvidia', role: 'System Software Engineer', package: 2800000, date: '2024-05-01', branch: 'CSE', skills: 'C++, CUDA, OS' },
    { name: 'Kartik Goel', company: 'Qualcomm', role: 'Engineer', package: 1800000, date: '2024-05-05', branch: 'ECE', skills: 'C, Embedded, DSP' },
    { name: 'Aryan Jain', company: 'Intel', role: 'Graphics Engineer', package: 1700000, date: '2024-05-10', branch: 'CSE', skills: 'C++, OpenGL, Architecture' },
    { name: 'Rishabh Pant', company: 'AMD', role: 'Design Engineer', package: 1600000, date: '2024-05-15', branch: 'ECE', skills: 'Verilog, FPGA, Digital Design' },
    { name: 'Kunal Shah', company: 'Samsung', role: 'R&D Engineer', package: 1400000, date: '2024-05-20', branch: 'CSE', skills: 'Java, Android, Kotlin' }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Clear existing data
        await User.deleteMany({});
        await PlacementRecord.deleteMany({});
        await Dataset.deleteMany({});
        console.log('Data Cleared');

        // Seed Users
        // Note: Password hashing is handled by pre-save hook in User model
        const createdUsers = await User.create(users);
        console.log(`Imported ${createdUsers.length} Users`);

        // Seed Placements
        const placementDocs = placements.map(p => ({
            companyName: p.company,
            role: p.role,
            package: p.package / 100000, // Schema expects LPA (e.g. 2500000 -> 25) ? No, schema says Number, let's keep consistent. Actually comment says "In LPA". Better convert.
            skillsRequired: p.skills.split(',').map(s => s.trim()),
            hiringYear: 2024,
            selectedStudentsCount: Math.floor(Math.random() * 10) + 1
        }));

        const createdPlacements = await PlacementRecord.create(placementDocs);
        console.log(`Imported ${createdPlacements.length} Placement Records`);

        console.log('Seeding Completed Successfully');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedDB();

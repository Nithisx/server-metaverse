const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
const { EmployeeModel, ActivityModel, AttendanceModel } = require('./models/Employee');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/student")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
    });

// Admin Registration Route
app.post('/admin', (req, res) => {
    const { name, email, password } = req.body;

    EmployeeModel.findOne({ email })
        .then((user) => {
            if (user) {
                return res.status(400).send("Admin already exists");
            }

            const newAdmin = new EmployeeModel({ name, email, password });
            return newAdmin.save();
        })
        .then(() => {
            res.status(200).send("Admin registered successfully");
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Internal server error");
        });
});

// Login Route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    EmployeeModel.findOne({ email, password })
        .then((user) => {
            if (user) {
                console.log("User found");
                res.status(200).send({ isAdmin: true, email: user.email });
            } else {
                console.log("User not found or incorrect password");
                res.status(404).send("User not found or incorrect password");
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Internal server error");
        });
});

// Activity Submission Route
app.post('/activity', (req, res) => {
    const { title, username } = req.body;
    const file = req.file; // Assume you're handling file uploads

    const newActivity = new ActivityModel({
        title,
        username,
        file: file ? file.filename : null,
    });

    newActivity.save()
        .then(() => {
            res.status(200).send("Activity submitted successfully");
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Internal server error");
        });
});

// Attendance Logging Route
app.post('/attendance', (req, res) => {
    const { date, time, latitude, longitude, username, email } = req.body;

    const newAttendance = new AttendanceModel({
        date,
        time,
        latitude,
        longitude,
        username,
        email
    });

    newAttendance.save()
        .then(() => {
            res.status(200).send("Attendance logged successfully");
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Internal server error");
        });
});

// Fetch all users for the admin dashboard
app.get('/users', async (req, res) => {
    try {
        const users = await EmployeeModel.find({});
        res.json(users);
    } catch (err) {
        res.status(500).send('Error fetching users');
    }
});

// Fetch a specific user's data by email and include all attendances
app.get('/user/:email', async (req, res) => {
    try {
        const email = req.params.email;

        // Fetch user by email
        const user = await EmployeeModel.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Fetch activities and attendance by username (assuming username is same as name in this case)
        const activities = await ActivityModel.find({ username: user.name });
        const attendance = await AttendanceModel.find({ email });

        // Return user details along with activities and attendance
        res.json({ user, activities, attendance });
    } catch (err) {
        res.status(500).send('Error fetching user details');
    }
});


// Start the server
app.listen(3002, () => {
    console.log("Server is running on port 3001");
});

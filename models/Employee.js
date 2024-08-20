const mongoose = require('mongoose');

// Employee Schema
const EmployeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true } // Ensure password is required
});

// Activity Schema
const ActivitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true }, // Reference to Employee
    file: { type: String, required: true } // Ensure the file is required
});

// Attendance Schema
const AttendanceSchema = new mongoose.Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true }, // Reference to Employee
});

// Models
const EmployeeModel = mongoose.model("Employee", EmployeeSchema);
const ActivityModel = mongoose.model("Activity", ActivitySchema);
const AttendanceModel = mongoose.model("Attendance", AttendanceSchema);

module.exports = { EmployeeModel, ActivityModel, AttendanceModel };

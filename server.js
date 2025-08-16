// Import modules
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
require("dotenv").config();

// Start app
const app = express();
app.use(express.json());
app.use(cors());

// Connection uri
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=${process.env.DB_DATABASE}`;

// Database client options
const clientOptions = {serverApi: {version: '1', strict: true, deprecationErrors: true}};

// Create database schemas
const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: [true, "Användarnamn är obligatoriskt"],
		trim: true,
		minlength: [5, "Användarnamn måste vara minst 5 tecken"],
		maxlength: [25, "Användarnamn kan inte överskrida 25 tecken"]
	},
	password: {
		type: String,
		required: [true, "Lösenord är obligatoriskt"],
		trim: true,
		minlength: [10, "Lösenord måste vara minst 10 tecken"],
		maxlength: [50, "Lösenord kan inte överskrida 50 tecken"]
	},
}, {
	timestamps: true
});
const daedraSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, "Namn är obligatoriskt"],
		trim: true,
		minlength: [5, "Namn måste vara minst 5 tecken"],
		maxlength: [25, "Namn kan inte överskrida 25 tecken"]
	},
	realm: {
		type: String,
		required: [true, "Värld är obligatoriskt"],
		trim: true,
		minlength: [5, "Värld måste vara minst 5 tecken"],
		maxlength: [50, "Värld kan inte överskrida 50 tecken"]
	},
});

// Connect to database
async function dbConnect() {
	try {
		await mongoose.connect(uri, clientOptions);
		console.log("Connected to DB")
	} catch (error) {
		console.log(error);
	}
}

// Start server
app.listen(process.env.PORT, () => {
	console.log("Server live on port", process.env.PORT);
	dbConnect();
});

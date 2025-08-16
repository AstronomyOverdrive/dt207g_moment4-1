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
		required: [true, "Lösenord är obligatoriskt"]
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

// Routing
// Login user
app.post("/login", async (req, res) => {
	try {
		const dbModel = await mongoose.model("useraccounts", userSchema);
		const user = await dbModel.find({username: req.body.username});
		if (user.length !== 0) { // Check if user is found
			const passwordsMatch = await bcrypt.compare(req.body.password, user[0].password);
			if (passwordsMatch) {
				// Sign JWT token
				const payload = {username: user[0].username}
				const token = jwt.sign(payload, process.env.ACCESS_TOKEN, {expiresIn: "6h"});
				res.status(200).json({message: "Login successful", token});
			} else {
				res.status(401).json({message: "Invalid password"});
			}
		} else {
			res.status(404).json({message: "User "+req.body.username+" not found"});
		}
	} catch (error) {
		res.status(500).json({error: 'Internal error: ' + error});
	}
});
// Register user
app.post("/register", async (req, res) => {
	try {
		const dbModel = await mongoose.model("useraccounts", userSchema);
		const user = await dbModel.find({username: req.body.username});
		if (user.length === 0) { // Username is free
			const hashedPassword = await bcrypt.hash(req.body.password, 10);
			const result = await dbModel.create({
				username: req.body.username,
				password: hashedPassword
			});
			res.status(201).json({message: "User "+req.body.username+" created"});
		} else {
			res.status(409).json({message: "Username "+req.body.username+" already taken"});
		}
	} catch (error) {
		res.status(500).json({error: 'Database error: ' + error});
	}
});
// Get daedric princes
app.get("/daedra", authenticateToken, async (req, res) => {
	try {
		const dbModel = await mongoose.model("daedricprinces", daedraSchema);
		const daedra = await dbModel.find({}); // Get all entries
		return res.status(200).json(daedra);
	} catch (error) {
		res.status(500).json({error: 'Database error: ' + error});
	}
});

// Middleware authentication
async function authenticateToken(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null) { // Check if user has a token
		return res.status(401).json({message: "Missing token"});
	}
	// Check if token is valid
	jwt.verify(token, process.env.ACCESS_TOKEN, (error, user) => {
		if (error) {
			return res.status(403).json({message: "Invalid token"});
		}
		req.user = user;
		next();
	});
}

// Start server
app.listen(process.env.PORT, () => {
	console.log("Server live on port", process.env.PORT);
	dbConnect();
});

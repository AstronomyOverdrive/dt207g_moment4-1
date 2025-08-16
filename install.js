// Import modules
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require("dotenv").config();

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
		await mongoose.connection.db.admin().command({ping: 1});
		// Populate database
		console.log(await populateDb());
	} finally {
		await mongoose.disconnect();
	}
}

async function populateDb() {
	try {
		// Users
		// Selecet / create model
		const userModel = await mongoose.model("useraccounts", userSchema);
		// Remove all entries
		await userModel.deleteMany({});
		// Create a test user
		const testPassword = await bcrypt.hash("TestPassword", 10);
		await userModel.create({
			username: "TestUser",
			password: testPassword
		});
		// Daedra
		// Selecet / create model
		const daedraModel = await mongoose.model("daedricprinces", daedraSchema);
		// Remove all entries
		await daedraModel.deleteMany({});
		// Daedric princes to add
		const addEntries = [
			{
				name: "Azura",
				realm: "Moonshadow"
			},
			{
				name: "Boethiah",
				realm: "Attribution's Share"
			},
			{
				name: "Clavicus Vile",
				realm: "The Fields of Regret"
			},
			{
				name: "Hermaeus Mora",
				realm: "Apocrypha"
			},
			{
				name: "Hircine",
				realm: "Hunting Grounds"
			},
			{
				name: "Jyggalag",
				realm: "Jyggalag's realm"
			},
			{
				name: "Malacath",
				realm: "Ashpit"
			},
			{
				name: "Mehrunes Dagon",
				realm: "Deadlands"
			},
			{
				name: "Mephala",
				realm: "Spiral Skein"
			},
			{
				name: "Meridia",
				realm: "Colored Rooms"
			},
			{
				name: "Molag Bal",
				realm: "Coldharbour"
			},
			{
				name: "Namira",
				realm: "Scuttling Void"
			},
			{
				name: "Nocturnal",
				realm: "Evergloam"
			},
			{
				name: "Peryite",
				realm: "Pits of Pestilence"
			},
			{
				name: "Sanguine",
				realm: "Myriad Realms of Revelry"
			},
			{
				name: "Sheogorath",
				realm: "Shivering Isles"
			},
			{
				name: "Vaermina",
				realm: "Quagmire"
			},
			{
				name: "Ithelia",
				realm: "Mirrormoor"
			}
		]
		for (let i = 0; i < addEntries.length; i++) {
			await daedraModel.create(addEntries[i]);
		}
	} catch (error) {
		return "An error occured" + error;
	}
}

dbConnect().catch(console.dir);

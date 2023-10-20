const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const API_BASE_URL = "https://randomuser.me/api/";

app.get("/generate-data", async (req, res) => {
	const { region, errors, seed, page } = req.query;
	try {
		const response = await axios.get(
			`${API_BASE_URL}?results=20&nat=${region}&seed=${seed}`
		);
		const userData = response.data.results.map((user) => ({
			randomIdentifier: user.login.uuid,
			name: `${user.name.first} ${user.name.last}`,
			address: `${user.location.street.name}, ${user.location.city}, ${user.location.country}`,
			phone: user.phone,
		}));
		res.json(userData);
	} catch (error) {
		console.error("Error generating data: ", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

const PORT = 5555;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

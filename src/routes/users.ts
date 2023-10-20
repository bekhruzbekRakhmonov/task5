import { Router, Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import axios from "axios";
import { isValidRegion } from "../validators/users";
config();

const router = Router();
const RANDOMUSER_API_URL: string = "https://randomuser.me/api/";

interface User {
	login: {
		uuid: string;
	};
	name: {
		first: string;
		last: string;
	};
	location: {
		street: {
			name: string;
		};
		city: string;
		country: string;
	};
	phone: string;
}

router.get("/generate-data", async (req: Request, res: Response, next: NextFunction) => {
	const { region, errors, seed, page } = req.query;
	try {
        if (isValidRegion(region as string)) {
            return res.status(400).json({ error: "Invalid or unsupported region" });
        }
		const response = await axios.get(
			`${RANDOMUSER_API_URL}?results=20&nat=${region}&seed=${seed}`
		);
		const userData: Array<{
			randomIdentifier: string;
			name: string;
			address: string;
			phone: string;
		}> = (response.data.results as User[]).map((user: User) => ({
			randomIdentifier: user.login.uuid,
			name: `${user.name.first} ${user.name.last}`,
			address: `${user.location.street.name}, ${user.location.city}, ${user.location.country}`,
			phone: user.phone,
		}));
		res.json(userData);
	} catch (error) {
		next(error);
	}
});


export default router;
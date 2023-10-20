import express, { Router, Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import axios from "axios";
import { isValidRegion } from "../validators/users";
import { generateErrors } from "../services/users";

config();

const router: Router = express.Router();
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

router.get(
	"/",
	async (req: Request, res: Response, next: NextFunction) => {
		const { region, errors, seed, page } = req.query as {
			region: string;
			errors: string;
			seed: string;
			page: string;
		};

		try {
			res.header("Cache-Control", "no-store, max-age=0");
			if (isValidRegion(region)) {
				return res
					.status(400)
					.json({ error: "Invalid or unsupported region" });
			}

			const response = await axios.get(
				`${RANDOMUSER_API_URL}?results=20&nat=${region}&seed=${seed}`
			);
			const usersData: Array<{
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

			const users = [];
			for (let userData of usersData) {
				const [modifiedName, modifiedAddress] = await generateErrors(
					userData.name,
					userData.address,
					parseInt(errors),
					seed
				);
				users.push({
					...userData,
					name: modifiedName,
					address: modifiedAddress,
				});
			}
			res.json(users);
		} catch (error) {
			next(error);
		}
	}
);

export default router;

import express, { Router, Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import axios from "axios";
import { isValidRegion } from "../validators/users";
import { RandomUser } from "../interfaces/randomUser";
import { generateErrors } from "../services/randomDataGenerator";

config();

const router: Router = express.Router();
const RANDOMUSER_API_URL: string = "https://randomuser.me/api/";

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
			if (parseInt(errors) > 10) {
				return res
					.status(422)
					.json({ message: "Error amount limit is 10" });
			}
			if (!isValidRegion(region)) {
				return res
					.status(400)
					.json({ message: "Invalid or unsupported region" });
			}

			const response = await axios.get(
				`${RANDOMUSER_API_URL}?results=20&nat=${region}&seed=${seed}`
			);
			const usersData: Array<{
				randomIdentifier: string;
				name: string;
				address: string;
				phone: string;
			}> = (response.data.results as RandomUser[]).map(
				(user: RandomUser) => ({
					randomIdentifier: user.login.uuid,
					name: `${user.name.first} ${user.name.last}`,
					address: `${user.location.street.name}, ${user.location.city}, ${user.location.country}`,
					phone: user.phone,
				})
			);

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

import express, { Router, Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import crypto from "crypto";
import { isValidRegion } from "../validators/randomDataGenerator";
import { generateErrors, generateRandomUsersData } from "../services/randomDataGenerator";
import { SupportedNats } from "../enums/SupportedNatsEnum";

config();

const router: Router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
	const { region, errors, seed, page } = req.query as {
		region: string;
		errors: string;
		seed: string;
		page: string;
	};

	try {
		if (parseInt(errors) > 1000) {
			return res
				.status(422)
				.json({ message: "Error amount limit is 10" });
		}
		if (!isValidRegion(region)) {
			return res
				.status(400)
				.json({ message: "Invalid or unsupported region" });
		}

		const combinedSeed = crypto
			.createHash("sha256")
			.update((parseInt(seed) + parseInt(page)).toString())
			.digest("hex");

		const usersData = generateRandomUsersData(
			SupportedNats[region],
			parseInt(combinedSeed)
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
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
});

export default router;

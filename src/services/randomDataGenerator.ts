import { Faker, faker } from "@faker-js/faker";
import { SupportedLocales } from "../enums/locales";
import { SupportedNats, SupportedNatsMap } from "../enums/SupportedNatsEnum";
import { RandomUser } from "../interfaces/randomUser";

function mulberry32(seed: string) {
    let a = parseInt(seed, 16);
    return function () {
        a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 2**32;
    }
}

function seededRandom(seed: string): number {
    const randomFunc = mulberry32(seed);
    return randomFunc();
}


function getRandomChar(): string {
	const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const randomIndex = Math.floor(Math.random() * alphabet.length);
	return alphabet[randomIndex];
}

function deleteRandomCharacter(input: string, seed: string): string {
	const random = seededRandom(seed);
	const randomIndex = Math.floor(random * input.length);
	return input.slice(0, randomIndex) + input.slice(randomIndex + 1);
}

function addRandomCharacter(input: string, seed: string): string {
	const random = seededRandom(seed);
	const randomIndex = Math.floor(random * input.length);
	const randomChar = getRandomChar();
	return input.slice(0, randomIndex) + randomChar + input.slice(randomIndex);
}

function swapNearCharacters(input: string, seed: string): string {
	const random = seededRandom(seed);
	const chars = input.split("");
	for (let i = 0; i < chars.length - 1; i += 2) {
		const randomIndex = Math.floor(random * (chars.length - i)) + i;
		const temp = chars[i];
		chars[i] = chars[randomIndex];
		chars[randomIndex] = temp;
	}
	return chars.join("");
}

async function generateErrors(
	name: string,
	address: string,
	numErrors: number,
	seed: string
): Promise<[string, string]> {
	let modifiedName = name;
	let modifiedAddress = address;

	for (let i = 0; i < numErrors; i++) {
		const errorType = Math.floor(seededRandom(seed + i.toString()) * 3);
		console.log("error", errorType);
		if (errorType === 0) {
			if (modifiedAddress.length > 5 && modifiedName.length > 5) {
				modifiedName = deleteRandomCharacter(
					modifiedName,
					seed + i.toString()
				);
				modifiedAddress = deleteRandomCharacter(
					modifiedAddress,
					seed + i.toString()
				);
			}
		} else if (errorType === 1) {
			if (modifiedAddress.length < 50 && modifiedName.length < 50) {
				modifiedName = addRandomCharacter(
					modifiedName,
					seed + i.toString()
				);
				modifiedAddress = addRandomCharacter(
					modifiedAddress,
					seed + i.toString()
				);
			}
		} else {
			modifiedName = swapNearCharacters(
				modifiedName,
				seed + i.toString()
			);
			modifiedAddress = swapNearCharacters(
				modifiedAddress,
				seed + i.toString()
			);
		}
	}

	return [modifiedName, modifiedAddress];
}


function generateRandomUsersData(localeCode: SupportedNats, seed: number, itemsCount = 20): RandomUser[] {
	const localeInfo = SupportedLocales.find(
		(locale) => locale.code === localeCode
	);
	if (localeInfo) {
		const usersData = [];
		const customFaker = localeInfo.fakerLocale;

		customFaker.seed(seed);
		console.log("Test:====>",customFaker.person.fullName())
		for (let i = 0; i < itemsCount; i++) {
			const user = {
				randomIdentifier: customFaker.number.int(),
				name: customFaker.person.fullName(),
				address:
					customFaker.location.streetAddress({ useFullAddress: true }),
				phone: customFaker.phone.number(),
			};
			usersData.push(user);
		}
		return usersData;
	} else {
		throw new Error("Invalid locale code.");
	}
}

export { generateErrors, generateRandomUsersData };

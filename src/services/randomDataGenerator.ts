function getRandomChar(): string {
	const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const randomIndex = Math.floor(Math.random() * alphabet.length);
	return alphabet[randomIndex];
}

function deleteRandomCharacter(input: string): string {
	const randomIndex = Math.floor(Math.random() * input.length);
	return input.slice(0, randomIndex) + input.slice(randomIndex + 1);
}

function addRandomCharacter(input: string): string {
	const randomIndex = Math.floor(Math.random() * input.length);
	const randomChar = getRandomChar();
	return input.slice(0, randomIndex) + randomChar + input.slice(randomIndex);
}

function swapNearCharacters(input: string): string {
	const chars = input.split("");
	for (let i = 0; i < chars.length - 1; i += 2) {
		const temp = chars[i];
		chars[i] = chars[i + 1];
		chars[i + 1] = temp;
	}
	return chars.join("");
}

function seededRandom(seed: string): number {
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		const char = seed.charCodeAt(i);
		hash = (hash << 5) - hash + char;
	}
	const max = 1e12;
	return (hash % max) / max;
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

		if (errorType === 0) {
			if (modifiedAddress.length > 3 && modifiedName.length > 3) {
				modifiedName = deleteRandomCharacter(modifiedName);
				modifiedAddress = deleteRandomCharacter(modifiedAddress);
			}
		} else if (errorType === 1) {
			modifiedName = addRandomCharacter(modifiedName);
			modifiedAddress = addRandomCharacter(modifiedAddress);
		} else {
			modifiedName = swapNearCharacters(modifiedName);
			modifiedAddress = swapNearCharacters(modifiedAddress);
		}
	}

	return [modifiedName, modifiedAddress];
}

export { generateErrors };

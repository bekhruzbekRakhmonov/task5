import { SupportedNats } from "../enums/SupportedNatsEnum";

export function isValidRegion(region: string): region is SupportedNats {
	return Object.values(SupportedNats).includes(region as SupportedNats);
}

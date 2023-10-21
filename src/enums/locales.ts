import { SupportedNats } from "./SupportedNatsEnum";
import {
	fakerDE,
	fakerDE_CH,
	fakerEN_AU,
	fakerEN_CA,
	fakerEN_GB,
	fakerEN_IE,
	fakerEN_IN,
	fakerEN_US,
	fakerES,
	fakerES_MX,
	fakerFA,
	fakerFI,
	fakerFR,
	fakerNB_NO,
	fakerNL,
	fakerPT_BR,
	fakerSR_RS_latin,
	fakerTR,
	fakerUK
} from "@faker-js/faker";

export interface LocaleInfo {
	code: SupportedNats;
	description: string;
	fakerLocale: any;
}

export const SupportedLocales: LocaleInfo[] = [
	{
		code: SupportedNats.AU,
		description: "Australia",
		fakerLocale: fakerEN_AU,
	},
	{ code: SupportedNats.BR, description: "Brazil", fakerLocale: fakerPT_BR },
	{ code: SupportedNats.CA, description: "Canada", fakerLocale: fakerEN_CA },
	{
		code: SupportedNats.CH,
		description: "Switzerland",
		fakerLocale: fakerDE_CH,
	},
	{ code: SupportedNats.DE, description: "Germany", fakerLocale: fakerDE },
	{ code: SupportedNats.ES, description: "Spain", fakerLocale: fakerES },
	{ code: SupportedNats.FI, description: "Finland", fakerLocale: fakerFI },
	{ code: SupportedNats.FR, description: "France", fakerLocale: fakerFR },
	{
		code: SupportedNats.GB,
		description: "United Kingdom",
		fakerLocale: fakerEN_GB,
	},
	{ code: SupportedNats.IE, description: "Ireland", fakerLocale: fakerEN_IE },
	{ code: SupportedNats.IN, description: "India", fakerLocale: fakerEN_IN },
	{ code: SupportedNats.IR, description: "Iran", fakerLocale: fakerFA },
	{ code: SupportedNats.MX, description: "Mexico", fakerLocale: fakerES_MX },
	{
		code: SupportedNats.NL,
		description: "Netherlands",
		fakerLocale: fakerNL,
	},
	{ code: SupportedNats.NO, description: "Norway", fakerLocale: fakerNB_NO },
	{
		code: SupportedNats.RS,
		description: "Serbia",
		fakerLocale: fakerSR_RS_latin,
	},
	{ code: SupportedNats.TR, description: "Turkey", fakerLocale: fakerTR },
	{ code: SupportedNats.UA, description: "Ukraine", fakerLocale: fakerUK },
	{
		code: SupportedNats.US,
		description: "United States",
		fakerLocale: fakerEN_US,
	},
];


/**
 * @typedef {{
 * 	clocks: {
 * 		tz: string
 * 		gloss: string | null
 * 	}[]
 * }} Options
 */

/** @type {Options} */
export const defaultOptions = {
	clocks: [
		{ tz: 'Asia/Shanghai', gloss: null },
		{ tz: 'Europe/London', gloss: null },
		{ tz: 'America/Mexico_City', gloss: null },
	],
}

/** @returns {Promise<Options>} */
export function getCurrentOptions() {
	// @ts-ignore TODO
	return chrome.storage.sync.get(structuredClone(defaultOptions))
}

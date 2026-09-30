// @ts-check
/** @typedef {import('./options.mjs').Options} Options */
import { getCurrentOptions } from './options.mjs'

const $button = document.querySelector('button#settings')
if (!($button instanceof HTMLButtonElement)) throw 1
const $clocks = document.querySelector('#clocks')
if (!($clocks instanceof HTMLElement)) throw 1

globalThis.addEventListener('visibilitychange', () => {
	// deno-lint-ignore no-console
	console.log(new Date().toLocaleString(), document.visibilityState)
})

$button.addEventListener('click', () => {
	// @ts-ignore TODO
	chrome.tabs.create({ url: `chrome-extension://${chrome.runtime.id}/options.html` })
})

const options = await getCurrentOptions()
for (const [i, clock] of options.clocks.entries()) {
	const pretty = clock.tz.split('/').pop()?.replaceAll('_', ' ') ?? ''

	const $clock = document.createElement('tz-clock-analog')
	$clock.setAttribute('time', clock.tz)
	$clock.setAttribute('gloss', clock.gloss ?? pretty)
	$clock.setAttribute('hour-cycle', '24')
	$clocks.appendChild($clock)
	$clock.setAttribute('second-hand', String(i === 1))
}

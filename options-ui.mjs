// @ts-check

/** @typedef {import('./options.mjs').Options} Options */
import { getCurrentOptions } from './options.mjs'

const $template = document.getElementById('clock-template')
if (!($template instanceof HTMLTemplateElement)) throw 1
const $clocks = document.getElementById('clocks')
if (!($clocks instanceof HTMLElement)) throw 1

/** @param {string} offset */
function offsetToMinutes(offset) {
	const m = offset.match(/([+-])(\d{2}):(\d{2})/)
	if (m == null) throw 1
	const [sign, hours, minutes] = m.slice(1)
	return (Number(hours) * 60 + Number(minutes)) * (sign === '+' ? 1 : -1)
}

const tzs = Intl.supportedValuesOf('timeZone')
	.map((tz) => {
		const { offset } = Temporal.Now.zonedDateTimeISO(tz)
		const pretty = `${tz.replaceAll('_', ' ')} (UTC${offset})`

		return {
			id: tz,
			offset,
			pretty,
		}
	})
	.sort((a, b) => {
		return offsetToMinutes(a.offset) - offsetToMinutes(b.offset)
	})

/**
 * @param {number} i
 * @param {string} str
 */
function increment(i, str) {
	return str.replaceAll(/\d+/g, (m) => String(Number(m) + i))
}

/** @param {Options} options */
function renderClocks(options) {
	if (!($clocks instanceof HTMLElement)) throw 1
	if (!($template instanceof HTMLTemplateElement)) throw 1

	for (const child of $clocks.children) {
		if (child instanceof HTMLLegendElement) continue
		child.remove()
	}

	for (const [i, clock] of options.clocks.entries()) {
		const fragment = $template.content.cloneNode(true)
		if (!(fragment instanceof DocumentFragment)) throw 1

		const [$child] = fragment.children

		$child.id = increment(i, $child.id)
		$child.innerHTML = increment(i, $child.innerHTML)

		const $tz = $child.querySelector(`[id="clocks[${i}].tz"]`)
		if (!($tz instanceof HTMLSelectElement)) throw 1
		const $gloss = $child.querySelector(`[id="clocks[${i}].gloss"]`)
		if (!($gloss instanceof HTMLInputElement)) throw 1

		for (const tz of tzs) {
			$tz.appendChild(new Option(tz.pretty, tz.id))
		}

		$tz.value = clock.tz
		$gloss.value = clock.gloss ?? ''

		$clocks.appendChild($child)
	}
}

let dirty = false

function getElements() {
	const form = document.getElementById('form')
	if (!(form instanceof HTMLFormElement)) throw 1
	const status = document.getElementById('status')
	if (!(status instanceof HTMLElement)) throw 1

	return { form, status }
}

const elements = getElements()

async function saveOptions() {
	const fd = new FormData(elements.form)
	const options = await getCurrentOptions()
	options.clocks.length = 0

	for (const [k, _v] of fd) {
		const v = String(_v)
		const m = k.match(/^clocks\[(\d+)\]\.(tz|gloss)$/)
		if (!m) continue
		const [, _i, field] = m
		const i = Number(_i)
		if (!options.clocks[i]) options.clocks[i] = { tz: '', gloss: null }
		if (field === 'gloss') {
			options.clocks[i].gloss = v === '' ? null : v
		} else if (field === 'tz') {
			options.clocks[i].tz = v
		}
	}

	// @ts-ignore TODO
	await chrome.storage.sync.set(options)

	dirty = false
	elements.status.textContent = '✅ Options saved!'
	setTimeout(() => elements.status.textContent = '', 3000)
}

async function restoreOptions() {
	const options = await getCurrentOptions()

	renderClocks(options)
}

restoreOptions()

elements.form.addEventListener('change', () => dirty = true)

elements.form.addEventListener('submit', async (e) => {
	e.preventDefault()
	await saveOptions()
	// @ts-ignore TODO
	await chrome.runtime.sendMessage('optionsUpdated')
	dirty = false
})

elements.form.addEventListener('reset', async (e) => {
	e.preventDefault()

	if (confirm('Are you sure you want to reset all options to the defaults?')) {
		// @ts-ignore TODO
		await chrome.storage.sync.clear()
		// await chrome.runtime.sendMessage('optionsUpdated')
		dirty = false
		location.reload()
	}
})

globalThis.addEventListener('beforeunload', (e) => {
	if (dirty) {
		e.preventDefault()
		return ''
	}
})

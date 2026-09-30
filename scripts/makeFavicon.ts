import { writeSvg } from './utils.ts'

const size = 100
const scale = 0.86
const radius = size / 2
const innerRadius = 24
const strokeWidth = 10
const lineStart = radius - innerRadius
const numLines = 3

function createSvg() {
	const lines = Array.from({ length: numLines }, (_, i) => {
		const angle = (360 / numLines) * i
		return `<use transform="rotate(${angle})" transform-origin="center" href="#line" />`
	}).join('\n')

	const svg = String.raw`
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
			<style>
			.icon {
				fill: #3C4043;

				@media (prefers-color-scheme: dark) {
					fill: #C1C6DD;
				}

				transform: scale(${scale});
				transform-origin: center;
			}
			</style>
			<defs>
				<line id="line" x1="${radius}" y1="${lineStart}" x2="${size}" y2="${lineStart}" />
			</defs>
			<mask id="mask">
				<rect width="${size}" height="${size}" fill="white" />
				<g stroke="black" stroke-width="${strokeWidth}" fill="white">
					${lines}
					<circle cx="${radius}" cy="${radius}" r="${innerRadius}" />
				</g>
			</mask>

			<circle class="icon" cx="${radius}" cy="${radius}" r="${radius}" mask="url(#mask)" />
		</svg>
	`
	return svg
}

await writeSvg('favicon.svg', createSvg())

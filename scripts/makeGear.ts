import { writeSvg } from './utils.ts'

const size = 100
const scale = 0.86

const radius = size / 2

const _ringRadius = 40
const middleRadius = 18
const strokeWidth = _ringRadius - middleRadius
const ringRadius = _ringRadius - (strokeWidth / 2)

const numTeeth = 8

const rounding = 15
const trapeziumScale = 0.2
const translateX = radius - (50 * trapeziumScale)

const startOffset = 0
const endOffset = 20
const topIsTooth = true

function createSvg() {
	const trapezium = `
		<polygon
			points="${startOffset},100 ${endOffset},0 ${100 - endOffset},0 ${100 - startOffset},100"
			id="trapezium"
			class="stroke fill"
			stroke-linejoin="round"
			stroke-width="${rounding}"
			transform="translate(${translateX} 0) scale(${trapeziumScale})" 
		/>
	`

	const trapeziums = Array.from({ length: numTeeth }, (_, i) => {
		let angle = (360 / numTeeth) * i
		if (!topIsTooth) {
			angle += 360 / (2 * numTeeth)
		}

		return `
			<use
				href="#trapezium"
				class="fill"
				transform-origin="${radius} ${radius}"
				transform="rotate(${angle})"
			/>
		`
	}).join('\n')

	const svg = String.raw`
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
			<style>
			.fill {
				fill: #3C4043;

				@media (prefers-color-scheme: dark) {
					fill: #C1C6DD;
				}
			}

			.stroke:not(.fill) {
				fill: none;
			}

			.stroke {
				stroke: #3C4043;

				@media (prefers-color-scheme: dark) {
					stroke: #C1C6DD;
				}
			}

			.icon {
				transform: scale(${scale});
				transform-origin: center;
			}
			</style>
			<defs>
				${trapezium}
			</defs>

			<g class="icon">
				<circle
					class="stroke"
					stroke-width="${strokeWidth}"
					cx="${radius}"
					cy="${radius}"
					r="${ringRadius}"
				/>
				${trapeziums}
			</g>
		</svg>
	`

	return svg
}

await writeSvg('gear.svg', createSvg())

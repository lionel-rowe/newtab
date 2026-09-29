import { DenoFmtStream } from '@li/deno-fmt'

const size = 100
const scale = 0.86

const radius = size / 2

const _ringRadius = 38
const middleRadius = 18
const strokeWidth = _ringRadius - middleRadius
const ringRadius = _ringRadius - (strokeWidth / 2)

const numDashes = 8

const rounding = 15
const trapeziumScale = 0.2
const translateX = radius - (50 * trapeziumScale)

function createSvg() {
	const trapeziums = Array.from({ length: numDashes }, (_, i) => {
		const angle = (360 / numDashes) * i

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
				<polygon
					points="0,100 20,0 80,0 100,100"
					id="trapezium"
					class="stroke fill"
					stroke-linejoin="round"
					stroke-width="${rounding}"
					transform="translate(${translateX} 0) scale(${trapeziumScale})" 
				/>
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

const svg = createSvg()
const stream = new Blob([svg])
	.stream()
	.pipeThrough(new DenoFmtStream({ ext: 'svg' }))

const f = await Deno.open('gear.svg', { write: true, create: true, truncate: true })
await stream.pipeTo(f.writable)

import { DenoFmtStream } from '@li/deno-fmt'

export async function writeSvg(path: string, svg: string) {
	const stream = new Blob([svg])
		.stream()
		.pipeThrough(new DenoFmtStream({ ext: 'svg' }))

	const f = await Deno.open(path, { write: true, create: true, truncate: true })
	await stream.pipeTo(f.writable)
}

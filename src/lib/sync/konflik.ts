import type { LocalEntry } from '$lib/db/local/types.ts';

export type Resolusi =
	| { jenis: 'ambil-server' }
	| { jenis: 'gabung'; hasil: LocalEntry }
	| { jenis: 'versi-tandingan' };

const sameSet = (a: string[], b: string[]) =>
	a.length === b.length && a.every((x) => b.includes(x));

/**
 * Merge otomatis hanya untuk perubahan yang jelas tidak bentrok:
 * badan tulisan sama persis, yang berubah cuma tag/mood/lampiran.
 */
export function coba(lokal: LocalEntry, server: LocalEntry): Resolusi {
	if (server.deletedAt && !lokal.deletedAt) return { jenis: 'versi-tandingan' };

	const bodySama = lokal.body.trim() === server.body.trim();
	const judulSama = lokal.title.trim() === server.title.trim();

	if (bodySama && judulSama) {
		const tags = [...new Set([...server.tags, ...lokal.tags])];
		const hasil: LocalEntry = {
			...server,
			tags,
			mood: lokal.mood ?? server.mood,
			attachments: [
				...server.attachments,
				...lokal.attachments.filter((a) => !server.attachments.some((s) => s.id === a.id))
			],
			rev: server.rev,
			baseRev: server.rev,
			dirty: sameSet(tags, server.tags) && lokal.mood === server.mood ? 0 : 1,
			updatedAt: new Date().toISOString()
		};
		return { jenis: 'gabung', hasil };
	}

	if (lokal.body.trim() === '' && lokal.title.trim() === '') return { jenis: 'ambil-server' };

	return { jenis: 'versi-tandingan' };
}

export function labelTandingan(namaPerangkat: string, waktu = new Date()): string {
	const jam = `${String(waktu.getHours()).padStart(2, '0')}.${String(waktu.getMinutes()).padStart(2, '0')}`;
	return `Versi dari ${namaPerangkat}, ${jam}`;
}

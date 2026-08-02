export interface Cuaca {
	code: number;
	tempC: number;
}

const LABEL: Array<[number[], string, string]> = [
	[[0, 1], 'Cerah', 'Clear'],
	[[2], 'Berawan', 'Partly cloudy'],
	[[3, 45, 48], 'Mendung', 'Overcast'],
	[[51, 53, 55, 56, 57], 'Gerimis', 'Drizzle'],
	[[61, 63, 65, 66, 67, 80, 81, 82], 'Hujan', 'Rain'],
	[[71, 73, 75, 77, 85, 86], 'Salju', 'Snow'],
	[[95, 96, 99], 'Badai', 'Thunderstorm']
];

export function labelCuaca(code: number, locale = 'id'): string {
	for (const [kode, id, en] of LABEL) if (kode.includes(code)) return locale === 'en' ? en : id;
	return locale === 'en' ? 'Unknown' : 'Tidak diketahui';
}

/**
 * Cuaca dan lokasi hanya diambil setelah pengguna menekan tombolnya.
 * Hasilnya masuk payload entri yang terenkripsi; server tidak pernah melihatnya.
 */
export async function ambilPosisi(): Promise<GeolocationPosition> {
	return new Promise((resolve, reject) => {
		if (!navigator.geolocation) {
			reject(new Error('Peramban ini tidak mendukung geolokasi'));
			return;
		}
		navigator.geolocation.getCurrentPosition(resolve, reject, {
			enableHighAccuracy: false,
			timeout: 10_000,
			maximumAge: 600_000
		});
	});
}

export async function ambilCuaca(lat: number, lon: number): Promise<Cuaca | null> {
	try {
		const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(2)}&longitude=${lon.toFixed(2)}&current=temperature_2m,weather_code`;
		const res = await fetch(url);
		if (!res.ok) return null;
		const data = (await res.json()) as {
			current?: { temperature_2m?: number; weather_code?: number };
		};
		if (data.current?.temperature_2m === undefined) return null;
		return {
			code: data.current.weather_code ?? 0,
			tempC: Math.round(data.current.temperature_2m)
		};
	} catch {
		return null;
	}
}

/** Koordinat dibulatkan ke ~1 km sebelum disimpan supaya tidak menunjuk rumah persis. */
export const bulatkanKoordinat = (n: number): number => Math.round(n * 100) / 100;

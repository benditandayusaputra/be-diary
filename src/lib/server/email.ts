import { CFG } from './env.ts';

interface Mail {
	to: string;
	subject: string;
	text: string;
}

async function send(mail: Mail): Promise<void> {
	if (!CFG.resendKey) {
		console.info(`[email:dev] ke=${mail.to} subjek=${mail.subject}\n${mail.text}`);
		return;
	}
	const res = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: { authorization: `Bearer ${CFG.resendKey}`, 'content-type': 'application/json' },
		body: JSON.stringify({ from: CFG.mailFrom, to: mail.to, subject: mail.subject, text: mail.text })
	});
	if (!res.ok) console.error('[email] gagal', await res.text());
}

export const mail = {
	verify: (to: string, code: string) =>
		send({
			to,
			subject: 'Kode verifikasi be-diary',
			text: `Kode verifikasi kamu: ${code}\n\nBerlaku 10 menit. Kalau bukan kamu yang mendaftar, abaikan email ini.`
		}),

	passwordChanged: (to: string) =>
		send({
			to,
			subject: 'Sandi be-diary kamu diganti',
			text: 'Sandi akun be-diary kamu baru saja diganti dan semua sesi lain dicabut. Kalau bukan kamu, segera pulihkan akun dengan 24 kata pemulihan.'
		}),

	deviceAdded: (to: string, name: string) =>
		send({
			to,
			subject: 'Perangkat baru terhubung ke be-diary',
			text: `Perangkat "${name}" baru saja disambungkan ke akunmu. Kalau bukan kamu, cabut perangkat itu di Pengaturan lalu ganti sandi.`
		}),

	recoveryUsed: (to: string) =>
		send({
			to,
			subject: 'Frasa pemulihan be-diary dipakai',
			text: 'Frasa pemulihan 24 kata akunmu baru saja dipakai untuk membuka arsip di perangkat baru. Kalau bukan kamu, segera ganti sandi.'
		}),

	accountDeleted: (to: string) =>
		send({
			to,
			subject: 'Akun be-diary dijadwalkan dihapus',
			text: 'Akunmu akan dihapus permanen dalam 7 hari. Masuk kembali sebelum itu untuk membatalkan.'
		})
};

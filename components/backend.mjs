import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

export class RSVPBackend {
	constructor() {
		this.supabase = createClient('https://pvlfpzfbdmgegmvaqhsc.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2bGZwemZiZG1nZWdtdmFxaHNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTI0MDc5NDIsImV4cCI6MTk2Nzk4Mzk0Mn0.lGYQHdB3qmP7aoPpL21wW9x6gy-M5E3BhAXMS3uDPF4');
	}
	async SearchForReservation(passcode) {
		let { data: reservation, error } = await this.supabase
			.from('reservation')
			.select('*')
			.eq("passcode", passcode);

		console.log(reservation, error);
		if (error) {
			return Promise.reject("I had a database failure. Please try again later.");
		}

		if (reservation.length === 0) {
			return Promise.reject("No invitation found. Try entering your secret passcode again.");
		}

		return Promise.resolve(reservation[0]);
	}

	async SaveReservation(reservation) {
		const { data, error } = await this.supabase
			.from('reservation')
			.update(reservation)
			.eq('passcode', reservation.passcode);

		if (error) {
			return Promise.reject("There was a big problem updating things");
		}

		return Promise.resolve(data);
	}
}
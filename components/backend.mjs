import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

class Guest {
	constructor(name) {
		this.Name = name;
		this.Dinner = null;
		this.Attending = null;
		this.RestrictionsNote = null;
		this.IsChild = false;
	}
}

class Reservation {
	constructor(plusOneAllowed, passcode, guestNames, childNames) {
		this.id = crypto.randomUUID(); // autogenerated
		this.created_at = new Date();
		this.can_add_plus_one = plusOneAllowed;
		this.not_attending_note = null;
		this.plus_one = new Guest(null);
		this.guests = [];
		guestNames.forEach(name => this.guests.push(new Guest(name, false)));
		if (childNames != null) { childNames.forEach(name => this.guests.push(new Guest(name, true))) };
		this.passcode = passcode;
	}
}

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
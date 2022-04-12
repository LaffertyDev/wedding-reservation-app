import {html, render} from 'https://unpkg.com/lit-html?module';
import {RSVPBackend} from '/src/components/backend.mjs';

function init() {
	const urlSearchParams = new URLSearchParams(window.location.search);
	if (!urlSearchParams.has("reservationid")) {
		location.href = "/src/pages/reservation.html";
	}

	const reservationId = urlSearchParams.get("reservationid");
	const rsvpBackend = new RSVPBackend();
	try {
		const reservation = rsvpBackend.LoadReservation(reservationId);
		return;
	}
	catch(e) {
		alert("We couldn't find your reservation");
		location.href = "/src/pages/reservation.html";
		return;
	}
}

init();
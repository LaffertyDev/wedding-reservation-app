import {html, render} from 'https://unpkg.com/lit-html?module';
import {RSVPBackend} from '/src/components/backend.mjs';

async function HandleFindInvitation() {
	if (document.getElementById("name_search").value == "") {
		document.getElementById("error").innerHTML = "Who are you? Enter your name.";
		return;
	}
	const rsvpBackend = new RSVPBackend();
	
	try {
		const reservation = await rsvpBackend.SearchForReservation();
		location.href = `/src/pages/attending.html?reservationid=${reservation.ReservationIdentifier}`;
		console.log("find reservation");
	}
	catch(e) {
		document.getElementById("error").innerHTML = e;
	}
}

function init() {
	document.getElementById("find_invitation").addEventListener('click', HandleFindInvitation);
}

init();
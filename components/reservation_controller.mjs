import {html, render} from 'https://unpkg.com/lit-html?module';
import {RSVPBackend} from '/rsvp/components/backend.mjs';
import {WeddingHeader} from '/rsvp/components/wedding_header.mjs';

async function HandleFindInvitation(e) {
	e.preventDefault();
	const passcode_search_input = document.getElementById("passcode_search");
	if (passcode_search_input.value == "") {
		document.getElementById("error").innerHTML = "Who are you? Enter your name.";
		passcode_search_input.classList.add("is-danger");
		return;
	}
	const rsvpBackend = new RSVPBackend();
	
	try {
		const reservation = await rsvpBackend.SearchForReservation(passcode_search_input.value);
		localStorage.setItem('reservation', JSON.stringify(reservation));
		location.href = `/rsvp/attending.html`;
	}
	catch(e) {
		document.getElementById("error").innerHTML = e;
	}
}

function HandleTextInput() {
	const passcode_search_input = document.getElementById("name_search");
	passcode_search_input.classList.remove("is-danger");
}

function init() {
	document.getElementById("form").addEventListener("submit", HandleFindInvitation);
	document.getElementById("passcode_search").addEventListener('click', HandleTextInput);
	localStorage.removeItem('reservation');
}

init();
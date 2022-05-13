import {html, render} from 'https://unpkg.com/lit-html?module';
import {RSVPBackend} from '/components/backend.mjs';
import {WeddingHeader} from '/components/wedding_header.mjs';

async function HandleFindInvitation(e) {
	e.preventDefault();
	const name_search_input = document.getElementById("name_search");
	if (name_search_input.value == "") {
		document.getElementById("error").innerHTML = "Who are you? Enter your name.";
		name_search_input.classList.add("is-danger");
		return;
	}
	const rsvpBackend = new RSVPBackend();
	
	try {
		const reservation = await rsvpBackend.SearchForReservation(name_search_input.value);
		localStorage.setItem('reservation', JSON.stringify(reservation));
		location.href = `/attending.html`;
	}
	catch(e) {
		document.getElementById("error").innerHTML = e;
	}
}

function HandleTextInput() {
	const name_search_input = document.getElementById("name_search");
	name_search_input.classList.remove("is-danger");
}

function init() {
	document.getElementById("form").addEventListener("submit", HandleFindInvitation);
	document.getElementById("name_search").addEventListener('click', HandleTextInput);
	localStorage.removeItem('reservation');
}

init();
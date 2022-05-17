import {html, render} from 'https://unpkg.com/lit-html?module';
import {RSVPBackend} from '/rsvp/components/backend.mjs';
import {WeddingHeader} from '/rsvp/components/wedding_header.mjs';

class AttendingController {
	HandlePrevious() {
		location.href = "/rsvp/";
	}

	HandleRadioSelect(e) {
		document.getElementById("error").innerHTML = "";
		if (e.target.name === "plus_one_rsvp") {
			this.reservation.plus_one.Attending = e.target.value === "yes";
		} else {
			const person = e.target.value.substr(0, e.target.value.indexOf('_'));
			const attending = e.target.value.substr(e.target.value.indexOf('_') + 1, e.target.value.length) == "yes";
			this.reservation.guests.find(x => x.Name == person).Attending = attending;
		}

		this.Render();
	}

	HandlePlusOneNameChange(e) {
		this.reservation.plus_one.Name = e.target.value;
	}

	async HandleSubmit(e) {
		e.preventDefault();
		if (this.reservation.guests.some(g => g.Attending == null) || (this.reservation.guests.some(g => g.Attending === true) && this.reservation.can_add_plus_one && this.reservation.plus_one.Attending == null)) {
			document.getElementById("error").innerHTML = "You didn’t RSVP to the RSVP!<br/>Respond ‘Yes’ or ‘No’ for everyone in your group.";
		} else if (this.reservation.can_add_plus_one && this.reservation.plus_one.Attending && this.reservation.plus_one.Name == "") {
			document.getElementById("error").innerHTML = "Your plus one needs a name.";
		} else {
			document.getElementById("error").innerHTML = "";
			localStorage.setItem('reservation', JSON.stringify(this.reservation));

			if (this.reservation.guests.every(g => g.Attending === false)) {
				const backend = new RSVPBackend();
				document.getElementById("next").classList.add("is-loading");
				try {
					await backend.SaveReservation(this.reservation);
				} catch(e) {
					document.getElementById("next").classList.remove("is-loading");
					alert("There was a problem on the backend. Please try again.");
					return;
				}
				document.getElementById("next").classList.remove("is-loading");
				window.location = "/rsvp/finish.html";
			} else {
				window.location = "/rsvp/dinner.html";
			}
		}
	}

	async HandleNoteToCoupleText(e) {
		this.reservation.not_attending_note = e.target.value;
	}

	Render() {
		const rsvpClickHandler = {
			handleEvent: (e) => this.HandleRadioSelect(e),
			capture: true,
		};

		const plusOneNameChangeHandler = {
			handleEvent: (e) => this.HandlePlusOneNameChange(e),
			capture: true,
		}

		let guestTemplate = (guest) => html`
					<div class="columns is-mobile is-vcentered">
						<div class="column">${guest.Name}</div>
						<div class="column">
							<div class="buttons is-expanded has-addons is-right radio-buttons-as-buttons">
								<label class="button ${guest.Attending === true ? "is-primary" : ""}"><input type="radio" @click="${rsvpClickHandler}" value="${guest.Name}_yes" name="attending" .checked=${guest.Attending === true} /> Yes</label>
								<label class="button ${guest.Attending === false ? "is-primary" : ""}"><input type="radio" @click="${rsvpClickHandler}" value="${guest.Name}_no" name="attending" .checked=${guest.Attending === false} /> No</label>
							</div>
						</div>
					</div>`;

		let plusOneTemplate = (guest) => html`
					<div class="columns is-mobile" id="plus_one_field">
						<div class="column">
							<input class="input" ${guest.Attending === false ? "is-invisible" : ""}" type="text" id="plus_one_name" @change="${plusOneNameChangeHandler}" value="${guest.Name}" placeholder="+1 Name" />
						</div>
						<div class="column">
							<div class="buttons is-expanded has-addons is-right radio-buttons-as-buttons">
								<label class="button ${guest.Attending === true ? "is-primary" : ""}"><input type="radio" @click="${rsvpClickHandler}" name="plus_one_rsvp" value="yes" .checked=${guest.Attending === true} /> Yes</label>
								<label class="button ${guest.Attending === false ? "is-primary" : ""}"><input type="radio" @click="${rsvpClickHandler}" name="plus_one_rsvp" value="no" .checked=${guest.Attending === false} /> No</label>
							</div>
						</div>
					</div>`;

		let guestsListTemplate = (r) => html`
			<p class="content has-text-centered mb-6">We have reserved ${Math.max(2, r.guests.length)} seats in your honor.</p>
			${r.guests.map(g => html`${guestTemplate(g)}`)}
			${this.reservation.can_add_plus_one ? html`${plusOneTemplate(this.reservation.plus_one)}` : ''}
		`;

		render(guestsListTemplate(this.reservation), document.getElementById("guest_list"));

		var inputs = document.querySelectorAll('.radio-buttons-as-buttons input');
		Array.from(inputs).forEach(function(element){
			element.addEventListener('click', function(event){
				// remove is-info to the current active button of this group (if there's one)
				event.target.parentElement.parentElement.querySelectorAll('label').forEach(function(el){el.classList.remove('is-primary')});
				// add is-info to the new active
				event.target.parentElement.classList.add('is-primary');
			});
		});

		if (this.reservation.guests.every(x => x.Attending === false)) {
			document.getElementById("not_attending_info").classList.remove("is-hidden");
			document.getElementById("plus_one_field").classList.add("is-hidden");
			document.getElementById("next").innerHTML = "Submit RSVP";
		} else {
			document.getElementById("not_attending_info").classList.add("is-hidden");
			document.getElementById("plus_one_field").classList.remove("is-hidden");
			document.getElementById("next").innerHTML = "Next: Dinner Choice";
		}
	}

	async LoadData() {
		this.reservation = JSON.parse(localStorage.getItem('reservation'));
		this.Render();
	}

	async init() {
		document.getElementById("form").addEventListener("submit", this.HandleSubmit.bind(this));
		document.getElementById("previous").addEventListener("click", this.HandlePrevious.bind(this));
		document.getElementById("group_note").addEventListener("change", this.HandleNoteToCoupleText.bind(this));
		this.LoadData();
	}
}

const attending_controller = new AttendingController();
attending_controller.init();
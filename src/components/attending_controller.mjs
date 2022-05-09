import {html, render} from 'https://unpkg.com/lit-html?module';
import {RSVPBackend} from '/src/components/backend.mjs';
import {WeddingHeader} from '/src/components/wedding_header.mjs';


class AttendingController {
	HandlePrevious() {
		location.href = "/src/pages/reservation.html";
	}

	HandleRadioSelect(e) {
		document.getElementById("error").innerHTML = "";
		if (e.target.name === "plus_one_rsvp") {
			this.reservation.PlusOne.Attending = e.target.value === "yes";
		} else {
			const person = e.target.value.substr(0, e.target.value.indexOf('_'));
			const attending = e.target.value.substr(e.target.value.indexOf('_') + 1, e.target.value.length) == "yes";
			this.reservation.Guests.find(x => x.Name == person).Attending = attending;
		}

		this.Render();
	}

	HandlePlusOneNameChange(e) {
		this.reservation.PlusOne.Name = e.target.value;
	}

	async HandleSubmit() {
		if (this.reservation.Guests.some(g => g.Attending == null) || (this.reservation.CanAddPlusOne && this.reservation.PlusOne.Attending == null)) {
			document.getElementById("error").innerHTML = "You didn’t RSVP to the RSVP!<br/>Respond ‘Yes’ or ‘No’ for everyone in your group.";
		} else {
			document.getElementById("error").innerHTML = "";
			localStorage.setItem('reservation', JSON.stringify(this.reservation));
			window.location = "/src/pages/dinner.html";
		}
	}

	async HandleNoteToCoupleText(e) {
		this.reservation.Note = e.target.value;
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
					<div class="level">
						<div class="level-left">${guest.Name}</div>
						<div class="level-right">
							<div class="buttons is-expanded has-addons is-right radio-buttons-as-buttons">
								<label class="button ${guest.Attending === true ? "is-primary" : ""}"><input type="radio" @click="${rsvpClickHandler}" value="${guest.Name}_yes" name="attending" .checked=${guest.Attending === true} /> Yes</label>
								<label class="button ${guest.Attending === false ? "is-primary" : ""}"><input type="radio" @click="${rsvpClickHandler}" value="${guest.Name}_no" name="attending" .checked=${guest.Attending === false} /> No</label>
							</div>
						</div>
					</div>`;

		let plusOneTemplate = (guest) => html`
					<div class="level" id="plus_one_field">
						<div class="control">
							<input class="input level-left ${guest.Attending === false ? "is-hidden" : ""}" type="text" id="plus_one_name" @change="${plusOneNameChangeHandler}" value="${guest.Name}" placeholder="${guest.Name}" />
						</div>
						<div class="level-right">
							<div class="buttons is-expanded has-addons is-right radio-buttons-as-buttons">
								<label class="button ${guest.Attending === true ? "is-primary" : ""}"><input type="radio" @click="${rsvpClickHandler}" name="plus_one_rsvp" value="yes" .checked=${guest.Attending === true} /> Yes</label>
								<label class="button ${guest.Attending === false ? "is-primary" : ""}"><input type="radio" @click="${rsvpClickHandler}" name="plus_one_rsvp" value="no" .checked=${guest.Attending === false} /> No</label>
							</div>
						</div>
					</div>`;

		let guestsListTemplate = (r) => html`
			<p class="content has-text-centered mb-6">We have reserved ${Math.max(2, r.Guests.length)} seats in your honor.</p>
			${r.Guests.map(g => html`${guestTemplate(g)}`)}
			${this.reservation.CanAddPlusOne ? html`${plusOneTemplate(this.reservation.PlusOne)}` : ''}
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

		if (this.reservation.Guests.every(x => x.Attending === false)) {
			document.getElementById("not_attending_info").classList.remove("is-hidden");
			document.getElementById("plus_one_field").classList.add("is-hidden");
			document.getElementById("next").innerHTML = "Next: RSVP";
		} else {
			document.getElementById("not_attending_info").classList.add("is-hidden");
			document.getElementById("plus_one_field").classList.remove("is-hidden");
			document.getElementById("next").innerHTML = "Next: Dinner Choice";
		}

		if (this.reservation.PlusOne.Attending === false) {
			document.getElementById("plus_one_name").classList.add("is-hidden");
		} else {
			document.getElementById("plus_one_name").classList.remove("is-hidden");
		}
	}

	async LoadData() {
		const rsvpBackend = new RSVPBackend();
		try {
			this.reservation = JSON.parse(localStorage.getItem('reservation'));
			this.reservation.PlusOne.Name = this.reservation.Guests[0].Name + "'s plus one";
			this.Render();
		}
		catch(e) {
			alert("We couldn't find your reservation");
			console.error(e);
			//location.href = "/src/pages/reservation.html";
			return;
		}
	}

	async init() {
		document.getElementById("previous").addEventListener("click", this.HandlePrevious.bind(this));
		document.getElementById("next").addEventListener("click", this.HandleSubmit.bind(this));
		document.getElementById("group_note").addEventListener("change", this.HandleNoteToCoupleText.bind(this));
		this.LoadData();
	}
}

const attending_controller = new AttendingController();
attending_controller.init();
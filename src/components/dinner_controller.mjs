import {WeddingHeader} from '/src/components/wedding_header.mjs';
import {RSVPBackend} from '/src/components/backend.mjs';

class DinnerController {
	HandlePrevious() {
		if (this.GetPreviousGuest() !== null) {
			this.error = "";
			this.current_guest = this.GetPreviousGuest();
			this.Render();
		} else {
			location.href = "/src/pages/attending.html";
		}
	}

	async HandleNext() {
		if (this.GetCurrentGuest().Dinner === null) {
			this.error = "Choose an option. If you’re indecisive... We’d recommended the steak (It’s pretty good)";
			this.Render();
			return;
		}

		if (this.GetNextGuest() === null) {
			localStorage.setItem('reservation', JSON.stringify(this.reservation));
			const backend = new RSVPBackend();
			document.getElementById("next").classList.add("is-loading");
			try {
				await backend.SaveReservation(this.reservation);
			} catch(e) {
				document.getElementById("next").classList.remove("is-loading");
				this.error = "There was a problem on the backend. Please try again";
				this.Render();
				return;
			}
			document.getElementById("next").classList.remove("is-loading");
			location.href = "/src/pages/finish.html";
		} else {
			this.current_guest = this.GetNextGuest();
			this.Render();
		}
	}

	HandleDinnerSelectionChange(e) {
		this.error = "";
		this.GetCurrentGuest().Dinner = e.target.value;
		this.Render();
	}

	HandleAllergyTextChange(e) {
		this.GetCurrentGuest().RestrictionsNote = e.target.value;
	}

	GetCurrentGuest() {
		if (this.current_guest === null) {
			this.current_guest = this.reservation.guests.find(x => x.Attending);
			return this.current_guest;
		} else {
			return this.current_guest;
		}
	}

	GetNextGuest() {
		var current_guest = this.GetCurrentGuest();
		if (this.reservation.guests.indexOf(current_guest) === -1) {
			// current guest is the plus one, so there isn't anything available
			return null;
		} else {
			for (var x = this.reservation.guests.indexOf(current_guest) + 1; x < this.reservation.guests.length; x++) {
				if (this.reservation.guests[x].Attending) {
					return this.reservation.guests[x];
				}
			}

			// guaranteed the next guest is plus one if its available... 
			if (this.reservation.can_add_plus_one && this.reservation.plus_one.Attending) {
				return this.reservation.plus_one;
			}

			return null;
		}
	}

	GetPreviousGuest() {
		var current_guest = this.GetCurrentGuest();
		if (current_guest == this.reservation.plus_one) {
			// previous guest is the last available guest
			return this.reservation.guests.slice().reverse().find(x => x.Attending);
		} else {
			for (var x = this.reservation.guests.indexOf(current_guest) - 1; x >= 0; x--) {
				if (this.reservation.guests[x].Attending) {
					return this.reservation.guests[x];
				}
			}
		}

		return null;
	}

	Render() {
		const current_guest = this.GetCurrentGuest();
		const next_guest = this.GetNextGuest();
		const previous_guest = this.GetPreviousGuest();
		document.getElementById("guest_name").innerHTML = current_guest.Name;
		switch(current_guest.Dinner) {
			case "Steak":
				document.getElementById("steak").checked = true;
				break;

			case "Fish":
				document.getElementById("fish").checked = true;
				break;

			case "Vegetable":
				document.getElementById("veg").checked = true;
				break;

			default:
				document.getElementById("steak").checked = false;
				document.getElementById("fish").checked = false;
				document.getElementById("veg").checked = false;
				break;
		}

		document.getElementById("allergy_text").value = current_guest.RestrictionsNote;
		document.getElementById("previous").innerHTML = previous_guest == null ? "⬅ Previous" : "⬅ " + previous_guest.Name;
		document.getElementById("next").innerHTML = next_guest === null ? "Next: Confirm Details" : `Next: ${next_guest.Name}`;
		document.getElementById("error").innerHTML = this.error;
	}

	init() {
		document.getElementById("next").addEventListener("click", this.HandleNext.bind(this));
		document.getElementById("previous").addEventListener("click", this.HandlePrevious.bind(this));
		document.getElementById("steak").addEventListener("click", this.HandleDinnerSelectionChange.bind(this));
		document.getElementById("veg").addEventListener("click", this.HandleDinnerSelectionChange.bind(this));
		document.getElementById("fish").addEventListener("click", this.HandleDinnerSelectionChange.bind(this));
		document.getElementById("allergy_text").addEventListener("change", this.HandleAllergyTextChange.bind(this));

		this.reservation = JSON.parse(localStorage.getItem('reservation'));
		if (this.reservation == null) {
			alert("something broke yo");
		}

		this.error = "";
		this.current_guest = null;
		this.Render();
	}
}

const dinner_controller = new DinnerController();
dinner_controller.init();
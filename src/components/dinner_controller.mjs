import {WeddingHeader} from '/src/components/wedding_header.mjs';
import {RSVPBackend} from '/src/components/backend.mjs';

class DinnerController {
	HandlePrevious() {
		if (this.guest_index > 0) {
			this.guest_index -= 1;
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
			const backend = new RSVPBackend();
			document.getElementById("next").classList.add("is-loading");
			await backend.SaveReservation(this.reservation);
			document.getElementById("next").classList.remove("is-loading");
			//location.href = "/src/pages/finish.html";
		} else {
			this.guest_index += 1;
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
		for (var x = this.guest_index; x < this.reservation.Guests.length; x++) {
			if (this.reservation.Guests[x].Attending) {
				return this.reservation.Guests[x];
			}
		}

		// no more guests found, what about +1?
		if (this.reservation.CanAddPlusOne && this.reservation.PlusOne.Attending) {
			return this.reservation.PlusOne;
		}

		return null;
	}

	GetNextGuest() {
		var current_guest = this.GetCurrentGuest();
		for (var x = this.guest_index; x < this.reservation.Guests.length; x++) {
			if (this.reservation.Guests[x].Attending && this.reservation.Guests[x] !== current_guest) {
				return this.reservation.Guests[x];
			}
		}

		// no more guests found, what about +1?
		if (this.reservation.CanAddPlusOne && this.reservation.PlusOne.Attending && this.reservation.PlusOne != current_guest) {
			return this.reservation.PlusOne;
		}

		return null;	
	}

	GetPreviousGuest() {
		for (var x = this.guest_index - 1; x >= 0; x--) {
			if (this.reservation.Guests[x].Attending) {
				return this.reservation.Guests[x];
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
		this.guest_index = 0;
		this.Render();
	}
}

const dinner_controller = new DinnerController();
dinner_controller.init();
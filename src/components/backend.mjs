export class RSVPBackend {
	async SearchForReservation() {
		const chanceError = Math.floor(Math.random() * 100);

		if (Math.floor(Math.random() * 10) <= 1) { // 10% chance of error
			return Promise.reject("No name found. Enter your name again or try another name from your group.");
		}

		if (Math.floor(Math.random()) == 0) {
			return Promise.resolve({
				ReservationIdentifier: "2BBDE96A-51A3-4B55-93A2-BD3F02F1F560",
				CanAddPlusOne: true,
				Note: "Lorem Ipsum",
				Guests: [
					{
						Name: "John Single",
						Attending: null,
						Dinner: null

					}
				]
			});
		}

		return Promise.resolve({
			ReservationIdentifier: "2BBDE96A-51A3-4B55-93A2-BD3F02F1F560",
			CanAddPlusOne: false,
			Note: "Lorem Ipsum",
			Guests: [
				{
					Name: "John Doe",
					Attending: null,
					Dinner: "Steak"

				},
				{
					Name: "Jane Doe",
					Attending: false,
					Dinner: "Fish"
				},
				{
					Name: "Jack Doe",
					Attending: true,
					Dinner: null
				}
			]
		});
	}

	async LoadReservation(reservationid) {
		if (reservationid == "") {
			return Promise.reject("No reservation id given");
		}
		
		if (Math.floor(Math.random() * 10) <= 1) { // 10% chance of error
			return Promise.reject("No reservation found.");
		}

		return Promise.resolve({
			ReservationIdentifier: "2BBDE96A-51A3-4B55-93A2-BD3F02F1F560",
			CanAddPlusOne: false,
			Note: "Lorem Ipsum",
			Guests: [
				{
					Name: "John Doe",
					Attending: null,
					Dinner: "Steak"

				},
				{
					Name: "Jane Doe",
					Attending: false,
					Dinner: "Fish"
				},
				{
					Name: "Jack Doe",
					Attending: true,
					Dinner: null
				}
			]
		});
	}
}
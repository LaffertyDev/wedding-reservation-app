export class RSVPBackend {
	async SearchForReservation() {
		const chanceError = Math.floor(Math.random() * 100);

		if (Math.floor(Math.random() * 20) <= 1) { // 5% chance of error
			return Promise.reject("No name found. Enter your name again or try another name from your group.");
		}

		if (Math.floor(Math.random()) == 0) {
			return Promise.resolve({
				ReservationIdentifier: "2BBDE96A-51A3-4B55-93A2-BD3F02F1F560",
				CanAddPlusOne: true,
				Note: "Lorem Ipsum",
				Guests: [
					{
						Name: "John Doe",
						Attending: null,
						Dinner: "Steak",
						RestrictionsNote: null
					},
					{
						Name: "Jane Doe",
						Attending: null,
						Dinner: "Fish",
						RestrictionsNote: null
					},
					{
						Name: "Jack Doe",
						Attending: null,
						Dinner: null,
						RestrictionsNote: null
					},
					{
						Name: "Yozeph Yrgovich",
						Attending: null,
						Dinner: null,
						RestrictionsNote: null
					}
				],
				PlusOne: {
					Name: "",
					Attending: null,
					Dinner: null,
					RestrictionsNote: null
				}
			});
		}

		return Promise.resolve({
			ReservationIdentifier: "2BBDE96A-51A3-4B55-93A2-BD3F02F1F560",
			CanAddPlusOne: true,
			Note: "",
			Guests: [
				{
					Name: "John Doe",
					Attending: true,
					Dinner: "Steak",
					RestrictionsNote: null
				},
				{
					Name: "Jane Doe",
					Attending: null,
					Dinner: "Fish",
					RestrictionsNote: null
				},
				{
					Name: "Jack Doe",
					Attending: null,
					Dinner: null,
					RestrictionsNote: null
				},
				{
					Name: "Yozeph Yrgovich",
					Attending: null,
					Dinner: null,
					RestrictionsNote: null
				}
			],
			PlusOne: {
				Name: "",
				Attending: null,
				Dinner: null,
				RestrictionsNote: null
			}
		});
	}

	async LoadReservation(reservationid) {
		if (reservationid == "") {
			return Promise.reject("No reservation id given");
		}
		
		if (Math.floor(Math.random() * 20) <= 1) { // 5% chance of error
			return Promise.reject("No reservation found.");
		}

		return Promise.resolve({
			ReservationIdentifier: "2BBDE96A-51A3-4B55-93A2-BD3F02F1F560",
			CanAddPlusOne: true,
			Note: "",
			Guests: [
				{
					Name: "John Doe",
					Attending: true,
					Dinner: "Steak",
					RestrictionsNote: null
				},
				{
					Name: "Jane Doe",
					Attending: null,
					Dinner: "Fish",
					RestrictionsNote: null
				},
				{
					Name: "Jack Doe",
					Attending: null,
					Dinner: null,
					RestrictionsNote: null
				},
				{
					Name: "Yozeph Yrgovich",
					Attending: null,
					Dinner: null,
					RestrictionsNote: null
				}
			],
			PlusOne: {
				Name: "",
				Attending: null,
				Dinner: null,
				RestrictionsNote: null
			}
		});
	}

	async SaveReservation(reservation) {
		await new Promise(r => setTimeout(r, 2000));
		console.log("saved reservation", reservation);
	}
}
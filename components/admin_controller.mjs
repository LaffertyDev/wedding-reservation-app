import {html, render} from 'https://unpkg.com/lit-html?module';
import {RSVPBackend} from '/components/backend.mjs';
import {WeddingHeader} from '/components/wedding_header.mjs';

class AdminController {

	// async HandleDeleteData(e) {
	// 	e.preventDefault();
	// 	let rsvpBackend = new RSVPBackend();
	// 	await rsvpBackend.DeleteAllData();
	// }
	async HandleUploadData(e) {
		e.preventDefault();
		let rsvpBackend = new RSVPBackend();
		await rsvpBackend.UploadRSVPData();
	}

	async init() {
		document.getElementById("load_data").addEventListener("click", this.HandleUploadData.bind(this));
		// document.getElementById("delete_data").addEventListener("click", this.HandleDeleteData.bind(this));
	}
}

const controller = new AdminController();
controller.init();
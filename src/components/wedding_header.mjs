import {html, render} from 'https://unpkg.com/lit-html?module';

export class WeddingHeader {
	init() {
		let headerTemplate = (data) => html`
			<h1 class="title is-1 is-spaced has-text-centered emily-color">RSVP</h1>
			<p class="subtitle has-text-centered emily-color">Nate & Emily | August 27th, 2022</p>
			<p class="subtitle has-text-centered emily-color">Respond by June 31st, 2022.</p>`;
		const headerRender = headerTemplate({});
		render(headerRender, document.getElementById("wedding-header"));
	}
}

const weddingHeader = new WeddingHeader();
weddingHeader.init();
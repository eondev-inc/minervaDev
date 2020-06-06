import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-register',
	templateUrl: './register.page.html',
	styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
	constructor() {}

	ngOnInit() {}

	getDate(e) {
		let date = new Date(e.target.value).toISOString().substring(0, 10);
		console.log(date);
	}
}

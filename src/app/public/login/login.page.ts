import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
	logo: string = '../../assets/img/minerva_login.png';
	constructor() {}

	ngOnInit() {}
}

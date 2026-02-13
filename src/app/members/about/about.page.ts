import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
	standalone: false,
	selector: 'app-about',
	templateUrl: './about.page.html',
	styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
	constructor(private auth: AuthenticationService, private route: Router) {}

	ngOnInit() {}

	/**
	 * Sacar al usuario de la aplicación
	 */
	async userLogout() {
		try {
			let logout = await this.auth.userLogout();
			console.log(logout);
			if (logout) {
				this.route.navigateByUrl('/login');
			} else {
				console.log('UN ERROR');
			}
		} catch (error) {
			console.error(error);
		}
	}
}

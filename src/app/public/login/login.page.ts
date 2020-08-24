import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserLoginModel } from 'src/app/models/user.login.model';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
	private TAG: string = 'LoginPageComponent';
	logo: string = '../../assets/img/minerva_login.png';
	user: UserLoginModel;
	invalid: boolean;
	constructor(
		private auth: AuthenticationService,
		private route: Router,
		public loadingController: LoadingController,
		private alertController: AlertController
	) {
		this.user = new UserLoginModel();
		this.invalid = false;
	}

	ngOnInit() {
		this.auth.isAuthenticated().then((res) => {
			console.log(res);
			if (res) {
				this.route.navigateByUrl('/dashboard');
			}
		});
	}

	/**
	 *  Login user en la app
	 * @param form
	 */
	async onLoginUser(form: NgForm) {
		const loading = await this.loadingController.create({
			message: 'Loading...',
			spinner: 'bubbles',
		});
		const alertLoading = await this.alertController.create({
			header: 'Atención!',
			message: 'Correo no verificado o contraseña no válida...',
			buttons: ['OK'],
		});
		await loading.present();

		if (form.invalid) {
			this.invalid = true;
			await loading.dismiss();
			return;
		}

		this.auth
			.userLogin(this.user)
			.then(async (result) => {
				await loading.dismiss();
				if (result) {
					this.route.navigateByUrl('/dashboard');
				} else {
					await alertLoading.present();
				}
			})
			.catch(async (error) => {
				console.error(error);
				await alertLoading.present();
				await loading.dismiss();
			});
	}

	// onLoginFacebook() {
	// 	try {
	// 		this.auth.userLoginFacebook();
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// }

	async onLoginTwitter() {
		try {
			const loading = await this.loadingController.create({
				message: 'Loading...',
				spinner: 'bubbles',
			});

			await loading.present();
			await this.auth.userLoginTwitter();
			await loading.dismiss();
			this.route.navigateByUrl('/dashboard');
		} catch (error) {}
	}

	/**
	 * Metodo para la autenticacion contra Google y Firebase
	 */
	async onLoginGoogle() {
		try {
			const loading = await this.loadingController.create({
				message: 'Loading...',
				spinner: 'bubbles',
			});
			await loading.present();
			await this.auth.userLoginGoogle();
			await loading.dismiss();

			this.route.navigateByUrl('/dashboard');
		} catch (error) {
			/**
			 * TODO:
			 * 1. Hay que desarrollar una clase que contenga los errores en la aplicacion
			 * y los envie a una cola o a una base de datos asincrona
			 */
			console.error(this.TAG + ' - ' + error.message);
		}
	}
}

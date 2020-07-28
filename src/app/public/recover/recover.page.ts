import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidatorsService } from 'src/app/services/validators.service';
import { RecoveryService } from 'src/app/services/recovery.service';
import { UserRecoveryModel } from 'src/app/models/user.recovery.model';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
	selector: 'app-recover',
	templateUrl: './recover.page.html',
	styleUrls: ['./recover.page.scss'],
})
export class RecoverPage implements OnInit {
	recoverForm: FormGroup;
	isSubmitted: boolean = false;
	mailSend: boolean = false;
	constructor(
		public formBuild: FormBuilder,
		private valids: ValidatorsService,
		private recoveryService: RecoveryService,
		private loadingController: LoadingController,
		private alertController: AlertController
	) {}

	ngOnInit() {
		this.buildFormGroup();
	}

	//Getters para el formulario
	get emailInvalid() {
		return this.recoverForm.get('email').touched && this.recoverForm.get('email').invalid;
	}

	submitForm() {
		this.isSubmitted = true;
		console.log(this.recoverForm);

		if (this.recoverForm.invalid) {
			return Object.values(this.recoverForm.controls).forEach((control) => {
				if (control instanceof FormGroup) {
					Object.values(control.controls).forEach((ctrl) => {
						ctrl.markAsTouched();
					});
				} else {
					control.markAsTouched();
				}
			});
		}

		this.sendFormAndRecover(this.recoverForm.value);
	}

	async sendFormAndRecover(values: UserRecoveryModel) {
		try {
			const alertLoading = await this.alertController.create({
				header: 'Atención!',
				message: 'El correo no existe o no es válido...',
				buttons: ['OK'],
			});
			const loading = await this.loadingController.create({
				message: 'Loading...',
				spinner: 'bubbles',
			});
			await loading.present();

			this.mailSend = await this.recoveryService.recoveryPasswordByEmail(values.email);

			if (this.mailSend) {
				await loading.dismiss();
			} else {
				await loading.dismiss();
				await alertLoading.present();
			}
		} catch (error) {
			console.error(error);
		}
	}

	buildFormGroup() {
		this.recoverForm = this.formBuild.group({
			email: [
				'',
				[Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')],
				this.valids.checkEmail,
			],
		});
	}
}

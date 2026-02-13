import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment-timezone';
import { ValidatorsService } from 'src/app/services/validators.service';
import { RegistrationService } from 'src/app/services/registration.service';
import { UserRegisterModel } from 'src/app/models/user.register.model';

@Component({
	standalone: false,
	selector: 'app-register',
	templateUrl: './register.page.html',
	styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
	registerForm: FormGroup;
	defaultDate: string = moment(new Date()).format('YYYY-MM-DD');
	isSubmitted: boolean = false;
	checkingEmail: boolean;
	constructor(public fb: FormBuilder, private valids: ValidatorsService, private regService: RegistrationService) {}

	ngOnInit() {
		this.buildFormGroup();
		this.buildListener();
	}

	/**
	 * Getters del formulario para validaciones
	 */

	get errorControl() {
		return this.registerForm.controls;
	}

	get nameInvalid() {
		return this.registerForm.get('name').touched && this.registerForm.get('name').invalid;
	}

	get lastNameInvalid() {
		return this.registerForm.get('lastName').touched && this.registerForm.get('lastName').invalid;
	}

	get genderInvalid() {
		return this.registerForm.get('gender').touched && this.registerForm.get('gender').invalid;
	}

	get dobInvalid() {
		return this.registerForm.get('dob').touched && this.registerForm.get('dob').invalid;
	}

	get emailInvalid() {
		return this.registerForm.get('email').touched && this.registerForm.get('email').invalid;
	}

	get passwordInvalid() {
		return this.registerForm.get('password').touched && this.registerForm.get('password').invalid;
	}

	get confirmPassInvalid() {
		let pass1 = this.registerForm.get('password').value;
		let pass2 = this.registerForm.get('confirmPassword').value;

		return pass1 === pass2 ? false : true;
	}
	//Fin de Getters

	getDate(e) {
		let date = new Date(e.target.value).toISOString().substring(0, 10);
		this.registerForm.get('dob').setValue(date, {
			onlySelf: true,
		});
		console.log(date);
	}

	submitForm() {
		this.isSubmitted = true;
		console.log(this.registerForm);

		if (this.registerForm.invalid) {
			return Object.values(this.registerForm.controls).forEach((control) => {
				if (control instanceof FormGroup) {
					Object.values(control.controls).forEach((ctrl) => {
						ctrl.markAsTouched();
					});
				} else {
					control.markAsTouched();
				}
			});
		}

		this.sendFormAndRegister(this.registerForm.value);
	}

	private sendFormAndRegister(values: UserRegisterModel) {
		let registerUser: UserRegisterModel = {
			name: values.name,
			lastName: values.lastName,
			gender: values.gender,
			email: values.email,
			dob: values.dob,
			password: values.password,
		};

		try {
			this.regService.registerUserWithCredentials(registerUser);
		} catch (error) {
			console.error(error);
		}
	}

	buildFormGroup() {
		this.registerForm = this.fb.group(
			{
				name: ['', [Validators.required, Validators.minLength(3)]],
				lastName: ['', [Validators.required, Validators.minLength(3)]],
				dob: [this.defaultDate],
				gender: ['', Validators.required],
				email: [
					'',
					[Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')],
					this.valids.checkEmail,
				],
				password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
				confirmPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
			},
			{
				validators: this.valids.checkPasswords('password', 'confirmPassword'),
			}
		);
	}

	/**
	 * Método que escucha los cambios dentro del formulario para verificar la existencia del correo
	 */
	buildListener() {
		this.registerForm.get('email').statusChanges.subscribe((status) => {
			if (status !== 'PENDING') {
				this.checkingEmail = false;
				console.log(this.checkingEmail);
			} else {
				this.checkingEmail = true;
				console.log(this.checkingEmail);
			}
		});
	}
}

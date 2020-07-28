import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { UsersService } from './users.service';

interface ErrorHandling {
	[s: string]: boolean;
}
@Injectable({
	providedIn: 'root',
})
export class ValidatorsService {
	constructor(public userService: UsersService) {}

	checkPasswords(pass1: string, pass2: string) {
		return (formGroup: FormGroup) => {
			let passwordOne = formGroup.controls[pass1];
			let passwordTwo = formGroup.controls[pass2];

			if (passwordOne.value === passwordTwo.value) {
				passwordTwo.setErrors(null);
			} else {
				passwordTwo.setErrors({ notEqual: true });
			}
		};
	}

	checkEmail(control: FormControl): Promise<ErrorHandling> | Observable<ErrorHandling> {
		if (!control.value) {
			return Promise.resolve(null);
		}
		this.userService
			.getUserByEmail(control.value)
			.then((res) => {
				if (res.exists) {
					return Promise.resolve({ existe: true });
				} else {
					return Promise.resolve({ existe: false });
				}
			})
			.catch((error) => {
				console.log(error);
				return Promise.resolve(null);
			});
	}
}

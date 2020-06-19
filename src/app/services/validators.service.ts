import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

interface ErrorHandling {
	[s: string]: boolean;
}
@Injectable({
	providedIn: 'root',
})
export class ValidatorsService {
	constructor() {}

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

		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (control.value === 'yromero@izit.cl') {
					resolve({ existe: true });
				} else {
					resolve(null);
				}
			}, 3500);
		});
	}
}

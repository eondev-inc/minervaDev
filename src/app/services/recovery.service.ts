import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
	providedIn: 'root',
})
export class RecoveryService {
	constructor(private auth: AngularFireAuth) {}

	public recoveryPasswordByEmail(email: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.auth
				.sendPasswordResetEmail(email)
				.then(() => {
					console.log('El correo fue enviado');
					resolve(true);
				})
				.catch((error) => {
					console.log(error.message);
					resolve(false);
				});
		});
	}
}

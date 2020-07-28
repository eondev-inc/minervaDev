import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { firestore } from 'firebase';
import { UserRecoveryModel } from '../models/user.recovery.model';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { UsersService } from './users.service';
import { Users } from '../models/users.model';

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

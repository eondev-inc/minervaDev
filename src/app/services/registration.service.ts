import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { UserRegisterModel } from '../models/user.register.model';
import * as moment from 'moment-timezone';

@Injectable({
	providedIn: 'root',
})
export class RegistrationService {
	private usersCollection: AngularFirestoreCollection<UserRegisterModel>;
	constructor(private fireAuth: AngularFireAuth, private readonly fireStorage: AngularFirestore) {
		this.usersCollection = fireStorage.collection<UserRegisterModel>('users');
	}

	public registerUserWithCredentials(user: UserRegisterModel) {
		this.fireAuth
			.createUserWithEmailAndPassword(user.email, user.password)
			.then((result) => {
				//Invocar al servicio de registro de base de datos para crear el nuevo
				//Usuario
				if (result) {
					user.provider = result.user.providerId;
					user.uuid = result.user.uid;
					user.createdAt = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
					console.log(user);
					this.addRegisterItem(user);
				}
			})
			.catch((error) => {
				console.log(error);
				//Se infieren varios errores, el usuario ya existe o
				//imposibilidad de conectarse con el servicio

				//En caso de que el usuario ya exista

				//En caso de error en la conexión
			});
	}

	private addRegisterItem(user: UserRegisterModel) {
		try {
			this.usersCollection.add(user);
		} catch (error) {
			console.error(error);
		}
	}
}

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { UserRegisterModel } from '../models/user.register.model';
import * as moment from 'moment-timezone';
import { UsersService } from './users.service';
import { Users } from '../models/users.model';

@Injectable({
	providedIn: 'root',
})
export class RegistrationService {
	constructor(private fireAuth: AngularFireAuth, private userService: UsersService) {}

	public async registerUserWithCredentials(user: UserRegisterModel): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.fireAuth
				.createUserWithEmailAndPassword(user.email, user.password)
				.then((result) => {
					//Invocar al servicio de registro de base de datos para crear el nuevo
					//Usuario
					if (result !== null) {
						user.provider = result.user.providerId;
						user.uuid = result.user.uid;
						user.createdAt = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
						console.log(user);
						this.addRegisterItem(user);

						result.user.sendEmailVerification();
						//El usuario fue creado y el mensaje de validacion de correos fue enviado
						resolve(true);
					}
				})
				.catch((error) => {
					/**
					 * TODO:
					 * 1. Se necesitan manejar los errores
					 */
					console.error(error);
					//Se infieren varios errores, el usuario ya existe o
					//imposibilidad de conectarse con el servicio
					reject(error);
				});
		});
	}

	private addRegisterItem(reg: UserRegisterModel) {
		let user: Users = new Users();

		user.createdAt = reg.createdAt;
		user.dob = reg.dob;
		user.email = reg.email;
		user.emailverified = false;
		user.gender = reg.gender;
		user.lastName = reg.lastName;
		user.name = reg.name;
		user.password = reg.password; //Pendiente que el Password hay que actualizarlo cuando lo quieran recuperar
		user.provider = reg.provider;
		user.uuid = reg.uuid;

		try {
			this.userService.createUser(user);
		} catch (error) {
			console.error(error);
		}
	}
}

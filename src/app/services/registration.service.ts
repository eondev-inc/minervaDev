import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { UserRegisterModel } from '../models/user.register.model';
import * as moment from 'moment-timezone';
import { UsersService } from './users.service';
import { Users } from '../models/users.model';

@Injectable({
	providedIn: 'root',
})
export class RegistrationService {
	constructor(private fireAuth: AngularFireAuth, private userService: UsersService) {}

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

					result.user.sendEmailVerification();
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

	private addRegisterItem(reg: UserRegisterModel) {
		let user: Users = new Users();

		user.createdAt = reg.createdAt;
		user.dob = reg.dob;
		user.email = reg.email;
		user.gender = reg.gender;
		user.lastName = reg.lastName;
		user.name = reg.name;
		user.password = reg.password;
		user.provider = reg.provider;
		user.uuid = reg.uuid;

		try {
			this.userService.createUser(user);
		} catch (error) {
			console.error(error);
		}
	}
}

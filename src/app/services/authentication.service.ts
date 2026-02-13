import { Injectable } from '@angular/core';
import { UserLoginModel } from '../models/user.login.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Storage } from '@ionic/storage';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';

const TOKEN = 'authtoken';
@Injectable({
	providedIn: 'root',
})
export class AuthenticationService {
	private TAG: string = 'AuthenticationService';
	private authenticationState = new BehaviorSubject(false);
	private token: string;

	constructor(private fireAuth: AngularFireAuth, private storage: Storage, private plt: Platform) {}

	/**
	 * Metodo para crear el inicio de sesión del usuario y obtener las credenciales
	 * @returns Promise<boolean>
	 * @param user: UserLoginModel
	 */
	public async userLogin(user: UserLoginModel): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.fireAuth
				.signInWithEmailAndPassword(user.username, user.password)
				.then(async (result) => {
					let verified = await result.user.emailVerified;

					if (verified) {
						this.token = await result.user.getIdToken();
						this.saveAuthToken();
						resolve(true);
					} else {
						reject(false);
					}
				})
				.catch((error) => {
					/**
					 * TODO:
					 * 1. Control de errores en la app
					 * y enviar datos a algún procesador
					 * para corrección de bugs o seguimiento
					 */
					resolve(false);
					console.error(this.TAG, error.message);
				});
		});
	}

	async userLogout(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.storage
				.remove(TOKEN)
				.then((res) => {
					resolve(true);
				})
				.catch((error) => {
					resolve(false);
					console.error(error);
				});
		});
	}

	/**
	 * Metodo para el acceso a la aplicación a través de Facebook
	 */

	public userLoginFacebook() {
		try {
			let provider = new firebase.auth.FacebookAuthProvider();
			provider.addScope('email');
			provider.addScope('user_birthday');
			provider.addScope('user_gender');
			provider.addScope('first_name');
			provider.addScope('last_name');
			provider.addScope('photo');

			this.fireAuth.signInWithPopup(provider);
		} catch (error) {}
	}

	/**
	 * Método para el acceso a la aplicación a través de Twitter
	 */
	public userLoginTwitter() {
		try {
			let provider = new firebase.auth.TwitterAuthProvider();
			firebase.auth().useDeviceLanguage();

			this.fireAuth.signInWithPopup(provider).then((result) => {
				console.log(JSON.stringify(result.credential) + ' ' + JSON.stringify(result.user));
			});
		} catch (error) {
			console.error(error);
		}
	}
	/**
	 * Guardar el token en el storage de ionic y setear la propiedad de autenticacion
	 */
	private saveAuthToken() {
		this.storage
			.set(TOKEN, this.token)
			.then(() => {
				this.authenticationState.next(true);
			})
			.catch((error) => console.error(error));
	}

	/**
	 * Verificar si el usuario ya tiene sus credenciales en el storage
	 */
	private checkAuthToken(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.storage.get(TOKEN).then((res) => {
				if (res) {
					/**
					 * TODO:
					 * Chequear la validez del token almacenado en storage
					 * co ayuda de firebase si está caducado entonces pedir otro
					 * y no iniciar sesión
					 */
					this.authenticationState.next(true);
					resolve(true);
				} else {
					this.authenticationState.next(false);
					resolve(false);
				}
			});
		});
	}

	/**
	 * Verificar si el usuario ya se encuentra logueado
	 */
	public async isAuthenticated() {
		await this.checkAuthToken();
		return this.authenticationState.value;
	}
}

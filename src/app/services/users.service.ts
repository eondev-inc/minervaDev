import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Users } from '../models/users.model';
import { UserRegisterModel } from '../models/user.register.model';
import { User } from 'firebase';

@Injectable({
	providedIn: 'root',
})
export class UsersService {
	private dbPath: string = '/users';
	usersRef: AngularFirestoreCollection<Users> = null;
	user: User;
	constructor(private db: AngularFirestore) {
		this.usersRef = db.collection(this.dbPath);
	}

	/**
	 * Crear un usuario en la tabla
	 * @param user
	 */
	public createUser(user: Users) {
		this.usersRef.doc(user.uuid).set({ ...user });
	}

	/**
	 * Update de algún usuario dentro de la tabla
	 * @param key
	 * @param value
	 */
	public async updateUser(key: string, value: any): Promise<void> {
		return await this.usersRef.doc(key).update(value);
	}

	public async getUserByEmail(email: string) {
		let emailRef = await this.usersRef.doc(email);

		return emailRef.get().toPromise();
	}
}

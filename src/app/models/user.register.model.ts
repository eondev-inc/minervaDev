export interface UserRegisterModel {
	uuid?: string;
	name: string;
	lastName: string;
	email: string;
	password: string;
	dob: Date;
	gender: string;
	createdAt?: string;
	provider?: string;
}

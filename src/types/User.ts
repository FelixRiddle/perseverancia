export default interface User {
	id: number;
	name: string;
	email: string;
	password: string;
	token?: string;
	confirmedEmail: boolean;
	createdAt: Date;
	updatedAt: Date;
}

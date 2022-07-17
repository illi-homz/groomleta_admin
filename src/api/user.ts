import { LoginData } from "@/models/user"

const token: string = 'sfkjvbdkjfnsdflbndlf'

class User {
	static login(data: LoginData): string {
		return token
	}
}

export default User
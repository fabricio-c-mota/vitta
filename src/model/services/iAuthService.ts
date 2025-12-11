import User from "../entities/user";

type Unsubscribe = () => void;

export interface IAuthService {
    login(email: string, password: string): Promise<User>;
    signup(email: string, password: string, name: string): Promise<User>;
    logout(): Promise<void>;
    onAuthStateChanged(callback: (user: User | null) => void): Unsubscribe;
}
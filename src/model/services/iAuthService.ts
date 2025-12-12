import User from "../entities/user";

type Unsubscribe = () => void;

export interface IAuthService {
    login(email: string, password: string): Promise<Partial<User>>;
    signup(email: string, password: string): Promise<Partial<User>>;
    logout(): Promise<void>;
    onAuthStateChanged(callback: (user: Partial<User> | null) => void): Unsubscribe;
}
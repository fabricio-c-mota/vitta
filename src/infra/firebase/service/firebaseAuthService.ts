import User from "@/model/entities/user";
import AuthError from "@/model/errors/authError";
import { IAuthService } from "@/model/services/iAuthService"
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser
} from "firebase/auth";
import { auth } from "@/infra/firebase/config";

export default class FirebaseAuthService implements IAuthService {
    async login(email: string, password: string): Promise<Partial<User>> {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return {
                id: userCredential.user.uid,
                email: userCredential.user.email ?? ''
            }
        } catch (error: any) {
            throw new AuthError('Credenciais inválidas.');
        }
    }

    async signup(email: string, password: string): Promise<Partial<User>> {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return {
                id: userCredential.user.uid,
                email: userCredential.user.email ?? ''
            }
        } catch (error: any) {
            throw new AuthError('Essa conta já existe ou alguma das credenciais está incorreta.');
        }
    }

    async logout(): Promise<void> {
        try {
            await signOut(auth);
        } catch (error: any) {
            throw new AuthError('Não foi possível fazer logout.');
        }
    }

    onAuthStateChanged(callback: (user: Partial<User> | null) => void): () => void {
        return onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                callback({
                    id: firebaseUser.uid,
                    email: firebaseUser.email ?? ''
                });
            } else {
                callback(null);
            }
        });
    }
}
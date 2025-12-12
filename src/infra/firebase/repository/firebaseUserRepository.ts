import User from "@/model/entities/user";
import { IUserRepository } from "@/model/repositories/iUserRepository";
import RepositoryError from "@/model/errors/repositoryError";
import { db } from "../config";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";

export default class FirebaseUserRepository implements IUserRepository {
    private readonly collectionName = 'users';

    async createUser(user: User): Promise<void> {
        try {
            const userRef = doc(db, this.collectionName, user.id);
            await setDoc(userRef, {
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: Timestamp.fromDate(user.createdAt)
            });
        } catch (Error: any) {
            throw new RepositoryError('Erro ao criar usuário no Firestore.');
        }
    }

    async getUserByID(uID: string): Promise<User | null> {
        try {
            const userRef = doc(db, this.collectionName, uID);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                return null;
            }

            const data = userSnap.data();
            return {
                id: userSnap.id,
                name: data.name,
                email: data.email,
                role: data.role,
                createdAt: data.createdAt.toDate()
            };
        } catch (Error: any) {
            throw new RepositoryError('Erro ao buscar usuário no Firestore.');
        }
    }
}
import AuthUseCases from "@/usecase/auth/authUseCases";
import { IAuthUseCases } from "@/usecase/auth/iAuthUseCases";
import FirebaseAuthService from "@/infra/firebase/service/firebaseAuthService";
import FirebaseUserRepository from "@/infra/firebase/repository/firebaseUserRepository";

const authService = new FirebaseAuthService();

const userRepository = new FirebaseUserRepository();

const authUseCases: IAuthUseCases = new AuthUseCases(authService, userRepository);

export { authUseCases };

import GetNutritionistUseCase from "@/usecase/user/getNutritionistUseCase";
import { IGetNutritionistUseCase } from "@/usecase/user/iGetNutritionistUseCase";
import GetUserByIdUseCase from "@/usecase/user/getUserByIdUseCase";
import { IGetUserByIdUseCase } from "@/usecase/user/iGetUserByIdUseCase";
import { getUserRepository, getInitError } from "@/di/others/base";

let nutritionistUseCase: IGetNutritionistUseCase | null = null;
let userByIdUseCase: IGetUserByIdUseCase | null = null;
let initError: Error | null = null;

function initUserUseCases() {
  if ((nutritionistUseCase && userByIdUseCase) || initError) {
    return;
  }

  try {
    const baseError = getInitError();
    if (baseError) {
      throw baseError;
    }
    const repository = getUserRepository();
    nutritionistUseCase = new GetNutritionistUseCase(repository);
    userByIdUseCase = new GetUserByIdUseCase(repository);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao inicializar user";
    console.error("Erro fatal ao inicializar dependências:", errorMessage);
    initError = new Error(`Falha ao inicializar aplicação: ${errorMessage}`);
  }
}

function getNutritionistUseCase() {
  initUserUseCases();
  if (!nutritionistUseCase) {
    throw initError ?? new Error("Falha ao inicializar casos de uso de usuário");
  }
  return nutritionistUseCase;
}

function getUserByIdUseCase() {
  initUserUseCases();
  if (!userByIdUseCase) {
    throw initError ?? new Error("Falha ao inicializar casos de uso de usuário");
  }
  return userByIdUseCase;
}

export { getNutritionistUseCase, getUserByIdUseCase };

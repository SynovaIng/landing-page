import { container } from "@/config/container";
import { CheckUserAuthenticatedUseCase } from "@/contexts/auth/use-cases/check-user-authenticated.use-case";
import { GetAuthenticatedUserUseCase } from "@/contexts/auth/use-cases/get-authenticated-user.use-case";
import { LoginUseCase } from "@/contexts/auth/use-cases/login.use-case";
import { LogoutUseCase } from "@/contexts/auth/use-cases/logout.use-case";

export const createServerAuthUseCases = () => {
  return {
    checkUserAuthenticatedUseCase: container.get(CheckUserAuthenticatedUseCase),
    getAuthenticatedUserUseCase: container.get(GetAuthenticatedUserUseCase),
    loginUseCase: container.get(LoginUseCase),
    logoutUseCase: container.get(LogoutUseCase),
  };
};

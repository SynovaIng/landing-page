import { container } from "@/config/container";
import { GetAuthenticatedUserUseCase } from "@/contexts/auth/use-cases/get-authenticated-user.use-case";
import { LoginUseCase } from "@/contexts/auth/use-cases/login.use-case";
import { LogoutUseCase } from "@/contexts/auth/use-cases/logout.use-case";

export const createServerAuthUseCases = () => {
  return {
    getAuthenticatedUserUseCase: container.get(GetAuthenticatedUserUseCase),
    loginUseCase: container.get(LoginUseCase),
    logoutUseCase: container.get(LogoutUseCase),
  };
};

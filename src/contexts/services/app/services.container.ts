import type { ContainerBuilder } from "diod";

import { ServiceRepository } from "@/contexts/services/domain/service.repository";
import { MockServiceRepository } from "@/contexts/services/infrastructure/mock-service.repository";
import { CreateServiceUseCase } from "@/contexts/services/use-cases/create-service.use-case";
import { GetAllServicesUseCase } from "@/contexts/services/use-cases/get-all-services.use-case";
import { GetServiceByIdUseCase } from "@/contexts/services/use-cases/get-service-by-id.use-case";

export const registerServicesContainer = (builder: ContainerBuilder): void => {
  // Domain & Infrastructure
  builder.register(ServiceRepository).useClass(MockServiceRepository).asSingleton();

  // Use Cases
  builder.registerAndUse(CreateServiceUseCase);
  builder.registerAndUse(GetAllServicesUseCase);
  builder.registerAndUse(GetServiceByIdUseCase);
};

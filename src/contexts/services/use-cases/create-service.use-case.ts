import { Service as DiodService } from "diod";

import type { Service } from "@/contexts/services/domain/service.entity";
import type { CreateServiceInput } from "@/contexts/services/domain/service.repository";
import { ServiceRepository } from "@/contexts/services/domain/service.repository";

@DiodService()
export class CreateServiceUseCase {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async execute(input: CreateServiceInput): Promise<Service> {
    return this.serviceRepository.create(input);
  }
}

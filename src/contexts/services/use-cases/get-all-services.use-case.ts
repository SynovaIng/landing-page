import { Service as DiodService } from "diod";

import type { Service } from "@/contexts/services/domain/service.entity";
import { ServiceRepository } from "@/contexts/services/domain/service.repository";

@DiodService()
export class GetAllServicesUseCase {
  constructor(private readonly repository: ServiceRepository) {}

  async execute(): Promise<Service[]> {
    return this.repository.getAll();
  }
}

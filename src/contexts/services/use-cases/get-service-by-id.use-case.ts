import { Service as DiodService } from "diod";

import type { Service } from "@/contexts/services/domain/service.entity";
import { ServiceRepository } from "@/contexts/services/domain/service.repository";

@DiodService()
export class GetServiceByIdUseCase {
  constructor(private readonly repository: ServiceRepository) {}

  async execute(id: string): Promise<Service | null> {
    return this.repository.getById(id);
  }
}

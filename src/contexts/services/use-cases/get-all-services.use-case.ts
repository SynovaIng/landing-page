import { Service as DiodService } from "diod";

import type { Service } from "@/contexts/services/domain/service.entity";
import type { GetAllServicesOptions } from "@/contexts/services/domain/service.repository";
import { ServiceRepository } from "@/contexts/services/domain/service.repository";

@DiodService()
export class GetAllServicesUseCase {
  constructor(private readonly repository: ServiceRepository) {}

  async execute(options?: GetAllServicesOptions): Promise<Service[]> {
    return this.repository.getAll(options);
  }
}

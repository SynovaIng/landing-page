import { Service as DiodService } from "diod";

import type { Service } from "@/contexts/services/domain/service.entity";
import { ServiceRepository } from "@/contexts/services/domain/service.repository";

@DiodService()
export class SetServiceVisibilityUseCase {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async execute(id: string, isPublished: boolean): Promise<Service> {
    return this.serviceRepository.setVisibility(id, isPublished);
  }
}

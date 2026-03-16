import { Service as DiodService } from "diod";

import { ServiceRepository } from "@/contexts/services/domain/service.repository";

@DiodService()
export class ReorderServicesUseCase {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async execute(ids: string[]): Promise<void> {
    await this.serviceRepository.reorder(ids);
  }
}

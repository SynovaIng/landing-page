import { Service as DiodService } from "diod";

import type { Service } from "@/contexts/services/domain/service.entity";
import type { UpdateServiceInput } from "@/contexts/services/domain/service.repository";
import { ServiceRepository } from "@/contexts/services/domain/service.repository";

@DiodService()
export class UpdateServiceUseCase {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async execute(id: string, input: UpdateServiceInput): Promise<Service> {
    return this.serviceRepository.update(id, input);
  }
}

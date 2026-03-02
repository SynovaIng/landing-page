import type { Service } from "./service.entity";

export abstract class ServiceRepository {
  abstract getAll(): Promise<Service[]>;
  abstract getById(id: string): Promise<Service | null>;
}

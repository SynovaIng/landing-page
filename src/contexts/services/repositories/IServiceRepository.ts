import type { Service } from "../domain/Service";

export interface IServiceRepository {
  getAll(): Promise<Service[]>;
  getById(id: string): Promise<Service | null>;
}

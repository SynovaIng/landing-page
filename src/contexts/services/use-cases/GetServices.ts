import type { IServiceRepository } from "../repositories/IServiceRepository";

export async function getServices(repo: IServiceRepository) {
  return repo.getAll();
}

export async function getServiceById(repo: IServiceRepository, id: string) {
  return repo.getById(id);
}

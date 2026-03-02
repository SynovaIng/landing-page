import type { IProjectRepository } from "../repositories/IProjectRepository";

export async function getProjects(repo: IProjectRepository) {
  return repo.getAll();
}

export async function getProjectById(repo: IProjectRepository, id: string) {
  return repo.getById(id);
}

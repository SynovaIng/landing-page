import type { ITestimonialRepository } from "../repositories/ITestimonialRepository";

export async function getTestimonials(repo: ITestimonialRepository) {
  return repo.getAll();
}

export async function getTestimonialById(
  repo: ITestimonialRepository,
  id: string
) {
  return repo.getById(id);
}

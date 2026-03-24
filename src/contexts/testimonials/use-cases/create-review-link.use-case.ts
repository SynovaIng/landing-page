import { Service } from "diod";

import { envs } from "@/config/envs";
import { TestimonialRepository } from "@/contexts/testimonials/domain/testimonial.repository";

const generateToken = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replaceAll("-", "");
  }

  return `${Date.now()}${Math.random().toString(16).slice(2)}`;
};

@Service()
export class CreateReviewLinkUseCase {
  constructor(private readonly testimonialRepository: TestimonialRepository) {}

  async execute(projectId: string, requestBaseUrl?: string): Promise<string> {
    const token = generateToken();

    await this.testimonialRepository.createReviewLink({
      projectId,
      token,
    });

    const baseUrl = (envs.NEXT_PUBLIC_SITE_URL ?? requestBaseUrl ?? "http://localhost:3000").replace(/\/$/, "");

    return `${baseUrl}/review?token=${token}`;
  }
}

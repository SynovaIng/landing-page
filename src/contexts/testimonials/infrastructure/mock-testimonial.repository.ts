import { Service } from "diod";

import { Testimonial } from "@/contexts/testimonials/domain/testimonial.entity";
import type { CreateTestimonialInput } from "@/contexts/testimonials/domain/testimonial.repository";
import { TestimonialRepository } from "@/contexts/testimonials/domain/testimonial.repository";

const mockTestimonials: Testimonial[] = [
  new Testimonial({
    id: "roberto-f",
    text: "Solicité una regularización TE1 para mi local comercial. El proceso fue transparente y rápido. Totalmente recomendados por su profesionalismo.",
    authorName: "Roberto Fernández",
    authorInitials: "RF",
    authorLocation: "Providencia",
    rating: 5,
  }),
  new Testimonial({
    id: "camila-s",
    text: "Excelente servicio de emergencia. Tuvimos un corte total en la oficina un domingo y llegaron en menos de una hora. Nos salvaron la semana.",
    authorName: "Camila Soto",
    authorInitials: "CS",
    authorLocation: "Las Condes",
    rating: 5,
  }),
  new Testimonial({
    id: "andres-v",
    text: "Hicieron toda la iluminación LED de mi departamento nuevo. Muy prolijos, limpios y respetuosos. El acabado final es de lujo.",
    authorName: "Andrés Valenzuela",
    authorInitials: "AV",
    authorLocation: "Vitacura",
    rating: 5,
  }),
];

@Service()
export class MockTestimonialRepository extends TestimonialRepository {
  async getAll(): Promise<Testimonial[]> {
    return mockTestimonials;
  }

  async getById(id: string): Promise<Testimonial | null> {
    return mockTestimonials.find((t) => t.id === id) ?? null;
  }

  async create(input: CreateTestimonialInput): Promise<Testimonial> {
    const created = new Testimonial({
      id: `testimonial-${Date.now()}`,
      text: input.text,
      authorName: input.authorName,
      authorInitials: input.authorInitials,
      authorLocation: input.authorLocation,
      rating: input.rating,
    });

    mockTestimonials.unshift(created);
    return created;
  }
}

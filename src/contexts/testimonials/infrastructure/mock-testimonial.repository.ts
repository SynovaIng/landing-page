import { Service } from "diod";

import { Testimonial } from "@/contexts/testimonials/domain/testimonial.entity";
import type {
  CreateTestimonialInput,
  GetAllTestimonialsOptions,
  UpdateTestimonialInput,
} from "@/contexts/testimonials/domain/testimonial.repository";
import { TestimonialRepository } from "@/contexts/testimonials/domain/testimonial.repository";

const mockTestimonials: Testimonial[] = [
  new Testimonial({
    id: "roberto-f",
    text: "Solicité una regularización TE1 para mi local comercial. El proceso fue transparente y rápido. Totalmente recomendados por su profesionalismo.",
    authorName: "Roberto Fernández",
    authorInitials: "RF",
    authorLocation: "Providencia",
    rating: 5,
    orderIndex: 0,
  }),
  new Testimonial({
    id: "camila-s",
    text: "Excelente servicio de emergencia. Tuvimos un corte total en la oficina un domingo y llegaron en menos de una hora. Nos salvaron la semana.",
    authorName: "Camila Soto",
    authorInitials: "CS",
    authorLocation: "Las Condes",
    rating: 5,
    orderIndex: 1,
  }),
  new Testimonial({
    id: "andres-v",
    text: "Hicieron toda la iluminación LED de mi departamento nuevo. Muy prolijos, limpios y respetuosos. El acabado final es de lujo.",
    authorName: "Andrés Valenzuela",
    authorInitials: "AV",
    authorLocation: "Vitacura",
    rating: 5,
    orderIndex: 2,
  }),
];

@Service()
export class MockTestimonialRepository extends TestimonialRepository {
  async getAll(options?: GetAllTestimonialsOptions): Promise<Testimonial[]> {
    if (options?.includeUnpublished) {
      return mockTestimonials;
    }

    return mockTestimonials.filter((testimonial) => testimonial.isPublished);
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
      isPublished: input.isPublished,
      companyId: input.clientId ?? null,
      projectId: input.projectId ?? null,
      orderIndex: mockTestimonials.length,
    });

    mockTestimonials.unshift(created);
    return created;
  }

  async update(id: string, input: UpdateTestimonialInput): Promise<Testimonial> {
    const index = mockTestimonials.findIndex((testimonial) => testimonial.id === id);

    if (index === -1) {
      throw new Error("No se encontró la reseña");
    }

    const updated = new Testimonial({
      id,
      text: input.text,
      authorName: input.authorName,
      authorInitials: input.authorInitials,
      authorLocation: input.authorLocation,
      rating: input.rating,
      isPublished: input.isPublished,
      companyId: input.clientId ?? null,
      projectId: input.projectId ?? null,
      orderIndex: mockTestimonials[index].orderIndex,
    });

    mockTestimonials[index] = updated;
    return updated;
  }

  async reorder(ids: string[]): Promise<void> {
    const testimonialById = new Map(mockTestimonials.map((testimonial) => [testimonial.id, testimonial]));
    const reordered = ids
      .map((id, index) => {
        const testimonial = testimonialById.get(id);

        if (!testimonial) {
          return null;
        }

        return new Testimonial({
          id: testimonial.id,
          text: testimonial.text,
          authorName: testimonial.authorName,
          authorInitials: testimonial.authorInitials,
          authorLocation: testimonial.authorLocation,
          rating: testimonial.rating,
          isPublished: testimonial.isPublished,
          companyId: testimonial.companyId,
          projectId: testimonial.projectId,
          companyName: testimonial.companyName,
          projectName: testimonial.projectName,
          orderIndex: index,
        });
      })
      .filter((testimonial): testimonial is Testimonial => testimonial !== null);

    mockTestimonials.splice(0, mockTestimonials.length, ...reordered);
  }

  async setVisibility(id: string, isPublished: boolean): Promise<Testimonial> {
    const index = mockTestimonials.findIndex((testimonial) => testimonial.id === id);

    if (index === -1) {
      throw new Error("No se encontró la reseña");
    }

    const current = mockTestimonials[index];
    const updated = new Testimonial({
      id: current.id,
      text: current.text,
      authorName: current.authorName,
      authorInitials: current.authorInitials,
      authorLocation: current.authorLocation,
      rating: current.rating,
      isPublished,
      companyId: current.companyId,
      projectId: current.projectId,
      companyName: current.companyName,
      projectName: current.projectName,
      orderIndex: current.orderIndex,
    });

    mockTestimonials[index] = updated;
    return updated;
  }

  async deleteMany(ids: string[]): Promise<void> {
    const targetIds = new Set(ids.map((id) => id.trim()).filter(Boolean));

    if (targetIds.size === 0) {
      return;
    }

    const remaining = mockTestimonials.filter((testimonial) => !targetIds.has(testimonial.id));

    const normalized = remaining.map((testimonial, index) => new Testimonial({
      id: testimonial.id,
      text: testimonial.text,
      authorName: testimonial.authorName,
      authorInitials: testimonial.authorInitials,
      authorLocation: testimonial.authorLocation,
      rating: testimonial.rating,
      isPublished: testimonial.isPublished,
      companyId: testimonial.companyId,
      projectId: testimonial.projectId,
      companyName: testimonial.companyName,
      projectName: testimonial.projectName,
      orderIndex: index,
    }));

    mockTestimonials.splice(0, mockTestimonials.length, ...normalized);
  }
}

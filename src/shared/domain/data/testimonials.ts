export interface Testimonial {
  id: string;
  text: string;
  authorName: string;
  authorInitials: string;
  authorLocation: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: "roberto-f",
    text: "Solicité una regularización TE1 para mi local comercial. El proceso fue transparente y rápido. Totalmente recomendados por su profesionalismo.",
    authorName: "Roberto Fernández",
    authorInitials: "RF",
    authorLocation: "Providencia",
    rating: 5,
  },
  {
    id: "camila-s",
    text: "Excelente servicio de emergencia. Tuvimos un corte total en la oficina un domingo y llegaron en menos de una hora. Nos salvaron la semana.",
    authorName: "Camila Soto",
    authorInitials: "CS",
    authorLocation: "Las Condes",
    rating: 5,
  },
  {
    id: "andres-v",
    text: "Hicieron toda la iluminación LED de mi departamento nuevo. Muy prolijos, limpios y respetuosos. El acabado final es de lujo.",
    authorName: "Andrés Valenzuela",
    authorInitials: "AV",
    authorLocation: "Vitacura",
    rating: 5,
  },
];

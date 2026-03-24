import type { Metadata } from "next";

import ReviewPublicFormClient from "@/contexts/testimonials/presentation/ReviewPublicFormClient";

export const metadata: Metadata = {
  title: "Reseña",
  description: "Formulario de reseña para proyectos de SYNOVA.",
};

export default async function ReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return <ReviewPublicFormClient token={String(token ?? "")} />;
}

import type { Metadata } from "next";

import { submitReviewByTokenAction } from "@/app/(public)/review/actions";
import { container } from "@/config/container";
import { PROJECT_IMAGE_PLACEHOLDER } from "@/contexts/projects/domain/project.entity";
import { getProjectGalleryDetails } from "@/contexts/projects/presentation/project-details";
import { GetProjectByIdUseCase } from "@/contexts/projects/use-cases/get-project-by-id.use-case";
import ReviewPublicFormClient from "@/contexts/testimonials/presentation/ReviewPublicFormClient";
import { GetReviewByTokenUseCase } from "@/contexts/testimonials/use-cases/get-review-by-token.use-case";

export const metadata: Metadata = {
  title: "Reseña",
  description: "Formulario de reseña para proyectos de SYNOVA.",
};

export default async function ReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; sent?: string; error?: string }>;
}) {
  const { token, sent, error } = await searchParams;
  const normalizedToken = String(token ?? "").trim();

  if (!normalizedToken) {
    return (
      <ReviewPublicFormClient
        token=""
        status="missing"
        projectName=""
        gallery={[PROJECT_IMAGE_PLACEHOLDER]}
        errorMessage=""
        submitAction={submitReviewByTokenAction}
      />
    );
  }

  const review = await container.get(GetReviewByTokenUseCase).execute(normalizedToken);

  if (!review) {
    return (
      <ReviewPublicFormClient
        token={normalizedToken}
        status="invalid"
        projectName=""
        gallery={[PROJECT_IMAGE_PLACEHOLDER]}
        errorMessage=""
        submitAction={submitReviewByTokenAction}
      />
    );
  }

  const project = review.projectId
    ? await container.get(GetProjectByIdUseCase).execute(review.projectId)
    : null;

  if (!project) {
    return (
      <ReviewPublicFormClient
        token={normalizedToken}
        status="invalid"
        projectName=""
        gallery={[PROJECT_IMAGE_PLACEHOLDER]}
        errorMessage=""
        submitAction={submitReviewByTokenAction}
      />
    );
  }

  const details = getProjectGalleryDetails(project);
  let status: "success" | "ready" | "inactive" = "inactive";

  if (sent === "1") {
    status = "success";
  } else if (review.tokenActive) {
    status = "ready";
  }

  const errorMessage = error ? decodeURIComponent(error) : "";

  return (
    <ReviewPublicFormClient
      token={normalizedToken}
      status={status}
      projectName={project.title}
      gallery={details.gallery.length > 0 ? details.gallery : [PROJECT_IMAGE_PLACEHOLDER]}
      errorMessage={errorMessage}
      submitAction={submitReviewByTokenAction}
    />
  );
}

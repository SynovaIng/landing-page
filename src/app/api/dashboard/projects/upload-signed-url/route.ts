import { NextResponse } from "next/server";
import { z } from "zod";

import { createServerAuthUseCases } from "@/contexts/auth/app/server-auth.factory";
import { createSignedProjectImageUpload } from "@/contexts/projects/infrastructure/upload-project-image";

const createSignedUploadSchema = z.object({
  fileName: z.string().trim().min(1),
  fileType: z.string().trim().optional(),
  projectId: z.string().trim().optional().nullable(),
});

const toErrorResponse = (
  status: number,
  error: string,
  code: string,
  detail?: string,
) => {
  return NextResponse.json(
    {
      error,
      code,
      detail,
    },
    { status },
  );
};

export async function POST(request: Request) {
  const { checkUserAuthenticatedUseCase } = createServerAuthUseCases();
  const isAuthenticated = await checkUserAuthenticatedUseCase.execute();

  if (!isAuthenticated) {
    return toErrorResponse(401, "No autenticado", "UNAUTHENTICATED");
  }

  const body = await request.json().catch(() => null);
  const parsed = createSignedUploadSchema.safeParse(body);

  if (!parsed.success) {
    return toErrorResponse(400, "Payload inválido", "INVALID_SIGNED_UPLOAD_PAYLOAD");
  }

  const normalizedFileType = String(parsed.data.fileType ?? "").trim().toLowerCase();

  if (normalizedFileType && !normalizedFileType.startsWith("image/")) {
    return toErrorResponse(400, "Solo se permiten archivos de imagen", "UNSUPPORTED_FILE_TYPE");
  }

  try {
    const signedUpload = await createSignedProjectImageUpload(
      parsed.data.fileName,
      parsed.data.projectId ?? undefined,
    );

    return NextResponse.json(signedUpload);
  } catch (error) {
    return toErrorResponse(
      500,
      "No se pudo preparar la carga de la imagen",
      "SIGNED_UPLOAD_PREPARATION_FAILED",
      error instanceof Error ? error.message : "Error desconocido",
    );
  }
}

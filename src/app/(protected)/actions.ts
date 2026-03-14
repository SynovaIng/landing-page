"use server";

import { redirect } from "next/navigation";

import { createServerAuthUseCases } from "@/contexts/auth/app/server-auth.factory";

const toLoginWithError = (message: string) => {
	const encodedMessage = encodeURIComponent(message);
	redirect(`/login?error=${encodedMessage}`);
};

export const loginAction = async (formData: FormData): Promise<void> => {
	const email = String(formData.get("email") ?? "").trim();
	const password = String(formData.get("password") ?? "");

	const { loginUseCase } = await createServerAuthUseCases();

	try {
		await loginUseCase.execute(email, password);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Invalid credentials";
		toLoginWithError(message);
	}

	redirect("/dashboard");
};

export const logoutAction = async (): Promise<void> => {
	const { logoutUseCase } = await createServerAuthUseCases();
	await logoutUseCase.execute();
	redirect("/login");
};

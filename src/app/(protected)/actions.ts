"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

const toLoginWithError = (message: string) => {
	const encodedMessage = encodeURIComponent(message);
	redirect(`/login?error=${encodedMessage}`);
};

export const loginAction = async (formData: FormData): Promise<void> => {
	const email = String(formData.get("email") ?? "").trim();
	const password = String(formData.get("password") ?? "");

	if (!email || !password) {
		toLoginWithError("Email and password are required");
	}

	const supabase = await createSupabaseServerClient();

	const { error: loginError } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (loginError) {
		toLoginWithError("Invalid credentials");
	}

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError || !user) {
		await supabase.auth.signOut();
		toLoginWithError("Unable to validate session");
	}

	redirect("/dashboard");
};

export const logoutAction = async (): Promise<void> => {
	const supabase = await createSupabaseServerClient();
	await supabase.auth.signOut();
	redirect("/login");
};

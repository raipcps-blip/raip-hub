"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerSupabaseClient } from "@/server/supabase/server";

const passwordSchema = z
  .object({
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas precisam ser iguais.",
    path: ["passwordConfirmation"],
  });

export type PasswordState = {
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function definePassword(
  _state: PasswordState,
  formData: FormData,
): Promise<PasswordState> {
  const result = passwordSchema.safeParse({
    password: formData.get("password"),
    passwordConfirmation: formData.get("passwordConfirmation"),
  });

  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error: sessionError } = await supabase.auth.getUser();

  if (sessionError || !data.user) {
    return { message: "O convite expirou ou já foi utilizado. Solicite um novo convite." };
  }

  const { error } = await supabase.auth.updateUser({ password: result.data.password });

  if (error) {
    return { message: "Não foi possível definir a senha. Tente novamente." };
  }

  redirect("/dashboard");
}

import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().min(1, "Required"),
  password: z.string().trim().min(1, "Required"),
});

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(6)
      .regex(/^\S*$/, "Password must not contain whitespace"),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Password does not match!",
      });
    }
  });

export const signUpSchema = z
  .object({
    email: z.string().email(),
  })
  .and(passwordSchema);

export type SignIn = z.infer<typeof signInSchema>;
export type SignUp = z.infer<typeof signUpSchema>;

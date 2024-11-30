import * as z from "zod";

const minCharacters = 12;

export const PasswordEmailSignUpSchema = z.object({
  publicKey: z.string({ required_error: "Public key required" }),
  email: z.string({ required_error: "Email is required" }).email(),
  password: z
    .string({ required_error: "Password required" })
    // minimum number of characters
    .min(
      minCharacters,
      `Password must be atleast ${minCharacters} characters long`,
    )
    // check for atleast 1 number
    .refine(
      (password) => /.*\d.*/.test(password),
      "Password must have atleast 1 number",
    )
    // contains atleast 1 uppercase characters
    .refine(
      (password) => /[A-Z]/.test(password),
      "Password must have atleast 1 upper case character",
    )
    // contains atleast 1 smaller case character
    .refine(
      (password) => /[a-z]/.test(password),
      "Password must have atleast 1 smaller case character",
    )
    // contain special characters
    .refine(
      (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password),
      "Password must have atleast 1 special character - !@#$%^&*()_+-=[]{};':\"\\|,.<>/?",
    ),

  username: z.string().optional(),
  name: z.string().optional(),
  surname: z.string().optional(),
});

export type PasswordEmailSignUpSchemaType = z.infer<
  typeof PasswordEmailSignUpSchema
>;

export const ConfirmedPasswordEmailSignUpSchema = PasswordEmailSignUpSchema.and(
  z.object({
    termsAndConditions: z.literal(true, {
      required_error: "Accept terms and conditions to proceed",
    }),
    confirmPassword: z.string(),
  }),
).refine(({ password, confirmPassword }) => password === confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
});

export type ConfirmedPasswordEmailSignUpSchemaType = z.infer<
  typeof ConfirmedPasswordEmailSignUpSchema
>;

import { TypeOf, z } from "zod";

export const schema = z
  .object({
    name: z.string().min(2, { message: "Name should have at least 2 letters" }),
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(4),
    passwordConfirm: z.string().min(4),
  })
  .superRefine(({ passwordConfirm, password }, ctx) => {
    if (passwordConfirm !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
      });
    }
  });

export type RegisterInput = TypeOf<typeof schema>;

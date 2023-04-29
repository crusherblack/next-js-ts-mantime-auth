import { TypeOf, z } from "zod";

export const schema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(4),
});

export type LoginInput = TypeOf<typeof schema>;

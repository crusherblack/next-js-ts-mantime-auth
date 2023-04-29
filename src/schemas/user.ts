import { TypeOf, z } from "zod";

export const schema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email({ message: "Invalid email" }),
  role: z.string().nullable(),
});

export type UserType = TypeOf<typeof schema>;

import { TypeOf, z } from "zod";

export const schema = z.object({
  id: z.string(),
  type: z.string(),
  url: z.string(),
  created_at: z.string(),
  company: z.string(),
  company_url: z.string(),
  location: z.string(),
  title: z.string(),
  description: z.string(),
  how_to_apply: z.string(),
  company_logo: z.string(),
});

export type PositionType = TypeOf<typeof schema>;

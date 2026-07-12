import type { RegisterSchemaOutput } from "~/schema/auth";

export type UserProfile = Omit<
  RegisterSchemaOutput,
  "password" | "confirmPassword"
>;

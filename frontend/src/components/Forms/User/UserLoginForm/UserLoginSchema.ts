import { z } from "zod";

const userLoginSchema = z.object({
  phoneNumber: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default userLoginSchema;

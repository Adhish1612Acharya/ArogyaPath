import { z } from "zod";

const userLoginSchema = z.object({
  phoneNumber: z.string().min(10, "Invalid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default userLoginSchema;

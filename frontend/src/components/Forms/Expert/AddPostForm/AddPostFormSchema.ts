// schemas/postCreationSchema.ts
import { z } from "zod";

const addPostFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  media: z.object({
    images: z
      .array(z.instanceof(File))
      .max(3, "You can only upload up to 3 images")
      .optional(),
    video: z.instanceof(File).optional(),
    document: z.instanceof(File).optional(),
  }),
});

export default addPostFormSchema;

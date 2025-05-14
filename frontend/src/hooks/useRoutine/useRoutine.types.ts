import { Routine } from "@/types";

export interface RoutineSchema {
  title: string;
  description: string;
  thumbnail: File | null;
  routines: Routine[];
}

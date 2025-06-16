import fs from "fs/promises";
import path from "path";

const TEMP_DIR = path.join(
  process.cwd(),
  "uploads",
  "temp",
  "expert-documents"
);
const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Cleans up temporary files older than MAX_AGE
 * Should be run periodically (e.g., daily) using a cron job
 */
export async function cleanupTempFiles() {
  try {
    const files = await fs.readdir(TEMP_DIR);
    const now = Date.now();

    for (const file of files) {
      const filePath = path.join(TEMP_DIR, file);
      const stats = await fs.stat(filePath);

      // If file is older than MAX_AGE, delete it
      if (now - stats.mtime.getTime() > MAX_AGE) {
        try {
          await fs.unlink(filePath);
          console.log(`Cleaned up old temporary file: ${file}`);
        } catch (error) {
          console.error(`Error deleting temporary file ${file}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("Error cleaning up temporary files:", error);
  }
}

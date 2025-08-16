// prisma.config.ts
import "dotenv/config";                  // ⬅️ penting: agar .env ikut ter-load oleh CLI
import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  // Lokasi schema kamu (ubah kalau beda)
  schema: path.join("prisma", "schema.prisma"),

  // Atur seed command di sini (ganti ke "tsx prisma/seed.ts" kalau kamu pakai tsx)
  migrations: {
    seed: "bun run prisma/seed.ts",
    // path: path.join("prisma", "migrations"), // optional kalau kamu mindah folder migrations
  },
});

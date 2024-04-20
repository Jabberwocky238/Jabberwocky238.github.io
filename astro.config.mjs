import { defineConfig } from 'astro/config';
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: 'https://Jabberwocky238.github.io',
  // base: 'main',
  integrations: [react()]
} // output: "server",
);
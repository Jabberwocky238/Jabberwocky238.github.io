import { defineConfig } from 'astro/config';
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: 'https://Jabberwocky238.github.io',
  // base: 'main',
  output: "hybrid",
  integrations: [react()],
  vite: {
    resolve: {
      alias: {
        '@': '/src/' // 将 '@' 别名指向 '/src/components' 目录
      }
    }
  }
}
);
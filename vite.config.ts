import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
			"@components": path.resolve(__dirname, "src/components"),
			"@config": path.resolve(__dirname, "src/config"),
			"@hooks": path.resolve(__dirname, "src/hooks"),
			"@i18n": path.resolve(__dirname, "src/i18n"),
			"@pages": path.resolve(__dirname, "src/pages"),
			"@routes": path.resolve(__dirname, "src/routes"),
			"@types": path.resolve(__dirname, "src/types"),
		},
	},
	server: {
		port: 3000,
	},
});

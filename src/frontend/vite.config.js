
import { URL, fileURLToPath } from "url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno basadas en el mode
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    build: {
      emptyOutDir: true,
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: "globalThis",
        },
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "http://127.0.0.1:4943",
          changeOrigin: true,
        },
      },
    },
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: [
        {
          find: "declarations",
          replacement: fileURLToPath(new URL("../declarations", import.meta.url)),
        },
      ],
      dedupe: ["@dfinity/agent"],
    },
    // Definir explícitamente las variables que queremos exponer
    define: {
      // Variables DFX generadas automáticamente
      'process.env.CANISTER_ID_TAONGA': JSON.stringify(env.CANISTER_ID_TAONGA),
      'process.env.CANISTER_ID_MOTOKODAO': JSON.stringify(env.CANISTER_ID_MOTOKODAO),
      'process.env.CANISTER_ID_MOTOKODAODEV': JSON.stringify(env.CANISTER_ID_MOTOKODAODEV),
      'process.env.CANISTER_ID_FRONTEND': JSON.stringify(env.CANISTER_ID_FRONTEND),
      'process.env.CANISTER_ID_FRONTEND_DEV': JSON.stringify(env.CANISTER_ID_FRONTEND_DEV),
      'process.env.DFX_NETWORK': JSON.stringify(env.DFX_NETWORK),
      
      
      // Variables custom para tu env.js (con import.meta.env)
      // 'import.meta.env.CANISTER_ID': env.CANISTER_ID=='m33pu-aiaaa-aaaap-qqdoq-cai' ? 
      //   JSON.stringify(env.CANISTER_ID_MOTOKODAODEV):
      //   JSON.stringify(env.CANISTER_ID_MOTOKODAO),
      // 'import.meta.env.CANISTER_ID': JSON.stringify(env),
      'import.meta.env.CANISTER_ID_MOTOKODAO': JSON.stringify(env.CANISTER_ID_MOTOKODAO),
      'import.meta.env.CANISTER_ID_MOTOKODAODEV': JSON.stringify(env.CANISTER_ID_MOTOKODAODEV),
      'import.meta.env.DFX_NETWORK': JSON.stringify(env.DFX_NETWORK),
      'import.meta.env.AUTHORITY_SEED': JSON.stringify(env.AUTHORITY_SEED),
      'import.meta.env.VITE_DEPLOY_DEV': env.VITE_DEPLOY_DEV,
    }
  };
});
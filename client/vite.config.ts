import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Try to load existing certificates or generate self-signed
function getHttpsConfig() {
  const certDir = path.join(process.cwd(), '.certs');
  const keyPath = path.join(certDir, 'key.pem');
  const certPath = path.join(certDir, 'cert.pem');
  
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    return {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
  }
  
  // Return true to let Vite generate self-signed certs
  return true;
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    https: getHttpsConfig(),
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});


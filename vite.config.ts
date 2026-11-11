import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/** 正式建置時移除 index.html 中只供原始碼目錄使用的轉址片段 */
const stripDevOnly = (): Plugin => ({
  name: 'strip-dev-only',
  apply: 'build',
  transformIndexHtml: (html) => html.replace(/\s*<!-- dev-only:start -->[\s\S]*?<!-- dev-only:end -->/, ''),
});

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), stripDevOnly()],
});

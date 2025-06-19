import esbuild from 'esbuild';
import { solidPlugin } from 'esbuild-plugin-solid';

const isWatch = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: ['src/index.jsx'],
  bundle: true,
  minify: !isWatch,
  sourcemap: isWatch,
  outfile: 'public/bundle.js',
  plugins: [solidPlugin()],
  loader: {
    '.svg': 'text',
  },
  define: {
    'process.env.NODE_ENV': isWatch ? '"development"' : '"production"',
  },
};

if (isWatch) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  
  // Simple dev server
  await ctx.serve({
    servedir: 'public',
    port: 3000,
  });
  
  console.log('Server running at http://localhost:3000');
} else {
  await esbuild.build(buildOptions);
  console.log('Build complete!');
}
import { writeGeneratedFile } from '../src/index';

async function main(): Promise<void> {
  const path = await writeGeneratedFile({
    content: '<html><body><h1>Weekly newsletter</h1></body></html>',
    prefix: 'newsletter',
    dir: 'generated',
  });
  console.log(`wrote ${path}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

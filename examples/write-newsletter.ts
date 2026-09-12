import { generateFileName, writeHTML } from 'markup-generator';

async function main(): Promise<void> {
  const content = '<html><body><h1>Weekly newsletter</h1></body></html>';
  const fileName = generateFileName('newsletter');
  await writeHTML(fileName, content, 'generated');
  console.log(`wrote generated/${fileName}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

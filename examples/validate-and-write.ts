/**
 * Example: validate template data, then write.
 *
 * Run: pnpm exec tsx examples/validate-and-write.ts
 */
import { validateTemplateData, hasErrors, writeGeneratedFile } from '../src/index';

const data = { title: 'Hello', preview: 'World' };
const results = validateTemplateData(data);

if (hasErrors(results)) {
  process.stderr.write(JSON.stringify(results, null, 2) + '\n');
  process.exit(1);
}

const html = `<h1>${data.title}</h1><p>${data.preview}</p>`;
const path = await writeGeneratedFile({
  content: html,
  fileName: 'example.html',
  dir: 'generated',
});
process.stdout.write(path + '\n');

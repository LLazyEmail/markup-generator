import { resolve } from 'node:path';
import { parseArgv } from '@llazyemail/cli';
import { loadData, loadContent } from '@llazyemail/read';
import type { TemplateData } from '@llazyemail/read';
import { writeGeneratedFile } from '@llazyemail/write';

export type { TemplateData } from '@llazyemail/read';

export type RenderTemplate = (
  templateId: string,
  input: { string: string; data: TemplateData }
) => string;

export type GenerateTemplateOptions = {
  render: RenderTemplate;
  argv?: string[];
  cwd?: string;
  defaultTemplateId?: string;
  defaultDataPath?: string;
};

function asAbsolute(cwd: string, value: string): string {
  return resolve(cwd, value);
}

function ensureString(value: unknown, flagName: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${flagName} must be a non-empty string`);
  }
  return value.trim();
}

export { loadData, loadContent } from '@llazyemail/read';

export function buildFallbackContent(data: TemplateData): string {
  const title = data?.title || '[Generated Template]';
  const preview = data?.preview || '';

  return `
<table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
  <tbody>
    <tr>
      <td style="padding: 12px 18px; text-align: center;">
        <h1 style="margin: 0 0 8px 0;">${title}</h1>
        <p style="margin: 0;">${preview}</p>
      </td>
    </tr>
  </tbody>
</table>
`.trim();
}

export async function generateTemplate(
  options: GenerateTemplateOptions
): Promise<string> {
  const cwd = options.cwd || process.cwd();
  const argv = options.argv || process.argv;
  const args = parseArgv(argv);

  const templateId = ensureString(
    (args.template as string) || options.defaultTemplateId || 'hn',
    '--template'
  );
  const dataPath = args.data
    ? asAbsolute(cwd, String(args.data))
    : asAbsolute(cwd, options.defaultDataPath || 'content/content2.js');
  const outPath = ensureString(
    (args.out as string) || `generated/${templateId}.html`,
    '--out'
  );

  const data = await loadData(dataPath);
  const content =
    loadContent(typeof args.content === 'string' ? args.content : undefined, cwd) ||
    buildFallbackContent(data);

  const html = options.render(templateId, {
    string: content,
    data,
  });

  return writeGeneratedFile({
    content: html,
    fileName: outPath.includes('/') ? (outPath.split(/[\\/]/).pop() as string) : outPath,
    dir: outPath.includes('/') ? resolve(cwd, outPath, '..') : resolve(cwd, 'generated'),
  });
}

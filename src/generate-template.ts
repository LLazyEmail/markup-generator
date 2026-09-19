import { readFileSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readJson } from './json-io';
import { writeGeneratedFile } from './write';
import { importEsm } from './read';

export type CliArgs = Record<string, string | true>;

export type TemplateData = {
  title?: string;
  preview?: string;
  [key: string]: unknown;
};

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

export function parseArgv(argv: string[]): CliArgs {
  const args: CliArgs = {};
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;

    const [rawKey, inlineValue] = token.slice(2).split('=');
    if (inlineValue !== undefined) {
      args[rawKey] = inlineValue;
      continue;
    }

    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      args[rawKey] = next;
      i += 1;
    } else {
      args[rawKey] = true;
    }
  }
  return args;
}

function asAbsolute(cwd: string, value: string): string {
  return resolve(cwd, value);
}

function ensureString(value: unknown, flagName: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${flagName} must be a non-empty string`);
  }
  return value.trim();
}

export async function loadData(dataPath: string): Promise<TemplateData> {
  const ext = extname(dataPath).toLowerCase();
  if (ext === '.json') {
    return readJson<TemplateData>(dataPath);
  }

  const mod = (await importEsm(pathToFileURL(dataPath).href)) as {
    default?: TemplateData;
  } & TemplateData;
  return (mod.default ?? mod) as TemplateData;
}

export function loadContent(contentPath?: string, cwd = process.cwd()): string | null {
  if (!contentPath) return null;
  return readFileSync(asAbsolute(cwd, contentPath), 'utf8');
}

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

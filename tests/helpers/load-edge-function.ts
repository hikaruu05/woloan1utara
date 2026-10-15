import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

// Execute the checked-in handler; only the Deno host and SDK transport are adapted.
export async function loadFunction(name: string, createClient: unknown) {
  let handler!: (request: Request) => Promise<Response>;
  const source = (await readFile(new URL(`../../supabase/functions/${name}/index.ts`, import.meta.url), 'utf8')).replace(/^import .*?;\n/, '');
  const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None } }).outputText;
  runInNewContext(code, { createClient, Response, TextEncoder, console, Deno: {
    env: { get: (name: string) => name === 'SUPABASE_URL' ? 'https://example.test' : 'test-key' },
    serve: (callback: typeof handler) => { handler = callback; },
  } });
  return handler;
}

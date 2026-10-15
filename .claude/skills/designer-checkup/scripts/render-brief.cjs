#!/usr/bin/env node
// Temporary reading copy only. Never changes the scientific Markdown source.
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const css = `
:root{color-scheme:light;--ink:#243247;--muted:#64748b;--line:#e2e8f0}
*{box-sizing:border-box}body{margin:0;background:#f1f5f9;color:var(--ink);font-size:16px;line-height:2;direction:rtl;text-align:right}
main{max-width:1320px;margin:36px auto;padding:44px 48px 64px;background:#fff;border:1px solid var(--line);border-radius:16px;box-shadow:0 8px 32px #0f172a08}
h1{font-size:30px;line-height:1.6;color:#07566f;margin:0 0 24px;border-bottom:3px solid #d9edf3;padding-bottom:20px}h2{font-size:22px;line-height:1.8;color:#07566f;margin:40px 0 16px}p{margin:14px 0}strong{font-weight:700}
blockquote{margin:20px 0;padding:12px 20px;background:#f8fafc;border-right:4px solid #76adbf;border-radius:8px;color:var(--muted)}blockquote p{margin:0}
.table-scroll{overflow-x:auto;margin:20px 0;border:1px solid var(--line);border-radius:10px}table{border-collapse:collapse;width:100%;font-size:15px;line-height:1.95}
th,td{text-align:right;vertical-align:top;padding:12px 16px;border-bottom:1px solid var(--line);border-left:1px solid var(--line);min-width:80px}th{background:#eaf4f8;color:#164e63;font-weight:700;white-space:nowrap}tr:nth-child(even) td{background:#fafcfe}tr:last-child td{border-bottom:0}th:last-child,td:last-child{border-left:0}td:first-child{font-weight:500}
code{direction:ltr;unicode-bidi:isolate;display:inline-block;font-family:ui-monospace,monospace;font-feature-settings:normal;font-size:.86em;background:#edf2f7;padding:0 5px;border-radius:4px;max-width:100%;overflow-wrap:anywhere}pre{direction:ltr;text-align:left;overflow:auto}a{color:#007ba4}li{padding-right:4px}
.source{color:var(--muted);font-size:13px;margin-bottom:24px;overflow-wrap:anywhere}.source span{direction:ltr;unicode-bidi:isolate;display:inline-block}
@media(max-width:800px){main{margin:12px;padding:24px 18px;border-radius:12px}body{font-size:15px}h1{font-size:25px}h2{font-size:20px}th,td{padding:10px;min-width:110px}}
@media print{body{background:#fff;font-size:12px}main{max-width:none;margin:0;padding:0;border:0;box-shadow:none}h2{break-after:avoid}.table-scroll{overflow:visible}table{font-size:11px}th,td{padding:7px}tr{break-inside:avoid}}
`;

function within(parent, child) {
  const rel = path.relative(parent, child);
  return rel !== '' && rel !== '..' && !rel.startsWith(`..${path.sep}`) && !path.isAbsolute(rel);
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

async function main() {
  const [sourceArg, outputArg, ...flags] = process.argv.slice(2);
  const options = {};
  for (let i = 0; i < flags.length; i += 2) {
    if (!['--root', '--marked'].includes(flags[i]) || !flags[i + 1]) throw new Error('Expected --root <project> and optional --marked <module-path>.');
    options[flags[i].slice(2)] = flags[i + 1];
  }
  if (!sourceArg || !outputArg || !options.root) throw new Error('Usage: node render-brief.cjs <brief.md> <output.html> --root <project-root> [--marked <module-path>]');
  const root = fs.realpathSync(options.root);
  const source = fs.realpathSync(sourceArg);
  const output = path.resolve(outputArg);
  if (path.extname(source).toLowerCase() !== '.md' || path.extname(output).toLowerCase() !== '.html') throw new Error('Expected Markdown input and HTML output.');
  const temp = path.join(root, 'temp');
  if (!within(temp, output)) throw new Error('Reading copies must be generated under the project temp directory.');
  // Resolve existing ancestors before creating directories: reject symlink escapes.
  let ancestor = path.dirname(output);
  while (!fs.existsSync(ancestor)) ancestor = path.dirname(ancestor);
  const actualParent = path.resolve(fs.realpathSync(ancestor), path.relative(ancestor, path.dirname(output)));
  if (!within(root, actualParent) || (fs.existsSync(temp) && !within(fs.realpathSync(temp), path.join(actualParent, path.basename(output))))) throw new Error('Output path escapes project temp through a symlink.');
  if (fs.lstatSync(output, {throwIfNoEntry:false})?.isSymbolicLink()) throw new Error('Refusing to overwrite an output symlink.');

  let modulePath = options.marked;
  if (!modulePath) {
    try { modulePath = require.resolve('marked'); }
    catch { throw new Error('Locate marked in workspace dependencies, then pass --marked <module-path>. Do not install a project dependency.'); }
  }
  const {marked} = await import(pathToFileURL(path.resolve(modulePath)).href);
  const markdown = fs.readFileSync(source, 'utf8');
  const fonts = fs.readFileSync(path.join(root, 'views/profiles/fonts.css'), 'utf8');
  if (!fonts.includes('base64,') || !fonts.includes('Variable-Dana')) throw new Error('Expected the project embedded Dana font stylesheet.');
  const title = escapeHtml((markdown.match(/^#\s+(.+)$/m) || [null, path.basename(source)])[1]);
  const body = marked.parse(markdown, {gfm:true}).replace(/<table>/g, '<div class="table-scroll"><table>').replace(/<\/table>/g, '</table></div>');
  const html = `<!doctype html>
<html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>${fonts}\n${css}</style></head>
<body><main><div class="source">نسخهٔ خواندن با فونت Dana · منبع: <span>${escapeHtml(path.basename(source))}</span></div>${body}</main></body></html>`;
  fs.mkdirSync(path.dirname(output), {recursive:true});
  fs.writeFileSync(output, html);
  console.log(output);
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });

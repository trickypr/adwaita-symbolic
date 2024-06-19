// @ts-check

/**
 * @fileoverview Generates gecko compatible css & svg icons
 *
 */

import { readdir, rm, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const symbolic = readdir("./symbolic");
const files = await symbolic.then(async (dirs) => {
  const files = [...dirs].map(async (dir) => {
    const path = `./symbolic/${dir}/`;
    return [...(await readdir(path))].map((d) => path + d);
  });

  const f = await Promise.all(files);
  return f.flat();
});

const css =
  ".icon-sm { display: inline-block; width: 1rem; height: 1rem; -moz-context-properties: fill, fill-opacity; }\n" +
  files
    .map((file) => {
      const c = `.${file.replace(".svg", "").replace("./", "").replaceAll("/", "__")}`;
      return `${c} { background-image: url('${file.replace("symbolic/", "")}') }`;
    })
    .join("\n");

await rm("./gecko", { recursive: true, force: true });
await mkdir("./gecko");

await writeFile("./gecko/gecko.css", css);

await Promise.all(
  files.map(async (file) => {
    const contents = await readFile(file, "utf-8");
    const target = file.replace("symbolic/", "gecko/");
    await mkdir(dirname(target), { recursive: true });
    await writeFile(
      target,
      contents.replace(/fill="#\w{6}"/gm, 'fill="context-fill"'),
    );
  }),
);

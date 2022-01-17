// # deno run --allow-read ./type_checker/checker.ts > ./type_checker/vars.ts

import deployGlobal from "./deploy.json" assert { type: "json" };
import { denoGlobal } from "./deno.ts";

const denoGlobalSet = new Set(denoGlobal);
const deployGlobalSet = new Set(deployGlobal);

const denoVarsFile = new URL("./vars/deno.ts", import.meta.url);

await Deno.writeTextFile(
  denoVarsFile,
  'import type {} from "../../dts/deno.window.d.ts";\n',
);
for (const deno of denoGlobalSet) {
  if (!deployGlobalSet.has(deno)) {
    await Deno.writeTextFile(denoVarsFile, `${deno}\n`, { append: true });
  }
}

const depoyVarsFile = new URL("./vars/deploy.ts", import.meta.url);
await Deno.writeTextFile(
  depoyVarsFile,
  'import type {} from "../../dts/deno.window.d.ts";\n',
);
const same = new Set<string>();
for (const deno of deployGlobalSet) {
  if (!denoGlobalSet.has(deno)) {
    await Deno.writeTextFile(
      depoyVarsFile,
      `${deno.replace(/^globalThis./, "")}\n`,
      {
        append: true,
      },
    );
  } else {
    same.add(deno);
  }
}

const sameVarsFile = new URL("./vars/common.ts", import.meta.url);
await Deno.writeTextFile(
  sameVarsFile,
  'import type {} from "../../dts/deno.window.d.ts";\n',
);
for (const d of same) {
  await Deno.writeTextFile(sameVarsFile, `${d.replace(/^globalThis./, "")}\n`, {
    append: true,
  });
}

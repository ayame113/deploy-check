import { serve } from "https://deno.land/std@0.121.0/http/server.ts";

const denoGlobal = [...inspect(globalThis, "globalThis", new Set())].sort().map(
  (l) => {
    if (l === "globalThis.RegExp.$'") {
      return `globalThis.RegExp["$'"]`;
    } else if (l === "globalThis.RegExp.$`") {
      return 'globalThis.RegExp["$`"]';
    } else if (l === "globalThis.RegExp.$+") {
      return 'globalThis.RegExp["$+"]';
    } else if (l === "globalThis.Deno.SeekMode.0") {
      return "globalThis.Deno.SeekMode[0]";
    } else if (l === "globalThis.Deno.SeekMode.1") {
      return "globalThis.Deno.SeekMode[1]";
    } else if (l === "globalThis.Deno.SeekMode.2") {
      return "globalThis.Deno.SeekMode[2]";
    } else {
      return l;
    }
  },
);

serve(() => new Response(JSON.stringify(denoGlobal, null, 2)));

function inspect(obj: any, path: string, res: Set<string>) {
  for (const key of Object.getOwnPropertyNames(obj).sort()) {
    const keyPath = path ? `${path}.${key}` : key;
    if (keyPath === "globalThis.window") {
      continue;
    }
    if (keyPath === "globalThis.self") {
      continue;
    }
    if (keyPath === "globalThis.globalThis") {
      continue;
    }
    if (typeof obj[key] === "object" && obj[key]) {
      inspect(obj[key], keyPath, res);
      getPrototypeKey(obj[key], keyPath, res);
    } else {
      res.add(keyPath);
      if (typeof obj[key] === "function") {
        Object.getOwnPropertyNames(obj[key]).filter((v) =>
          !["length", "name", "prototype", "arguments", "caller"].includes(v)
        ).forEach((v) => res.add(`${keyPath}.${v}`));

        try {
          const { prototype } = obj[key];
          if (prototype) {
            const name = prototype.constructor.name || `[[${keyPath}]]`;
            Object.getOwnPropertyNames(prototype)
              .filter((v) => v !== "constructor")
              .forEach((v) => res.add(`${path}.${name}.prototype.${v}`));
            getPrototypeKey(prototype, `${keyPath}.prototype`, res);
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
  return res;
}

function getPrototypeKey(obj: any, path: string, res: Set<string>) {
  if (obj === null || typeof obj !== "object") {
    return res;
  }
  const prototype = Object.getPrototypeOf(obj);
  if (prototype === null || typeof prototype !== "object") {
    return res;
  }
  if (prototype.constructor === Object) {
    return res;
  }
  if (prototype.constructor === Array) {
    return res;
  }
  Object.getOwnPropertyNames(prototype).forEach((v) => res.add(`${path}.${v}`));
  getPrototypeKey(prototype, path, res);
  return res;
}

# deploy-type-checker

A tool for type checking deno deploy. Provides an alternative after the
`deployctl check` becomes unavailable. Please note that this tool may be out of
date as deno deploy is currently in beta.

```ts
// your_code.ts
Deno.stdout;
```

```
deno run --allow-read --allow-run https://deno.land/x/deploy_type_checker@v0.0.4/type_check.ts ./your_code.ts
```

```
error: TS2339 [ERROR]: Property 'stdout' does not exist on type 'typeof Deno'.
Deno.stdout;
     ~~~~~~
    at file:///C:/Users/azusa/work/deno/deploy-check/code.ts:1:6
```

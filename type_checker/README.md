# developping

1. Access <url> and save the output to deploy.json
2. Execute
   `deno run --allow-read ./type_checker/checker.ts > ./type_checker/vars.ts` to
   output a list of global variables under ./ver/.
3. Edit the ./dts / file until the type error disappears in deploy.ts and
   common.ts and the type error occurs in deno.ts.

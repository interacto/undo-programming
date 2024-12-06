import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

// import 'codemirror/mode/clike/clike';
// import 'codemirror/mode/javascript/javascript';

import * as hyper from './assets/hyperast/hyperast_wasm';

hyper.greet('bar');


// import('./assets/foo')
//   .then(res => {
//     res.greet('yo');
//   });


// WebAssembly.instantiateStreaming(fetch("assets/foo_bg.wasm"), {})
//   .then(
//     (results) => {
//       console.log("res wasm: ", results);
//     },
//   )
//   .catch(err => {
//     console.error("err logind wasm", err);
//   });

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

  // const filename = "assets/hyper_app_bg.wasm";
  // const imports = { };
  // const wasmCode = await readFile(filename);
  // const wasmModule = new WebAssembly.Module(wasmCode);
  // const wasmInstance = new WebAssembly.Instance(wasmModule, imports);

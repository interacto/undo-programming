import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

// import 'codemirror/mode/clike/clike';
// import 'codemirror/mode/javascript/javascript';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

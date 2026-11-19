import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { version, versionDateString } from './shared/version';
import { BASE_PATH } from './swagger';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: BASE_PATH, useValue: environment.apiRoot },
  ]
};

console.log(`Based on Angular22 Template v${version} [${versionDateString}]`);

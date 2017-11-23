import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';

if (environment.production) {
	enableProdMode();
}

window['CESIUM_BASE_URL'] = '/assets/scripts/cesium';

platformBrowserDynamic().bootstrapModule(AppModule);

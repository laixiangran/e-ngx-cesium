import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ENgxCesiumModule } from '../../src/e-ngx-cesium.module';

@NgModule({
	imports: [
		BrowserModule,
		ENgxCesiumModule
	],
	declarations: [
		AppComponent
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}

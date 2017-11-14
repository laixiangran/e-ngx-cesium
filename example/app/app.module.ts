import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgxCesiumModule } from '../../src/ngx-cesium.module';

@NgModule({
	imports: [
		BrowserModule,
		NgxCesiumModule
	],
	declarations: [
		AppComponent
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}

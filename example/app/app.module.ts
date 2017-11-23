import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ENgxCesiumModule } from '../../src/e-ngx-cesium.module';
import { FormsModule } from '@angular/forms';

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		ENgxCesiumModule
	],
	declarations: [
		AppComponent
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}

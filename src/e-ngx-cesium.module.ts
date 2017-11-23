import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ENgxCesiumComponent } from './e-ngx-cesium.component';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [ENgxCesiumComponent],
	exports: [CommonModule, ENgxCesiumComponent]
})
export class ENgxCesiumModule {
}

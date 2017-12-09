import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ENgxCesiumComponent } from './e-ngx-cesium.component';
import { FormsModule } from '@angular/forms';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
	],
	declarations: [ENgxCesiumComponent],
	exports: [CommonModule, ENgxCesiumComponent]
})
export class ENgxCesiumModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxCesiumComponent } from './ngx-cesium.component';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [NgxCesiumComponent],
	exports: [CommonModule, NgxCesiumComponent]
})
export class NgxCesiumModule {
}

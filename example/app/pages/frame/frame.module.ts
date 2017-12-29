import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FrameRoutingModule } from './frame.routes';
import { FrameComponent } from './frame.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		FrameRoutingModule
	],
	declarations: [
		FrameComponent
	]
})
export class FrameModule {
}

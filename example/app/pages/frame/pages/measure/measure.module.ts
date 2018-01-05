import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ENgxCesiumModule } from '../../../../../../src';
import { ButtonModule, DropdownModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { MeasureComponent } from './measure.component';
import { MeasurementComponent } from './pages/measurement/measurement.component';
import { MeasureRoutingModule } from './measure.routes';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		MeasureRoutingModule,
		ENgxCesiumModule,
		DropdownModule,
		ButtonModule
	],
	declarations: [
		MeasureComponent,
		MeasurementComponent
	]
})
export class MeasureModule {}

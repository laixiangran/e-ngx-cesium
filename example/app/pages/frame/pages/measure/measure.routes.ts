import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeasureComponent } from './measure.component';
import { MeasurementComponent } from './pages/measurement/measurement.component';

const MeasureRoutes: Routes = [
	{
		path: '',
		component: MeasureComponent,
		children: [
			{
				path: 'measurement',
				component: MeasurementComponent
			},
			{
				path: '',
				redirectTo: 'measurement',
				pathMatch: 'full'
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(MeasureRoutes)
	],
	exports: [
		RouterModule
	]
})
export class MeasureRoutingModule {
}

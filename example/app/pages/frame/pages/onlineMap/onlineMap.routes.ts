import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnlineMapComponent } from './onlineMap.component';
import { ImageComponent } from './pages/image/image.component';
import { TdtComponent } from './pages/tdt/tdt.component';
import { BingComponent } from './pages/bing/bing.component';
import { ArcgisComponent } from './pages/arcgis/arcgis.component';
import { GaodeComponent } from './pages/gaode/gaode.component';

const OnlineMapRoutes: Routes = [
	{
		path: '',
		component: OnlineMapComponent,
		children: [
			{
				path: 'image',
				component: ImageComponent
			},
			{
				path: 'tdt',
				component: TdtComponent
			},
			{
				path: 'bing',
				component: BingComponent
			},
			{
				path: 'arcgis',
				component: ArcgisComponent
			},
			{
				path: 'gaode',
				component: GaodeComponent
			},
			{
				path: '',
				redirectTo: 'image',
				pathMatch: 'full'
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(OnlineMapRoutes)
	],
	exports: [
		RouterModule
	]
})
export class OnlineMapRoutingModule {
}

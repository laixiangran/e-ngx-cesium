import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnlineMapComponent } from './onlineMap.component';
import { ImageComponent } from './pages/image/image.component';
import { TdtComponent } from './pages/tdt/tdt.component';
import { BingComponent } from './pages/bing/bing.component';
import { ArcgisComponent } from './pages/arcgis/arcgis.component';
import { GaodeComponent } from './pages/gaode/gaode.component';
import { GoogleComponent } from './pages/google/google.component';

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
				path: 'google',
				component: GoogleComponent
			},
			{
				path: 'gaode',
				component: GaodeComponent
			},
			{
				path: 'arcgis',
				component: ArcgisComponent
			},
			{
				path: 'bing',
				component: BingComponent
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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OnlineMapComponent } from './onlineMap.component';
import { OnlineMapRoutingModule } from './onlineMap.routes';
import { ENgxCesiumModule } from '../../../../../../src';
import { ImageComponent } from './pages/image/image.component';
import { TdtComponent } from './pages/tdt/tdt.component';
import { DropdownModule } from 'primeng/primeng';
import { BingComponent } from './pages/bing/bing.component';
import { ArcgisComponent } from './pages/arcgis/arcgis.component';
import { GaodeComponent } from './pages/gaode/gaode.component';
import { GoogleComponent } from './pages/google/google.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		OnlineMapRoutingModule,
		ENgxCesiumModule,
		DropdownModule
	],
	declarations: [
		OnlineMapComponent,
		ImageComponent,
		TdtComponent,
		BingComponent,
		ArcgisComponent,
		GaodeComponent,
		GoogleComponent
	]
})
export class OnlineMapModule {
}

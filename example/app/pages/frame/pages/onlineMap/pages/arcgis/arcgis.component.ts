import { Component, OnInit } from '@angular/core';
import ViewerOptions = Cesium.ViewerOptions;
import Viewer = Cesium.Viewer;
import Scene = Cesium.Scene;
import Globe = Cesium.Globe;
import ArcGisMapServerImageryProvider = Cesium.ArcGisMapServerImageryProvider;

@Component({
	selector: 'app-arcgis',
	templateUrl: './arcgis.component.html',
	styleUrls: ['./arcgis.component.scss']
})
export class ArcgisComponent implements OnInit {
	viewerOptions: ViewerOptions;
	viewer: Viewer;
	scene: Scene;
	globe: Globe;

	constructor() {
		this.viewerOptions = {
			imageryProvider: new ArcGisMapServerImageryProvider({
				url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
			})
		};
	}

	ngOnInit() {
	}

	onViewerReady(evt: any) {
		this.viewer = evt.viewer;
		this.scene = evt.scene;
		this.globe = evt.globe;
	}
}

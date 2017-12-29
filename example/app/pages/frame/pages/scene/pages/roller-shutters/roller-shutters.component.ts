import { Component, OnInit } from '@angular/core';
import ViewerOptions = Cesium.ViewerOptions;
import Viewer = Cesium.Viewer;
import Scene = Cesium.Scene;
import Globe = Cesium.Globe;
import ImageryProvider = Cesium.ImageryProvider;
import SingleTileImageryProvider = Cesium.SingleTileImageryProvider;

@Component({
	templateUrl: './roller-shutters.component.html',
	styleUrls: ['./roller-shutters.component.scss']
})
export class RollerShuttersComponent implements OnInit {
	viewerOptions: ViewerOptions;
	viewer: Viewer;
	scene: Scene;
	globe: Globe;
	contrastImageryProviders: ImageryProvider[];

	constructor() {
		this.contrastImageryProviders = [
			new SingleTileImageryProvider({
				url: './assets/images/BlackMarble_2012.jpg'
			}),
			new SingleTileImageryProvider({
				url: './assets/images/BlackMarble_2016.jpg'
			})
		];
	}

	ngOnInit() {
	}

	onViewerReady(evt: any) {
		this.viewer = evt.viewer;
		this.scene = evt.scene;
		this.globe = evt.globe;
	}
}

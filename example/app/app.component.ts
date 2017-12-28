import { Component } from '@angular/core';
import ViewerOptions = Cesium.ViewerOptions;
import Viewer = Cesium.Viewer;
import Globe = Cesium.Globe;
import Scene = Cesium.Scene;
import ImageryLayerCollection = Cesium.ImageryLayerCollection;
import ImageryLayer = Cesium.ImageryLayer;
import ImagerySplitDirection = Cesium.ImagerySplitDirection;
import { TiandituImageryProvider, TiandituMapsStyle } from '../../src';
import ImageryProvider = Cesium.ImageryProvider;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	viewerOptions: ViewerOptions;
	viewer: Viewer;
	scene: Scene;
	globe: Globe;
	contrastImageryProviders: ImageryProvider[] = [];
	enableRollerShutters: boolean = true;

	constructor() {
		this.viewerOptions = {
			vrButton: true // 启用VR模式
		};
		this.contrastImageryProviders = [
			new TiandituImageryProvider(TiandituMapsStyle.VEC_C),
			new TiandituImageryProvider(TiandituMapsStyle.TER_C),
			new TiandituImageryProvider(TiandituMapsStyle.CVA_C),
			new TiandituImageryProvider(TiandituMapsStyle.CTA_C)
		];
	}

	onViewerReady(evt: any) {
		this.viewer = evt.viewer;
		this.scene = evt.scene;
		this.globe = evt.globe;
	}

	onSliderChange(evt: any) {
		console.log(evt);
	}
}

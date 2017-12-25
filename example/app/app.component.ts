import { Component } from '@angular/core';
import ViewerOptions = Cesium.ViewerOptions;
import Viewer = Cesium.Viewer;
import Globe = Cesium.Globe;
import Scene = Cesium.Scene;
import ImageryLayerCollection = Cesium.ImageryLayerCollection;
import BingMapsImageryProvider = Cesium.BingMapsImageryProvider;
import ImageryLayer = Cesium.ImageryLayer;
import ImagerySplitDirection = Cesium.ImagerySplitDirection;
import { TiandituImageryProvider, TiandituMapsStyle } from '../../src';

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

	constructor() {
		this.viewerOptions = {
			vrButton: true // 启用VR模式
		};
	}

	onViewerReady(evt: any) {
		this.viewer = evt.viewer;
		this.scene = evt.scene;
		this.globe = evt.globe;

		const layers: ImageryLayerCollection = this.viewer.imageryLayers;
		const tdtVecLayer: ImageryLayer = layers.addImageryProvider(TiandituImageryProvider.init(TiandituMapsStyle.VEC));
		const tdtCvaLayer: ImageryLayer = layers.addImageryProvider(TiandituImageryProvider.init(TiandituMapsStyle.CVA));
		tdtVecLayer.splitDirection = ImagerySplitDirection.RIGHT;
		tdtCvaLayer.splitDirection = ImagerySplitDirection.RIGHT;
		this.scene.imagerySplitPosition = 0.5;
	}
}

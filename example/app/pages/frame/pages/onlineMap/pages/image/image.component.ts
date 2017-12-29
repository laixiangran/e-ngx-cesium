import { Component } from '@angular/core';
import Viewer = Cesium.Viewer;
import ViewerOptions = Cesium.ViewerOptions;
import Globe = Cesium.Globe;
import Scene = Cesium.Scene;
import SingleTileImageryProvider = Cesium.SingleTileImageryProvider;

@Component({
	templateUrl: './image.component.html',
	styleUrls: ['./image.component.scss']
})
export class ImageComponent {
	viewerOptions: ViewerOptions;
	viewer: Viewer;
	scene: Scene;
	globe: Globe;

	constructor() {
		this.viewerOptions = {
			// 使用本地的一张图片初始化地球，建议图片长宽比2:1
			imageryProvider: new SingleTileImageryProvider({
				url: './assets/images/worldimage.jpg'
			})
		};
	}

	onViewerReady(evt: any) {
		this.viewer = evt.viewer;
		this.scene = evt.scene;
		this.globe = evt.globe;
	}
}


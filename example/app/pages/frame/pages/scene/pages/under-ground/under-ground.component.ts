import { Component, OnInit } from '@angular/core';
import ViewerOptions = Cesium.ViewerOptions;
import Viewer = Cesium.Viewer;
import Scene = Cesium.Scene;
import Globe = Cesium.Globe;

@Component({
	selector: 'under-ground',
	templateUrl: './under-ground.component.html',
	styleUrls: ['./under-ground.component.scss']
})
export class UnderGroundComponent implements OnInit {
	viewerOptions: ViewerOptions;
	viewer: Viewer;
	scene: Scene;
	globe: Globe;

	constructor() {
	}

	ngOnInit() {
	}

	onViewerReady(evt: any) {
		this.viewer = evt.viewer;
		this.scene = evt.scene;
		this.globe = evt.globe;
		this.test();
	}

	test() {
		// this.scene.skyAtmosphere.show = false; // 隐藏大气渲染效果
		// this.scene.skyBox.show = false; // 隐藏太空背景
		this.scene['undergroundMode'] = true; // 设置开启地下场景
		this.scene.screenSpaceCameraController.minimumZoomDistance = -1000; // 设置相机最小缩放距离，距离地表-1000米
		this.scene.camera.setView({
			destination: Cesium.Cartesian3.fromDegrees(116.3888, 39.9923, -11),
			orientation: {
				heading: 1.6105,
				pitch: -0.2885,
				roll: 0
			}
		});
	}
}

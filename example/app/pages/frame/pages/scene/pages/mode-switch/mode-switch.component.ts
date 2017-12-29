import { Component, OnInit } from '@angular/core';
import ViewerOptions = Cesium.ViewerOptions;
import Viewer = Cesium.Viewer;
import Scene = Cesium.Scene;
import Globe = Cesium.Globe;
import { SelectItem } from 'primeng/primeng';
import Ellipsoid = Cesium.Ellipsoid;

@Component({
	templateUrl: './mode-switch.component.html',
	styleUrls: ['./mode-switch.component.scss']
})
export class ModeSwitchComponent implements OnInit {
	viewerOptions: ViewerOptions;
	viewer: Viewer;
	scene: Scene;
	globe: Globe;
	modes: SelectItem[];
	selectedMode: number[];
	isReShow: boolean = true;

	constructor() {
		this.viewerOptions = {
			sceneModePicker: true // 启动scene模式切换
		};
		this.modes = [
			{label: '--选择地球模式--', value: null},
			{label: '椭球模式', value: [6378137.0, 6378137.0, 6356752.3142451793]},
			{label: '圆球模式', value: [6378137.0, 6378137.0, 6378137.0]}
		];
	}

	ngOnInit() {
	}

	onViewerReady(evt: any) {
		this.viewer = evt.viewer;
		this.scene = evt.scene;
		this.globe = evt.globe;
		this.viewer.scene.camera.setView({
			destination: new Cesium.Cartesian3(317341.1198994921, 5642696.778815073, 2961682.3300576834),
			orientation: {
				heading: 0.34555839949062594,
				pitch: -0.1422794351856307,
				roll: 0.0009471063581933947
			}
		});
	}

	modeChange($event) {
		const mode: number[] = $event.value;
		this.isReShow = false;
		Ellipsoid.WGS84 = Cesium['freezeObject'](new Ellipsoid(mode[0], mode[1], mode[2]));
		setTimeout(() => {
			this.isReShow = true;
		});
	}
}

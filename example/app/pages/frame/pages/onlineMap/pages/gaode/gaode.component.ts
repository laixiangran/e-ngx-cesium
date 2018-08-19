import { Component, OnInit } from '@angular/core';
import ViewerOptions = Cesium.ViewerOptions;
import Viewer = Cesium.Viewer;
import Scene = Cesium.Scene;
import Globe = Cesium.Globe;
import { GaodeMapsImageryProvider, GaodeMapsStyle } from '../../../../../../../../src';
import { SelectItem } from 'primeng/primeng';

@Component({
	templateUrl: './gaode.component.html',
	styleUrls: ['./gaode.component.scss']
})
export class GaodeComponent implements OnInit {
	viewerOptions: ViewerOptions;
	viewer: Viewer;
	scene: Scene;
	globe: Globe;
	servers: SelectItem[];
	selectedServer: GaodeMapsImageryProvider;

	constructor() {
		this.viewerOptions = {
			imageryProvider: new GaodeMapsImageryProvider(GaodeMapsStyle.IMG)
		};
		this.servers = [
			{label: '--选择服务类型--', value: null},
			{label: '矢量地图服务', value: new GaodeMapsImageryProvider(GaodeMapsStyle.VEC)},
			{label: '影像地图服务', value: new GaodeMapsImageryProvider(GaodeMapsStyle.IMG)},
			{label: '影像标注服务', value: new GaodeMapsImageryProvider(GaodeMapsStyle.CIA)}
		];
	}

	ngOnInit() {
	}

	onViewerReady(evt: any) {
		this.viewer = evt.viewer;
		this.scene = evt.scene;
		this.globe = evt.globe;
	}

	serverChange($event) {
		this.viewer.imageryLayers.removeAll();
		let gaodeImageryProvider: GaodeMapsImageryProvider;
		if ($event.value) {
			gaodeImageryProvider = $event.value;
		} else {
			gaodeImageryProvider = new GaodeMapsImageryProvider(GaodeMapsStyle.IMG);
		}
		this.viewer.imageryLayers.addImageryProvider(gaodeImageryProvider);
	}
}

import { Component } from '@angular/core';
import Viewer = Cesium.Viewer;
import ViewerOptions = Cesium.ViewerOptions;
import Globe = Cesium.Globe;
import Scene = Cesium.Scene;
import { GoogleMapsImageryProvider, GoogleMapsStyle } from '../../../../../../../../src';
import { SelectItem } from 'primeng/primeng';

@Component({
	templateUrl: './google.component.html',
	styleUrls: ['./google.component.scss']
})
export class GoogleComponent {
	viewerOptions: ViewerOptions;
	viewer: Viewer;
	scene: Scene;
	globe: Globe;
	servers: SelectItem[];
	selectedServer: GoogleMapsImageryProvider;

	constructor() {
		this.viewerOptions = {
			imageryProvider: new GoogleMapsImageryProvider()
		};
		this.servers = [
			{label: '--选择服务类型--', value: new GoogleMapsImageryProvider()},
			{label: '矢量地图服务', value: new GoogleMapsImageryProvider(GoogleMapsStyle.M)},
			{label: '地形地图服务', value: new GoogleMapsImageryProvider(GoogleMapsStyle.P)},
			{label: '卫星地图服务', value: new GoogleMapsImageryProvider(GoogleMapsStyle.Y)},
			{label: '卫星地图服务（不含标注）', value: new GoogleMapsImageryProvider(GoogleMapsStyle.S)},
			{label: '地形地图服务（不含标注）', value: new GoogleMapsImageryProvider(GoogleMapsStyle.T)},
			{label: '地图标注服务（亮色系）', value: new GoogleMapsImageryProvider(GoogleMapsStyle.H)},
			{label: '地图标注服务（暗色系）', value: new GoogleMapsImageryProvider(GoogleMapsStyle.R)}
		];
	}

	onViewerReady(evt: any) {
		this.viewer = evt.viewer;
		this.scene = evt.scene;
		this.globe = evt.globe;
	}

	serverChange($event) {
		this.viewer.imageryLayers.removeAll();
		this.viewer.imageryLayers.addImageryProvider($event.value);
	}
}


import { Component } from '@angular/core';
import Viewer = Cesium.Viewer;
import ViewerOptions = Cesium.ViewerOptions;
import Globe = Cesium.Globe;
import Scene = Cesium.Scene;
import { GoogleImageryProvider, GoogleMapsStyle } from '../../../../../../../../src';
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
	selectedServer: GoogleImageryProvider;

	constructor() {
		this.viewerOptions = {
			imageryProvider: new GoogleImageryProvider(GoogleMapsStyle.Y)
		};
		this.servers = [
			{label: '--选择服务类型--', value: null},
			{label: '矢量地图服务', value: new GoogleImageryProvider(GoogleMapsStyle.M)},
			{label: '地形地图服务', value: new GoogleImageryProvider(GoogleMapsStyle.P)},
			{label: '卫星地图服务', value: new GoogleImageryProvider(GoogleMapsStyle.Y)},
			{label: '卫星地图服务（不含标注）', value: new GoogleImageryProvider(GoogleMapsStyle.S)},
			{label: '地形地图服务（不含标注）', value: new GoogleImageryProvider(GoogleMapsStyle.T)},
			{label: '地图标注服务（亮色系）', value: new GoogleImageryProvider(GoogleMapsStyle.H)},
			{label: '地图标注服务（暗色系）', value: new GoogleImageryProvider(GoogleMapsStyle.R)}
		];
	}

	onViewerReady(evt: any) {
		this.viewer = evt.viewer;
		this.scene = evt.scene;
		this.globe = evt.globe;
	}

	serverChange($event) {
		this.viewer.imageryLayers.removeAll();
		let googleImageryProvider: GoogleImageryProvider;
		if ($event.value) {
			googleImageryProvider = $event.value;
		} else {
			googleImageryProvider = new GoogleImageryProvider(GoogleMapsStyle.Y);
		}
		this.viewer.imageryLayers.addImageryProvider(googleImageryProvider);
	}
}


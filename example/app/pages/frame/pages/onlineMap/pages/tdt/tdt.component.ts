import { Component } from '@angular/core';
import Viewer = Cesium.Viewer;
import ViewerOptions = Cesium.ViewerOptions;
import Globe = Cesium.Globe;
import Scene = Cesium.Scene;
import { SelectItem } from 'primeng/primeng';
import { TiandituImageryProvider, TiandituMapsStyle } from '../../../../../../../../src';

@Component({
	templateUrl: './tdt.component.html',
	styleUrls: ['./tdt.component.scss']
})
export class TdtComponent {
	viewerOptions: ViewerOptions;
	viewer: Viewer;
	scene: Scene;
	globe: Globe;
	servers: SelectItem[];
	selectedServer: TiandituImageryProvider;

	constructor() {
		this.viewerOptions = {
			imageryProvider: new TiandituImageryProvider(TiandituMapsStyle.IMG_W)
		};
		this.servers = [
			{label: '--选择服务类型--', value: null},
			{label: '天地图全球影像地图服务（经纬度投影）', value: new TiandituImageryProvider(TiandituMapsStyle.IMG_C)},
			{label: '天地图全球影像地图服务（墨卡托投影）', value: new TiandituImageryProvider(TiandituMapsStyle.IMG_W)},
			{label: '天地图全球地形晕渲服务（经纬度投影）', value: new TiandituImageryProvider(TiandituMapsStyle.TER_C)},
			{label: '天地图全球地形晕渲服务（墨卡托投影）', value: new TiandituImageryProvider(TiandituMapsStyle.TER_W)},
			{label: '天地图全球矢量地图服务（经纬度投影）', value: new TiandituImageryProvider(TiandituMapsStyle.VEC_C)},
			{label: '天地图全球矢量地图服务（墨卡托投影）', value: new TiandituImageryProvider(TiandituMapsStyle.VEC_W)},
			{label: '天地图全球影像中文注记服务（经纬度投影）', value: new TiandituImageryProvider(TiandituMapsStyle.CIA_C)},
			{label: '天地图全球影像中文注记服务（墨卡托投影）', value: new TiandituImageryProvider(TiandituMapsStyle.CIA_W)},
			{label: '天地图全球地形中文注记服务（经纬度投影）', value: new TiandituImageryProvider(TiandituMapsStyle.CTA_C)},
			{label: '天地图全球地形中文注记服务（墨卡托投影）', value: new TiandituImageryProvider(TiandituMapsStyle.CTA_W)},
			{label: '天地图全球矢量中文标注服务（经纬度投影）', value: new TiandituImageryProvider(TiandituMapsStyle.CVA_C)},
			{label: '天地图全球矢量中文标注服务（墨卡托投影）', value: new TiandituImageryProvider(TiandituMapsStyle.CVA_W)}
		];
	}

	onViewerReady(evt: any) {
		this.viewer = evt.viewer;
		this.scene = evt.scene;
		this.globe = evt.globe;
	}

	serverChange($event) {
		this.viewer.imageryLayers.removeAll();
		let tdtImageryProvider: TiandituImageryProvider;
		if ($event.value) {
			tdtImageryProvider = $event.value;
		} else {
			tdtImageryProvider = new TiandituImageryProvider(TiandituMapsStyle.IMG_W);
		}
		this.viewer.imageryLayers.addImageryProvider(tdtImageryProvider);
	}
}


import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import ViewerOptions = Cesium.ViewerOptions;
import Viewer = Cesium.Viewer;
import Scene = Cesium.Scene;
import Globe = Cesium.Globe;
import ScreenSpaceEventHandler = Cesium.ScreenSpaceEventHandler;
import Cartesian2 = Cesium.Cartesian2;
import ScreenSpaceEventType = Cesium.ScreenSpaceEventType;
import MoveEvent = Cesium.MoveEvent;
import Ellipsoid = Cesium.Ellipsoid;
import defined = Cesium.defined;
import Cartographic = Cesium.Cartographic;
import Cartesian3 = Cesium.Cartesian3;
import { ENgxCesiumComponent, Longlat, CurrentExtent } from '../../../../../../../../src';

@Component({
	selector: 'position-info',
	templateUrl: './position-info.component.html',
	styleUrls: ['./position-info.component.scss']
})
export class PositionInfoComponent implements OnInit, OnDestroy {
	@ViewChild('eNgxCesium') eNgxCesium: ENgxCesiumComponent;
	viewerOptions: ViewerOptions;
	viewer: Viewer;
	scene: Scene;
	globe: Globe;
	ellipsoid: Ellipsoid;
	getPositionActionHandler: ScreenSpaceEventHandler;
	windowPosition: Cartesian2;
	cartesian: Cartesian3;
	cartographic: Cartographic;
	longlat: Longlat;
	height: any;
	currentExtent: CurrentExtent;

	constructor() {
	}

	ngOnInit() {
	}

	ngOnDestroy() {
		this.getPositionActionHandler.destroy();
	}

	onViewerReady(evt: any) {
		this.viewer = evt.viewer;
		this.scene = evt.scene;
		this.globe = evt.globe;
		this.ellipsoid = this.globe.ellipsoid;
		this.setGetPositionAction();
	}

	/**
	 * 设置鼠标点击事件
	 */
	setGetPositionAction() {

		// 定义当前场景的画布元素的事件处理
		this.getPositionActionHandler = new ScreenSpaceEventHandler(this.scene.canvas);

		// 设置鼠标移动事件的处理函数，这里负责监听x,y坐标值变化
		this.getPositionActionHandler.setInputAction((move: MoveEvent) => {
			if (move.endPosition) {
				this.getMousePointPosition(move.endPosition);
				this.currentExtent = this.eNgxCesium.getCurrentExtent(this.viewer);
			}
		}, ScreenSpaceEventType.MOUSE_MOVE);
	}

	/**
	 * 获取相关位置信息
	 * @param {Cesium.Cartesian2} point
	 */
	getMousePointPosition(point: Cartesian2) {
		this.windowPosition = point; // 屏幕坐标点
		this.cartesian = this.eNgxCesium.window2cartesian(this.windowPosition, this.viewer);
		if (defined(this.cartesian)) {
			this.cartographic = this.eNgxCesium.cartesian2cartographic(this.cartesian);
			this.longlat = this.eNgxCesium.cartographic2longlat(this.cartographic);
			this.height = {
				elevation: this.eNgxCesium.getElevation(this.cartographic, this.globe),
				cameraHeight: this.eNgxCesium.getCameraHeight(this.viewer.camera)
			};
		} else {
			this.cartographic = null;
			this.longlat = null;
			this.height = null;
		}
	}
}

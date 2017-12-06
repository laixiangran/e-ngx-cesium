/// <reference path="../node_modules/cesium-typings/index.d.ts" />

import { Component, OnInit, ElementRef, ViewChild, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import ViewerOptions = Cesium.ViewerOptions;
import Viewer = Cesium.Viewer;
import CesiumMath = Cesium.Math;
import ImageryProvider = Cesium.ImageryProvider;
import Scene = Cesium.Scene;
import Ellipsoid = Cesium.Ellipsoid;
import ScreenSpaceEventHandler = Cesium.ScreenSpaceEventHandler;
import Cartographic = Cesium.Cartographic;
import ScreenSpaceEventType = Cesium.ScreenSpaceEventType;
import Globe = Cesium.Globe;
import MoveEvent = Cesium.MoveEvent;
import Cartesian2 = Cesium.Cartesian2;
import Camera = Cesium.Camera;
import Rectangle = Cesium.Rectangle;
import defined = Cesium.defined;
import DefaultProxy = Cesium.DefaultProxy;

export interface CurrentPosition {
	long: number; // 经度
	lat: number; // 纬度
	height: number; // 相机高度
	elevation: number; // 海拔
}

@Component({
	selector: 'e-ngx-cesium',
	templateUrl: './e-ngx-cesium.component.html',
	styleUrls: ['./e-ngx-cesium.component.scss']
})
export class ENgxCesiumComponent implements OnInit, OnDestroy {
	@ViewChild('globeContainer') globeContainerRef: ElementRef;

	@Input()
	viewerOptions: ViewerOptions;
	@Input()
	proxy: string;

	@Output()
	viewerReady: EventEmitter<any> = new EventEmitter<any>(false);

	private globeContainer: HTMLDivElement;
	private viewer: Viewer; // 视图
	private scene: Scene; // 三维场景
	private globe: Globe; // 三维球体
	private ellipsoid: Ellipsoid; // 三维场景的椭球体
	private defaultProxy: DefaultProxy = null;
	private defaultViewerOptions: ViewerOptions = {
		timeline: false,
		animation: false,
		baseLayerPicker: false,
		homeButton: false,
		fullscreenElement: this.globeContainer, // 这里设置viewer所在元素为全屏的元素
		imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
			url: 'http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles',
			layer: 'tdtVecBasicLayer',
			style: 'default',
			format: 'image/jpeg',
			tileMatrixSetID: 'TDTMapsCompatible'
		}),
		terrainProvider: new Cesium.CesiumTerrainProvider({
			url: 'https://assets.agi.com/stk-terrain/world',
			requestWaterMask: true,
			requestVertexNormals: true
		})
	};
	mousePosition: CurrentPosition; // 鼠标位置

	// 默认中国
	private defaultRectangle: Rectangle = Rectangle.fromDegrees(73.666667, 3.866667, 135.041667, 53.55);

	constructor() {
	}

	ngOnInit() {
		this.globeContainer = this.globeContainerRef.nativeElement;
		this.defaultProxy = this.proxy && new DefaultProxy(this.proxy);
		this.initViewer();
	}

	/**
	 * 初始化视图
	 */
	initViewer() {
		let addImageryLayer: ImageryProvider;
		if (!(this.viewerOptions && this.viewerOptions.imageryProvider)) {
			addImageryLayer = new Cesium.WebMapTileServiceImageryProvider({
				url: 'http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg',
				layer: 'tdtVecBasicLayer',
				style: 'default',
				format: 'image/jpeg',
				proxy: this.defaultProxy,
				tileMatrixSetID: 'TDTMapsCompatible'
			});
		}
		Camera.DEFAULT_VIEW_RECTANGLE = this.defaultRectangle;
		const viewerOptions: ViewerOptions = this.viewerOptions ? _.merge({}, this.defaultViewerOptions, this.viewerOptions) : this.defaultViewerOptions;
		this.viewer = new Viewer(this.globeContainer, viewerOptions);

		// 导航扩展
		this.viewer.extend(Cesium['viewerCesiumNavigationMixin'], {});

		// 添加天地图影像标注
		if (addImageryLayer) {
			this.viewer.imageryLayers.addImageryProvider(addImageryLayer);
		}
		this.scene = this.viewer.scene;
		this.globe = this.scene.globe;
		this.ellipsoid = this.globe.ellipsoid;
		this.viewer.cesiumWidget.creditContainer['style'].display = 'none'; // 隐藏默认的版权信息

		this.setGetPositionAction();

		// 分发初始化完成事件
		this.viewerReady.emit({
			viewer: this.viewer,
			scene: this.scene,
			globe: this.globe,
			ellipsoid: this.ellipsoid
		});
	}

	/**
	 * 默认相机位置
	 */
	homeCamera() {
		this.viewer.camera.flyHome(1);
	}

	/**
	 * 设置鼠标移动或者滚动事件动态获取鼠标点位置信息
	 */
	setGetPositionAction() {
		// 定义当前场景的画布元素的事件处理
		const handler: ScreenSpaceEventHandler = new ScreenSpaceEventHandler(this.scene.canvas);
		let moveEndPosition: Cartesian2;

		// 设置鼠标移动事件的处理函数，这里负责监听x,y坐标值变化
		handler.setInputAction((move: MoveEvent) => {
			if (move.endPosition) {
				moveEndPosition = move.endPosition;
				this.mousePosition = this.getMousePointPosition(moveEndPosition) || this.mousePosition;
			}
		}, ScreenSpaceEventType.MOUSE_MOVE);

		// 设置鼠标滚动事件的处理函数，这里负责监听高度值变化
		handler.setInputAction(() => {
			this.mousePosition.height = Math.ceil(this.viewer.camera.positionCartographic.height);
		}, ScreenSpaceEventType.WHEEL);
	}

	/**
	 * 获取二维笛卡尔点的经度、纬度、相机高度、海拔高度
	 * @param {Cesium.Cartesian2} point
	 */
	getMousePointPosition(point: Cartesian2): CurrentPosition {
		// 通过指定的椭球或者地图对应的坐标系，将鼠标的二维坐标转换为对应椭球体三维坐标
		const cartesian = this.viewer.camera.pickEllipsoid(point, this.ellipsoid);
		if (defined(cartesian)) {
			// 将笛卡尔坐标转换为地理坐标
			const cartographic: Cartographic = this.ellipsoid.cartesianToCartographic(cartesian);

			// 将弧度转为度的十进制度表示
			const longitude: number = +CesiumMath.toDegrees(cartographic.longitude).toFixed(6);
			const latitude: number = +CesiumMath.toDegrees(cartographic.latitude).toFixed(6);

			// 获取海拔高度
			const elevation: number = Math.ceil(this.globe.getHeight(cartographic));

			// 获取相机高度
			const height: number = Math.ceil(this.viewer.camera.positionCartographic.height) - elevation;

			return {
				long: longitude,
				lat: latitude,
				height: height,
				elevation: elevation
			};
		} else {
			return null;
		}
	}

	ngOnDestroy() {
		this.viewer['cesiumNavigation'].destroy();
		this.viewer.destroy();
	}
}

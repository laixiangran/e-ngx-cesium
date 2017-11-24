/// <reference path="../node_modules/cesium-typings/index.d.ts" />

import { Component, OnInit, ElementRef, ViewChild, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import ViewerOptions = Cesium.ViewerOptions;
import Viewer = Cesium.Viewer;
import CesiumMath = Cesium.Math;
import Cartesian3 = Cesium.Cartesian3;
import ImageryProvider = Cesium.ImageryProvider;
import Scene = Cesium.Scene;
import Ellipsoid = Cesium.Ellipsoid;
import ScreenSpaceEventHandler = Cesium.ScreenSpaceEventHandler;
import Cartographic = Cesium.Cartographic;
import ScreenSpaceEventType = Cesium.ScreenSpaceEventType;
import Globe = Cesium.Globe;

@Component({
	selector: 'e-ngx-cesium',
	templateUrl: './e-ngx-cesium.component.html',
	styleUrls: ['./e-ngx-cesium.component.scss']
})
export class ENgxCesiumComponent implements OnInit, OnDestroy {
	@ViewChild('globeContainer') globeContainerRef: ElementRef;

	private globeContainer: HTMLDivElement;
	private viewer: Viewer; // 视图
	private scene: Scene; // 三维场景
	private globe: Globe; // 三维球体
	private ellipsoid: Ellipsoid; // 三维场景的椭球体
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
	mousePosition: any; // 鼠标位置

	// 默认中国
	private initCamera: any = {
		x: 111,
		y: 30,
		z: 18852846,
		roll: 1,
		pitch: -90,
		heading: 353
	};

	@Input()
	viewerOptions: ViewerOptions;

	@Output()
	viewerReady: EventEmitter<any> = new EventEmitter<any>(false);

	constructor() {
	}

	ngOnInit() {
		this.globeContainer = this.globeContainerRef.nativeElement;
		this.initViewer();
	}

	/**
	 * 初始化视图
	 */
	initViewer() {
		let addImageryLayer: ImageryProvider;
		if (!(this.viewerOptions && this.viewerOptions.imageryProvider)) {
			// 添加天地图影像标注
			addImageryLayer = new Cesium.WebMapTileServiceImageryProvider({
				url: 'http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg',
				layer: 'tdtVecBasicLayer',
				style: 'default',
				format: 'image/jpeg',
				tileMatrixSetID: 'TDTMapsCompatible'
			});
		}
		const viewerOptions: ViewerOptions = this.viewerOptions ? _.merge({}, this.defaultViewerOptions, this.viewerOptions) : this.defaultViewerOptions;
		this.viewer = new Viewer(this.globeContainer, viewerOptions);
		if (addImageryLayer) {
			this.viewer.imageryLayers.addImageryProvider(addImageryLayer);
		}
		this.scene = this.viewer.scene;
		this.globe = this.scene.globe;
		this.ellipsoid = this.globe.ellipsoid;
		this.viewer.cesiumWidget.creditContainer['style'].display = 'none'; // 隐藏默认的版权信息

		// 初始化相机位置（中国）
		this.homeCamera();

		this.getPosition();

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
		this.viewer.camera.flyTo({
			destination: Cartesian3.fromDegrees(this.initCamera.x, this.initCamera.y, this.initCamera.z),
			orientation: {
				heading: CesiumMath.toRadians(this.initCamera.heading),
				pitch: CesiumMath.toRadians(this.initCamera.pitch || -CesiumMath.PI_OVER_FOUR),
				roll: CesiumMath.toRadians(this.initCamera.roll)
			}
		});
	}

	/**
	 * 获取鼠标的经度、纬度、高度
	 */
	getPosition() {
		let longitude: number;
		let latitude: number;
		let height: number;
		let cartesian: Cartesian3;

		// 定义当前场景的画布元素的事件处理
		const handler: ScreenSpaceEventHandler = new ScreenSpaceEventHandler(this.scene.canvas);

		// 设置鼠标移动事件的处理函数，这里负责监听x,y坐标值变化
		handler.setInputAction( (movement: any) => {

			// 通过指定的椭球或者地图对应的坐标系，将鼠标的二维坐标转换为对应椭球体三维坐标
			cartesian = viewer.camera.pickEllipsoid(movement['endPosition'], this.ellipsoid);
			if (cartesian) {

				// 将笛卡尔坐标转换为地理坐标
				const cartographic: Cartographic = this.ellipsoid.cartesianToCartographic(cartesian);

				// 将弧度转为度的十进制度表示
				longitude = +CesiumMath.toDegrees(cartographic.longitude).toFixed(6);
				latitude = +CesiumMath.toDegrees(cartographic.latitude).toFixed(6);

				// 获取相机高度
				height = Math.ceil(viewer.camera.positionCartographic.height);
				this.mousePosition = {
					long: longitude,
					lat: latitude,
					height: height
				};
			} else {
				this.mousePosition = null;
			}
		}, ScreenSpaceEventType.MOUSE_MOVE);

		// 设置鼠标滚动事件的处理函数，这里负责监听高度值变化
		handler.setInputAction( (wheelment: any) => {
			height = Math.ceil(viewer.camera.positionCartographic.height);
			this.mousePosition = {
				long: longitude,
				lat: latitude,
				height: height
			};
		}, ScreenSpaceEventType.WHEEL);
	}

	ngOnDestroy() {
		this.viewer.destroy();
	}
}

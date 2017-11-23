/// <reference path="../node_modules/cesium-typings/index.d.ts" />

import { Component, OnInit, ElementRef, ViewChild, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import ViewerOptions = Cesium.ViewerOptions;
import Viewer = Cesium.Viewer;
import CesiumMath = Cesium.Math;
import Cartesian3 = Cesium.Cartesian3;
import ImageryProvider = Cesium.ImageryProvider;

@Component({
	selector: 'e-ngx-cesium',
	templateUrl: './e-ngx-cesium.component.html',
	styleUrls: ['./e-ngx-cesium.component.scss']
})
export class ENgxCesiumComponent implements OnInit, OnDestroy {
	@ViewChild('eNgxCesiumContainer') eNgxCesiumContainerRef: ElementRef;

	private eNgxCesiumContainer: HTMLDivElement;
	private viewer: Viewer;
	private defaultViewerOptions: ViewerOptions = {
		scene3DOnly: true,
		timeline: false,
		animation: false,
		baseLayerPicker: false,
		geocoder: false,
		homeButton: false,
		navigationHelpButton: false,
		fullscreenElement: this.eNgxCesiumContainer, // 这里设置viewer所在元素为全屏的元素
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

	// 默认中国
	private initCamera: any = {
		x: 111,
		y: 30,
		z: 18852846,
		roll: 1,
		pitch: -90,
		heading: 353
	};

	@Input() viewerOptions: ViewerOptions;

	// 视图创建完成之后触发该事件
	@Output()
	viewerReady: EventEmitter<any> = new EventEmitter<any>(false);

	constructor() {
	}

	ngOnInit() {
		this.eNgxCesiumContainer = this.eNgxCesiumContainerRef.nativeElement;
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
		this.viewer = new Viewer(this.eNgxCesiumContainer, viewerOptions);
		this.viewer.cesiumWidget.creditContainer['style'].display = 'none'; // 隐藏默认的版权信息
		this.viewer.scene.globe.depthTestAgainstTerrain = true; // 确保地形背后的物体被正确地遮挡。只有最前面的对象才可见。
		if (addImageryLayer) {
			this.viewer.imageryLayers.addImageryProvider(addImageryLayer);
		}

		// 初始化相机位置（中国）
		this.homeCamera();

		// 分发初始化完成事件
		this.viewerReady.emit(this.viewer);
	}

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

	ngOnDestroy() {
		this.viewer.destroy();
	}
}

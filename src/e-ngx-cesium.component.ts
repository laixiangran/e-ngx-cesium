/// <reference path="../node_modules/cesium-typings/index.d.ts" />

import { Component, OnInit, ElementRef, ViewChild, OnDestroy, Input, Output, EventEmitter, Renderer2 } from '@angular/core';
import * as _ from 'lodash';
import ViewerOptions = Cesium.ViewerOptions;
import Viewer = Cesium.Viewer;
import CesiumMath = Cesium.Math;
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
import ImageryLayer = Cesium.ImageryLayer;
import ImageryLayerCollection = Cesium.ImageryLayerCollection;
import ImagerySplitDirection = Cesium.ImagerySplitDirection;
import ImageryProvider = Cesium.ImageryProvider;
import Cartesian3 = Cesium.Cartesian3;
import SceneTransforms = Cesium.SceneTransforms;
import { GoogleMapsStyle } from './imageryProvider/google/GoogleMapsStyle';
import { GoogleMapsImageryProvider } from './imageryProvider/google/GoogleMapsImageryProvider';
import GeocoderService = Cesium.GeocoderService;
import GeocoderResult = Cesium.GeocoderResult;
import createWorldTerrain = Cesium.createWorldTerrain;
import Ion = Cesium.Ion;

export interface CurrentPosition {
	long: number; // 经度
	lat: number; // 纬度
	height: number; // 相机高度
	elevation: number; // 海拔
}

export interface Longlat {
	longitude: number,
	latitude: number,
	height: number
}

export interface CurrentExtent {
	xmin: number,
	ymin: number,
	xmax: number,
	ymax: number
}

export class OpenStreetMapNominatimGeocoder implements GeocoderService {
	geocode(input: string): Promise<GeocoderResult[]> {
		const endpoint: string = 'https://nominatim.openstreetmap.org/search?';
		const query: string = 'format=json&q=' + input;
		const requestString: string = endpoint + query;
		return Cesium.loadJson(requestString)
			.then((results) => {
				let bboxDegrees;
				return results.map((resultObject) => {
					bboxDegrees = resultObject.boundingbox;
					return {
						displayName: resultObject.display_name,
						destination: Cesium.Rectangle.fromDegrees(
							bboxDegrees[2],
							bboxDegrees[0],
							bboxDegrees[3],
							bboxDegrees[1]
						)
					};
				});
			});
	}
}

@Component({
	selector: 'e-ngx-cesium',
	templateUrl: './e-ngx-cesium.component.html',
	styleUrls: ['./e-ngx-cesium.component.scss']
})
export class ENgxCesiumComponent implements OnInit, OnDestroy {
	@ViewChild('globeContainer') globeContainerRef: ElementRef;
	@ViewChild('slider') sliderRef: ElementRef;

	@Input()
	viewerOptions: ViewerOptions = {}; // 创建Cesium.Viewer的属性配置
	@Input()
	accessToken: string; // cesium ion令牌
	@Input()
	proxy: string; // 代理路径
	@Input()
	rectangle: Rectangle; // 初始范围
	@Input()
	enablePosition: boolean = false; // 启用位置信息部件
	@Input()
	enableSetting: boolean = false; // 启用效果设置部件
	@Input()
	enableCompass: boolean = true; // 启用罗盘部件
	@Input()
	enableZoomControls: boolean = true; // 启用缩放部件
	@Input()
	enableDistanceLegend: boolean = false; // 启用比例尺部件
	@Input()
	enableRollerShutters: boolean = false; // 启用卷帘对比
	@Input()
	contrastImageryProviders: ImageryProvider[]; // 卷帘对比的图层。图层显示顺序是先左边显示，然后右边显示

	@Output()
	viewerReady: EventEmitter<any> = new EventEmitter<any>(false); // 组件初始化完成事件
	@Output()
	sliderChange: EventEmitter<any> = new EventEmitter<any>(false); // 卷帘滑块位置变化事件

	private globeContainer: HTMLDivElement;
	private viewer: Viewer; // 视图
	private scene: Scene; // 三维场景
	private globe: Globe; // 三维球体
	private ellipsoid: Ellipsoid; // 三维场景的椭球体
	private defaultProxy: DefaultProxy = null;
	private defaultViewerOptions: ViewerOptions = {
		imageryProvider: new GoogleMapsImageryProvider(GoogleMapsStyle.Y),
		terrainProvider: createWorldTerrain({
			requestVertexNormals: false,
			requestWaterMask: false
		}),
		timeline: false,
		animation: false,
		baseLayerPicker: false,
		geocoder: false,
		homeButton: false,
		infoBox: false,
		selectionIndicator: false,
		navigationHelpButton: false,
		sceneModePicker: false,
		fullscreenButton: false,
		fullscreenElement: this.globeContainer // 设置viewer所在元素为全屏的元素
	};
	private getPositionActionHandler: ScreenSpaceEventHandler;
	private changeCurActionHandler: ScreenSpaceEventHandler;
	private defaultRectangle: Rectangle = Rectangle.fromDegrees(73.666667, 3.866667, 135.041667, 53.55); // 默认中国
	globeHasPan: boolean = false;
	mousePosition: CurrentPosition = null; // 鼠标位置
	isShowSettingPanel: boolean = false; // 显示设置面板
	showSkyAtmosphere: boolean = true;
	enableLighting: boolean = false;
	depthTestAgainstTerrain: boolean = false;
	showWaterEffect: boolean = true;
	enableFog: boolean = true;
	slider: HTMLDivElement;
	dragStartX: number = 0;
	sliderMove: any;
	windowMouseUp: any;

	constructor(private renderer: Renderer2) {
		this.sliderMove = (e: MouseEvent) => {
			const splitPosition: number = (e.clientX - this.dragStartX) / this.slider.parentElement.offsetWidth;
			this.renderer.setStyle(this.slider, 'left', 100.0 * splitPosition + '%');
			this.viewer.scene.imagerySplitPosition = splitPosition;
			this.sliderChange.emit(splitPosition);
		};

		this.windowMouseUp = () => {
			window.removeEventListener('mousemove', this.sliderMove, true);
		};
	}

	ngOnInit() {
		this.globeContainer = this.globeContainerRef.nativeElement;
		this.init();
	}

	ngOnDestroy() {
		if (this.enableRollerShutters) {
			window.removeEventListener('mouseup', this.windowMouseUp, false);
		}
		if (this.getPositionActionHandler) {
			this.getPositionActionHandler.destroy();
		}
		if (this.changeCurActionHandler) {
			this.changeCurActionHandler.destroy();
		}
		if (this.viewer['cesiumNavigation']) {
			this.viewer['cesiumNavigation'].destroy();
		}
		this.viewer.destroy();
	}

	/**
	 * 组件初始化
	 */
	init() {
		Ion.defaultAccessToken = this.accessToken || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NjcyZDliZC0wOGIzLTRkYTgtODMzZC02ZDgxN2JlOTFlYWMiLCJpZCI6MjU5LCJzY29wZXMiOlsiYXNyIiwiZ2MiXSwiaWF0IjoxNTM4MzI5MzgyfQ.fHaE6XzGnZtUEtSJjF_0X0HkLQyU59bGDD4-9IEePkc';
		this.defaultProxy = this.proxy && new DefaultProxy(this.proxy);
		Camera.DEFAULT_VIEW_RECTANGLE = this.rectangle || this.defaultRectangle;
		const viewerOptions: ViewerOptions = this.viewerOptions ? _.merge({}, this.defaultViewerOptions, this.viewerOptions) : this.defaultViewerOptions;
		if (viewerOptions.geocoder) {
			viewerOptions.geocoder = [new OpenStreetMapNominatimGeocoder()];
		}
		if (viewerOptions.globe === false) {
			viewerOptions.imageryProvider = null;
			viewerOptions.terrainProvider = null;
		}
		this.viewer = new Viewer(this.globeContainer, viewerOptions);
		this.scene = this.viewer.scene;
		this.globe = this.scene.globe;
		this.ellipsoid = this.globe && this.globe.ellipsoid;
		this.viewer.cesiumWidget.creditContainer['style'].display = 'none'; // 隐藏默认的版权信息
		if (this.viewer.homeButton) {
			this.viewer.homeButton.viewModel.tooltip = '初始视图';
		}
		if (this.viewer.navigationHelpButton) {
			this.viewer.navigationHelpButton.viewModel.tooltip = '导航指示';
		}
		if (this.viewer.sceneModePicker) {
			this.viewer.sceneModePicker.viewModel.tooltipColumbusView = '2.5D';
		}

		// 导航扩展（必须依赖 globe）
		if (this.globe) {
			this.viewer.extend(Cesium['viewerCesiumNavigationMixin'], {
				enableCompass: this.enableCompass,
				enableZoomControls: this.enableZoomControls,
				enableDistanceLegend: this.enableDistanceLegend,
				enableCompassOuterRing: this.enableCompass
			});
		}
		if (this.enablePosition) {
			this.setGetPositionAction();
		}
		if (this.enableRollerShutters) {
			const id: number = setTimeout(() => {
				clearTimeout(id);
				this.initContrastImageryLayers();
			});
		}
		this.setChangeCurAction();

		// 分发初始化完成事件
		this.viewerReady.emit({
			viewer: this.viewer,
			scene: this.scene,
			globe: this.globe,
			ellipsoid: this.ellipsoid
		});
	}

	/**
	 * 初始化卷帘对比的图层
	 */
	initContrastImageryLayers() {
		this.slider = this.sliderRef.nativeElement;
		window.addEventListener('mouseup', this.windowMouseUp, false);
		const layers: ImageryLayerCollection = this.viewer.imageryLayers;
		this.contrastImageryProviders.forEach((imageryProvider: ImageryProvider, index: number) => {
			const layer: ImageryLayer = layers.addImageryProvider(imageryProvider);
			layer.splitDirection = index % 2 === 0 ? ImagerySplitDirection.LEFT : ImagerySplitDirection.RIGHT;
		});
		this.scene.imagerySplitPosition = 0.5;
	}

	/**
	 * 卷帘对比的滑块按下事件
	 * @param {MouseEvent} e
	 */
	sliderMousedown(e: MouseEvent) {
		this.dragStartX = e.clientX - this.sliderRef.nativeElement.offsetLeft;
		window.addEventListener('mousemove', this.sliderMove, true);
	}

	/**
	 * 设置鼠标移动或者滚动事件动态获取鼠标点位置信息
	 */
	setGetPositionAction() {
		// 定义当前场景的画布元素的事件处理
		this.getPositionActionHandler = new ScreenSpaceEventHandler(this.scene.canvas);
		let moveEndPosition: Cartesian2;

		// 设置鼠标移动事件的处理函数，这里负责监听x,y坐标值变化
		this.getPositionActionHandler.setInputAction((move: MoveEvent) => {
			if (move.endPosition) {
				moveEndPosition = move.endPosition;
				this.mousePosition = this.getMousePointPosition(moveEndPosition) || this.mousePosition;
			}
		}, ScreenSpaceEventType.MOUSE_MOVE);

		// 设置鼠标滚动事件的处理函数，这里负责监听高度值变化
		this.getPositionActionHandler.setInputAction(() => {
			this.mousePosition.height = Math.ceil(this.viewer.camera.positionCartographic.height);
		}, ScreenSpaceEventType.WHEEL);
	}

	/**
	 * 设置改变鼠标图标的事件
	 */
	setChangeCurAction() {
		this.changeCurActionHandler = new ScreenSpaceEventHandler(this.scene.canvas);
		this.changeCurActionHandler.setInputAction(() => {
			this.globeHasPan = true;
		}, ScreenSpaceEventType.LEFT_DOWN);
		this.changeCurActionHandler.setInputAction(() => {
			this.globeHasPan = false;
		}, ScreenSpaceEventType.LEFT_UP);
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

	/**
	 * 显示设置面板
	 */
	showSettingPanel() {
		this.isShowSettingPanel = !this.isShowSettingPanel;
	}

	/**
	 * 大气渲染效果切换
	 */
	doShowSkyAtmosphere(showSkyAtmosphere?: boolean) {
		const id: number = setTimeout(() => {
			clearTimeout(id);
			this.scene.skyAtmosphere.show = defined(showSkyAtmosphere) ? showSkyAtmosphere : this.showSkyAtmosphere;
		});
	}

	/**
	 * 光照渲染效果切换
	 */
	doEnableLighting(enableLighting?: boolean) {
		const id: number = setTimeout(() => {
			clearTimeout(id);
			this.globe.enableLighting = defined(enableLighting) ? enableLighting : this.enableLighting;
		});
	}

	/**
	 * 雾化效果切换
	 */
	doEnableFog(enableFog?: boolean) {
		const id: number = setTimeout(() => {
			clearTimeout(id);
			this.scene.fog.enabled = defined(enableFog) ? enableFog : this.enableFog;
		});
	}

	/**
	 * 波浪效果切换
	 */
	doShowWaterEffect(showWaterEffect?: boolean) {
		const id: number = setTimeout(() => {
			clearTimeout(id);
			this.globe.showWaterEffect = defined(showWaterEffect) ? showWaterEffect : this.showWaterEffect;
		});
	}

	/**
	 * 深度监测切换
	 */
	doDepthTestAgainstTerrain(depthTestAgainstTerrain?: boolean) {
		const id: number = setTimeout(() => {
			clearTimeout(id);
			this.globe.depthTestAgainstTerrain = defined(depthTestAgainstTerrain) ? depthTestAgainstTerrain : this.depthTestAgainstTerrain;
		});
	}

	/**
	 * 获取高程值（单位：米）
	 * @param {Cesium.Cartographic} cartographic
	 * @param {Cesium.Globe} globe
	 * @returns {number}
	 */
	getElevation(cartographic: Cartographic, globe: Globe): number {
		return globe.getHeight(cartographic)
	}

	/**
	 * 获取相机高度（单位：米）
	 * @param {Cesium.Camera} camera
	 * @returns {number}
	 */
	getCameraHeight(camera: Camera): number {
		return camera.positionCartographic.height
	}

	/**
	 * 屏幕坐标转笛卡尔坐标
	 * @param {Cesium.Cartesian2} windowPosition
	 * @param {Cesium.Viewer} viewer
	 * @returns {Cesium.Cartesian3}
	 */
	window2cartesian(windowPosition: Cartesian2, viewer: Viewer): Cartesian3 {
		// return viewer.scene.globe.pick(viewer.camera.getPickRay(windowPosition), viewer.scene); // 只适用于3D模式
		return viewer.camera.pickEllipsoid(windowPosition, viewer.scene.globe.ellipsoid);
	}

	/**
	 * 笛卡尔坐标转地理坐标（单位：弧度）
	 * @param {Cesium.Cartesian3} cartesian
	 * @returns {Cesium.Cartographic}
	 */
	cartesian2cartographic(cartesian: Cartesian3): Cartographic {
		// return viewer.scene.globe.ellipsoid.cartesianToCartographic(worldPoint);
		return Cartographic.fromCartesian(cartesian);
	}

	/**
	 * 笛卡尔坐标转屏幕坐标（单位：像素）
	 * @param {Cesium.Cartesian3} cartesian
	 * @param {Cesium.Scene} scene
	 * @returns {Cesium.Cartesian2}
	 */
	cartesian2window(cartesian: Cartesian3, scene: Scene): Cartesian2 {
		return SceneTransforms.wgs84ToWindowCoordinates(scene, cartesian)
	}

	/**
	 * 地理坐标（弧度）转经纬度坐标（单位：角度）
	 * @param {Cesium.Cartographic} cartographic
	 * @returns {Longlat}
	 */
	cartographic2longlat(cartographic: Cartographic): Longlat {
		return {
			longitude: Cesium.Math.toDegrees(cartographic.longitude),
			latitude: Cesium.Math.toDegrees(cartographic.latitude),
			height: cartographic.height
		}
	}

	/**
	 * 地理坐标（弧度）转笛卡尔坐标
	 * @param {Cesium.Cartographic} cartographic
	 * @param {Cesium.Ellipsoid} ellipsoid
	 * @returns {Cesium.Cartesian3}
	 */
	cartographic2cartesian(cartographic: Cartographic, ellipsoid: Ellipsoid): Cartesian3 {
		return ellipsoid.cartographicToCartesian(cartographic);
	}

	/**
	 * 经纬度坐标转地理坐标（单位：弧度）
	 * @param {Longlat} longlat
	 * @returns {Cesium.Cartographic}
	 */
	longlat2cartographic(longlat: Longlat): Cartographic {
		return Cartographic.fromDegrees(longlat.longitude, longlat.latitude, longlat.height);
	}

	/**
	 * 经纬度坐标转笛卡尔坐标
	 * @param {Longlat} longlat
	 * @param {Cesium.Ellipsoid} ellipsoid
	 * @returns {Cesium.Cartesian3}
	 */
	longlat2cartesian(longlat: Longlat, ellipsoid: Ellipsoid): Cartesian3 {
		return Cartesian3.fromDegrees(longlat.longitude, longlat.latitude, longlat.height, ellipsoid);
	}

	/**
	 * 获取当前视口范围
	 * @param {Cesium.Viewer} viewer
	 * @returns {CurrentExtent}
	 */
	getCurrentExtent(viewer: Viewer): CurrentExtent {
		viewer.trackedEntity = null;
		const pt1: Cartesian2 = new Cartesian2(0, 0);
		const pt2: Cartesian2 = new Cartesian2(viewer.canvas.width, viewer.canvas.height);
		const pick1: Cartesian3 = this.window2cartesian(pt1, viewer);
		const pick2: Cartesian3 = this.window2cartesian(pt2, viewer);
		if (pick1 && pick2) {
			const geoPt1: Cartographic = this.cartesian2cartographic(pick1);
			const geoPt2: Cartographic = this.cartesian2cartographic(pick2);
			const point1: Longlat = this.cartographic2longlat(geoPt1);
			const point2: Longlat = this.cartographic2longlat(geoPt2);
			return {
				xmin: point1.longitude,
				ymin: point2.latitude,
				xmax: point2.longitude,
				ymax: point1.latitude
			};
		}
	}

	NoAccessUnderground() {
		let mousePosition, startMousePosition;
		const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
		handler.setInputAction((evt) => {
			mousePosition = startMousePosition = Cesium.Cartesian3.clone(evt['position']);
			handler.setInputAction((moveEvent: MoveEvent) => {
				mousePosition = moveEvent.endPosition;
				const y = mousePosition.y - startMousePosition.y;
				if (y > 0) {
					this.viewer.scene.screenSpaceCameraController.enableTilt = true;
				}
			}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
		}, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);
	}
}

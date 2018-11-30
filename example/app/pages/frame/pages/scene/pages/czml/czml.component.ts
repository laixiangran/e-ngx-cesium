import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ENgxCesiumComponent } from '../../../../../../../../src';
import ViewerOptions = Cesium.ViewerOptions;
import Viewer = Cesium.Viewer;
import Scene = Cesium.Scene;
import Globe = Cesium.Globe;
import CzmlDataSource = Cesium.CzmlDataSource;
import Cartesian3 = Cesium.Cartesian3;
import PositionedEvent = Cesium.PositionedEvent;
import MoveEvent = Cesium.MoveEvent;
import PlaneGraphics = Cesium.PlaneGraphics;
import CallbackProperty = Cesium.CallbackProperty;
import Cartesian2 = Cesium.Cartesian2;
import Color = Cesium.Color;
import Plane = Cesium.Plane;
import ScreenSpaceEventHandler = Cesium.ScreenSpaceEventHandler;
import defined = Cesium.defined;
import ScreenSpaceEventType = Cesium.ScreenSpaceEventType;
import Entity = Cesium.Entity;
import SingleTileImageryProvider = Cesium.SingleTileImageryProvider;
import SkyBox = Cesium.SkyBox;
import Cartographic = Cesium.Cartographic;

@Component({
	templateUrl: './czml.component.html',
	styleUrls: ['./czml.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CZMLComponent implements OnInit, OnDestroy {
	@ViewChild('eNgxCesium') eNgxCesium: ENgxCesiumComponent;
	viewerOptions: ViewerOptions;
	viewer: Viewer;
	scene: Scene;
	globe: Globe;
	coords: any[] = [];
	coords2: any[] = [];
	layerColor: any = {
		1: [169, 169, 0, 255],
		2: [84, 255, 126, 255],
		3: [255, 255, 0, 255],
		4: [0, 255, 126, 255],
		5: [255, 255, 126, 255],
		6: [0, 255, 0, 255]
	};
	distance: number = 0.0; // 剪切面偏移距离
	clipStyle = {
		X: 'x', // 水平切
		Z: 'z' // 垂直切
	};
	currClipStyle: string; // 当前生成的剪切面类型，对应 clipStyle
	timeoutId = null;
	initCartesian3: Cartesian3;

	constructor(public http: HttpClient) {
		// requestRenderMode、maximumRenderTimeChange 的使用参考文章（使用显式渲染提高性能）：https://cesium.com/blog/2018/01/24/cesium-scene-rendering-performance/
		this.viewerOptions = {
			imageryProvider: new SingleTileImageryProvider({
				url: './assets/images/worldimage_black.jpg'
			}),
			skyBox: new SkyBox({
				show: false
			}),
			requestRenderMode: true, // 渲染帧仅在需要时才会发生，具体取决于场景中的更改。启用（true）可以提高应用程序的性能
			maximumRenderTimeChange: Infinity // 请求新渲染帧的模拟时间间隔
		};
	}

	ngOnInit() {
	}

	ngOnDestroy() {
	}

	onViewerReady(evt: any) {
		this.viewer = evt.viewer;
		this.scene = evt.scene;
		this.globe = evt.globe;
		this.eNgxCesium.doShowSkyAtmosphere(false);
		this.eNgxCesium.doEnableFog(false);
		this.calcData();
		this.initClipPlaneEvents();
	}

	/**
	 * 创建剪切面
	 * @param {string} style
	 */
	createClipPlane(style: string) {
		this.viewer.entities.removeById(this.currClipStyle + '-clip-plane');
		this.currClipStyle = style;
		this.distance = 0.0;
		let normal;
		if (style === this.clipStyle.X) {
			this.initCartesian3 = Cartesian3.fromDegrees(116.029315, 40.087886, 745.43);
			normal = new Cartesian3(1.0, -0.3, 0.0); // 水平切
		} else if (style === this.clipStyle.Z) {
			this.initCartesian3 = Cartesian3.fromDegrees(116.227542, 40.025827, 0);
			this.distance = 15000;
			normal = new Cartesian3(0.0, 0.0, -1.0); // 垂直切
		}
		const plan = new Plane(normal, 0.0);
		this.viewer.entities.add({
			id: style + '-clip-plane',
			name: 'clip plane',
			position: this.initCartesian3,
			plane: new PlaneGraphics({
				plane: new CallbackProperty(this.updateClipPlane(plan), false),
				dimensions: new Cartesian2(35000.0, 35000.0),
				material: Color.WHITE.withAlpha(0.2),
				outline: true,
				outlineColor: Color.WHITE
			})
		});
		this.scene.requestRender(); // 手动触发重新渲染
	}

	/**
	 * 初始化剪切面事件
	 */
	initClipPlaneEvents() {
		let selectedClipPlane;

		// 鼠标左键按下时选择剪切面
		const downHandler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);
		downHandler.setInputAction((movement: PositionedEvent) => {
			const pickedObject = this.scene.pick(movement.position);
			if (defined(pickedObject) && defined(pickedObject.id) && defined(pickedObject.id.plane)) {
				selectedClipPlane = pickedObject.id.plane;
				selectedClipPlane.material = Color.WHITE.withAlpha(0.1);
				selectedClipPlane.outlineColor = Color.WHITE;
				this.scene.screenSpaceCameraController.enableInputs = false;
			}
		}, ScreenSpaceEventType.LEFT_DOWN);

		// 鼠标左键松开时选择剪切面
		const upHandler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);
		upHandler.setInputAction(() => {
			if (defined(selectedClipPlane)) {
				selectedClipPlane.material = Color.WHITE.withAlpha(0.2);
				selectedClipPlane.outlineColor = Color.WHITE;
				selectedClipPlane = undefined;
			}
			this.scene.screenSpaceCameraController.enableInputs = true;
		}, ScreenSpaceEventType.LEFT_UP);

		// 鼠标左键按下并移动时移动剪切面
		const moveHandler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);
		moveHandler.setInputAction((movement: MoveEvent) => {
			if (defined(selectedClipPlane)) {
				const endPosition = this.eNgxCesium.window2cartesian(movement.endPosition, this.viewer);
				let delta;
				if (this.currClipStyle === this.clipStyle.X) {
					delta = endPosition.x;
					this.distance =  endPosition.x - this.initCartesian3.x;
				} else {
					delta = endPosition.z;
					this.distance +=  (movement.startPosition.y - movement.endPosition.y) * 50;
				}

				// 减少更新的频率
				if (!this.timeoutId) {
					this.timeoutId = setTimeout(() => {
						clearTimeout(this.timeoutId);
						this.timeoutId = null;
						this.hidePolygon(delta);
					}, 200);
				}
			}
		}, ScreenSpaceEventType.MOUSE_MOVE);
	}

	/**
	 * 设置 PlaneGraphics 中的 plane 时每次执行的函数
	 * @param plane Plane
	 * @returns {() => any}
	 */
	updateClipPlane(plane: Plane) {
		return () => {
			plane.distance = this.distance;
			return plane;
		};
	}

	calcData() {
		const allPromise = [];
		for (let i = 0; i < 6; i++) {
			allPromise.push(this.getCZMLData(i + 1));
		}
		Promise.all(allPromise).then((datas) => {
			datas.forEach((data) => {
				this.coords.unshift(data[0]); // 点高度都为正
				this.coords2.push(data[1]); // 点高度大部分为负（有一小部分为正，忽略这一点偏差）
			});
			this.showLayer(0);
		});
	}

	getCZMLData(currIndex): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			const headers = new HttpHeaders({
					'Content-Type': 'application/json'
				}),
				options = {headers: headers};
			this.http.get(`./assets/data/layer_${currIndex}.json`, options).subscribe((datas: any) => {
				const rings: any[] = [];
				const rings2: any[] = [];
				datas.forEach((data) => {
					const isUp = data.every((d) => {
						return d[2] >= 0;
					});
					const coe = 20; // 放大系数
					if (isUp) {
						rings2.push([]);
						rings.push(data.reduce((cur, pre) => {
							pre[2] *= coe;
							return cur.concat(pre);
						}, []));
					} else {
						rings.push([]);
						rings2.push(data.reduce((cur, pre) => {
							pre[2] *= coe;
							return cur.concat(pre);
						}, []));
					}
				});
				resolve([rings, rings2]);
			}, (error: any) => {
				reject(error);
			});
		});
	}

	showLayer(layerIndex?: number): Promise<any> {
		const allPromise = [];
		if (typeof layerIndex === 'number') {
			allPromise.push(this.addCZML(this.coords[5 - layerIndex], 5 - layerIndex, 1));
			allPromise.push(this.addCZML(this.coords2[layerIndex], layerIndex, 2));
		} else {
			this.viewer.dataSources.removeAll();
			this.coords.forEach((coord, index) => {
				allPromise.push(this.addCZML(coord, index, 1));
			});
			this.coords2.forEach((coord, index) => {
				allPromise.push(this.addCZML(coord, index, 2));
			});
		}
		const startTime = Date.now();
		return Promise.all(allPromise).then(() => {
			const endTime = Date.now();
			console.log(`加载完成，共耗时 ${endTime - startTime} ms`);
		});
	}

	addCZML(coords: any[], layerIndex: number, partIndex: number): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			const polygonCZML: any[] = [{
				'id': 'document',
				'name': 'Haidian groundwater',
				'version': '1.0'
			}];
			coords.forEach((coord, index) => {
				if (coord.length > 0) {
					const preLayerIndex = layerIndex - 1;
					let extrudedHeight = 0;
					let preCoord;
					let cacleExtrudedHeight;
					if (partIndex === 1) {
						preCoord = this.coords[preLayerIndex];
						cacleExtrudedHeight = Math.min;
					} else {
						preCoord = this.coords2[preLayerIndex];
						cacleExtrudedHeight = Math.max;
					}
					if (layerIndex > 0) {
						if (preCoord.length > 0) {
							const c = preCoord[index];
							if (c && c.length > 0) {
								extrudedHeight = cacleExtrudedHeight(c[2], c[5], c[8]);
							}
						}
					}
					const py = {
						'id': `${partIndex}_${partIndex === 1 ? 6 - layerIndex : layerIndex + 1}_${index}`,
						'name': `${partIndex}_${partIndex === 1 ? 6 - layerIndex : layerIndex + 1}_${index}`,
						'polygon': {
							'positions': {
								'cartographicDegrees': coord
							},
							'material': {
								'solidColor': {
									'color': {
										'rgba': this.layerColor[partIndex === 1 ? 6 - layerIndex : layerIndex + 1]
									}
								}
							},
							'extrudedHeight': extrudedHeight,
							'perPositionHeight': true,
							'outline': false,
							'outlineColor': {
								'rgba': [255, 255, 255, 10]
							}
						}
					};
					polygonCZML.push(py);
				}
			});
			if (polygonCZML.length > 1) {
				const dataSourcePromise: Promise<CzmlDataSource> = CzmlDataSource.load(polygonCZML);
				this.viewer.dataSources.add(dataSourcePromise);
				this.viewer.zoomTo(dataSourcePromise).then(() => {
					resolve();
				}, (error) => {
					reject();
					throw error;
				});
			} else {
				resolve();
			}
		});
	}

	hidePolygon(delta: number) {
		for (let i = 0; i < this.viewer.dataSources.length; i++) {
			this.viewer.dataSources.get(i).entities.values.forEach((entity: Entity) => {
				entity.show = entity.polygon.hierarchy.getValue().every((value: Cartesian3, index: number) => {
					if (this.currClipStyle === this.clipStyle.X) {
						return value.x <= delta;
					} else if (this.currClipStyle === this.clipStyle.Z) {
						return value.z <= delta;
					}
				});
			});
		}
		this.scene.requestRender(); // 手动触发重新渲染
	}
}

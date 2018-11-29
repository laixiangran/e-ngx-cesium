import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import ViewerOptions = Cesium.ViewerOptions;
import Viewer = Cesium.Viewer;
import Scene = Cesium.Scene;
import Globe = Cesium.Globe;
import CzmlDataSource = Cesium.CzmlDataSource;
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
	templateUrl: './czml.component.html',
	styleUrls: ['./czml.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CZMLComponent implements OnInit, OnDestroy {
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
	// layerColor: any = {
	// 	1: [244, 67, 54, 255],
	// 	2: [156, 39, 176, 255],
	// 	3: [103, 58, 183, 255],
	// 	4: [33, 150, 243, 255],
	// 	5: [0, 150, 136, 255],
	// 	6: [255, 193, 7, 255]
	// };

	constructor(public http: HttpClient) {
		this.viewerOptions = {
			globe: false
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
		this.calcData();
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

			// TODO 测试
			const allPromise1 = [];
			this.coords.forEach((coord, index) => {
				if (index < 3) {
					allPromise1.push(this.addCZML(coord, index, 1));
				}
			});
			this.coords2.forEach((coord, index) => {
				if (index < 3) {
					allPromise1.push(this.addCZML(coord, index, 2));
				}
			});
			const startTime = Date.now();
			Promise.all(allPromise1).then(() => {
				const endTime = Date.now();
				console.log(`加载完成，共耗时 ${endTime - startTime} ms`);
			});
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
					const coe = 20;
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

	showLayer(layerIndex?: number) {
		this.viewer.dataSources.removeAll();
		const allPromise = [];
		if (typeof layerIndex === 'number') {
			allPromise.push(this.addCZML(this.coords[5 - layerIndex], 5 - layerIndex, 1));
			allPromise.push(this.addCZML(this.coords2[layerIndex], layerIndex, 2));
		} else {
			this.coords.forEach((coord, index) => {
				allPromise.push(this.addCZML(coord, index, 1));
			});
			this.coords2.forEach((coord, index) => {
				allPromise.push(this.addCZML(coord, index, 2));
			});
		}
		const startTime = Date.now();
		Promise.all(allPromise).then(() => {
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

	showAll() {
		console.log(this.viewer.dataSources);
	}
}

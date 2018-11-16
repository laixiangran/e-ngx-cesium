import { Component, OnInit } from '@angular/core';
import ViewerOptions = Cesium.ViewerOptions;
import Viewer = Cesium.Viewer;
import Scene = Cesium.Scene;
import Globe = Cesium.Globe;
import CzmlDataSource = Cesium.CzmlDataSource;
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
	templateUrl: './czml.component.html',
	styleUrls: ['./czml.component.scss']
})
export class CZMLComponent implements OnInit {
	viewerOptions: ViewerOptions;
	viewer: Viewer;
	scene: Scene;
	globe: Globe;
	coords: any[] = [];
	layerColor: any = {
		1: [169, 169, 0, 255],
		2: [84, 255, 126, 255],
		3: [255, 255, 0, 255],
		4: [0, 255, 126, 255],
		5: [255, 255, 126, 255],
		6: [0, 255, 0, 255]
	};

	constructor(public http: HttpClient) {
		this.viewerOptions = {
			globe: false
		};
	}

	ngOnInit() {
	}

	onViewerReady(evt: any) {
		this.viewer = evt.viewer;
		this.scene = evt.scene;
		this.globe = evt.globe;
		this.getCZMLData().then((data: any) => {
			this.coords = data;
			this.addCZML(data);
		});
	}

	getCZMLData(): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			const headers = new HttpHeaders({
					'Content-Type': 'application/json'
				}),
				options = {headers: headers};
			this.http.get('./assets/json/layer_1.json', options).subscribe((data: any) => {
				const features: any = data.features;
				const coords: any[] = [];
				features.forEach((feature) => {
					const rings: number[] = [];
					feature.geometry.rings[0].forEach((ring, index) => {
						if (index < 3) {
							ring[2] = ring[2] * 5;
							[].push.apply(rings, ring);
						}
					});
					coords.push(rings);
				});
				resolve(coords);
			}, (error: any) => {
				reject(error);
			});
		});
	}

	addCZML(coords: any[], top: boolean = false) {
		const polygonCZML: any[] = [{
			'id': 'document',
			'name': 'CZML Geometries: Polygon',
			'version': '1.0'
		}];
		coords.forEach((coord, index) => {
			const py = {
				'id': top ? 'top' + index : 'bottom' + index,
				'name': top ? 'top' + index : 'bottom' + index,
				'polygon': {
					'positions': {
						'cartographicDegrees': coord
					},
					'material': {
						'solidColor': {
							'color': {
								'rgba': this.layerColor['1']
							}
						}
					},
					'extrudedHeight': 0,
					'perPositionHeight': true,
					'outline': true,
					'outlineColor': {
						'rgba': [255, 255, 255, 50]
					}
				}
			};
			polygonCZML.push(py);
		});
		const start = new Date().getTime();
		const dataSourcePromise: Promise<CzmlDataSource> = CzmlDataSource.load(polygonCZML);
		this.viewer.dataSources.add(dataSourcePromise);
		this.viewer.zoomTo(dataSourcePromise).then(() => {
			const end = new Date().getTime();
			console.log(end - start);
		});
	}
}

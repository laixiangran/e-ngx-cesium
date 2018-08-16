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
	coords2: any[] = [];

	constructor(public http: HttpClient) {
		this.viewerOptions = {
			imageryProvider: null
		};
	}

	ngOnInit() {
	}

	onViewerReady(evt: any) {
		this.viewer = evt.viewer;
		this.scene = evt.scene;
		this.globe = evt.globe;
		this.getCZMLData().then((data: any) => {
			this.coords = data[0];
			this.coords2 = data[1];
			this.addCZML(this.coords, true);
		});
	}

	getCZMLData(): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			const headers = new HttpHeaders({
					'Content-Type': 'application/json'
				}),
				options = {headers: headers};
			this.http.get('./assets/json/ElementNodes_1984.json', options).subscribe((data: any) => {
				const geos: any = data.objects['ElementNodes_1984'].geometries;
				const coords: any[] = [];
				const coords2: any[] = [];
				geos.forEach((geo, index) => {
					if (!coords[geo.properties.Element]) {
						coords[geo.properties.Element] = [];
					}
					if (!coords2[geo.properties.Element]) {
						coords2[geo.properties.Element] = [];
					}
					geo.coordinates[2] = geo.coordinates[2] * 10;
					if (coords[geo.properties.Element].length < 9) {
						[].push.apply(coords[geo.properties.Element], geo.coordinates.slice(0, 3));
					} else {
						[].push.apply(coords2[geo.properties.Element], geo.coordinates.slice(0, 3));
					}
				});
				resolve([coords, coords2]);
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
								'rgba': [55, 96, 151, 255]
							}
						}
					},
					'extrudedHeight': 0,
					'perPositionHeight': true,
					'outline': true,
					'outlineColor': {
						'rgba': [255, 255, 255, 10]
					}
				}
			};
			polygonCZML.push(py);
		});
		const start = new Date().getTime();
		// this.viewer.dataSources.removeAll(true);
		const dataSourcePromise: Promise<CzmlDataSource> = CzmlDataSource.load(polygonCZML);
		this.viewer.dataSources.add(dataSourcePromise);
		this.viewer.zoomTo(dataSourcePromise).then(() => {
			const end = new Date().getTime();
			console.log(end - start);
		});
	}
}

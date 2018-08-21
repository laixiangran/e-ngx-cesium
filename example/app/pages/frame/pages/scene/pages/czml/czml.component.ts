import { Component, OnInit } from '@angular/core';
import ViewerOptions = Cesium.ViewerOptions;
import Viewer = Cesium.Viewer;
import Scene = Cesium.Scene;
import Globe = Cesium.Globe;
import CzmlDataSource = Cesium.CzmlDataSource;

@Component({
	templateUrl: './czml.component.html',
	styleUrls: ['./czml.component.scss']
})
export class CZMLComponent implements OnInit {
	viewerOptions: ViewerOptions;
	viewer: Viewer;
	scene: Scene;
	globe: Globe;

	constructor() {
	}

	ngOnInit() {
	}

	onViewerReady(evt: any) {
		this.viewer = evt.viewer;
		this.scene = evt.scene;
		this.globe = evt.globe;
		this.addCZML();
	}

	addCZML() {
		const czml = [{
			'id': 'document',
			'name': 'box',
			'version': '1.0'
		}, {
			'id': 'shape1',
			'name': 'Blue box',
			'position': {
				'cartographicDegrees': [-114.0, 40.0, 300000.0]
			},
			'box': {
				'dimensions': {
					'cartesian': [400000.0, 300000.0, 500000.0]
				},
				'material': {
					'solidColor': {
						'color': {
							'rgba': [0, 0, 255, 255]
						}
					}
				}
			}
		}, {
			'id': 'shape2',
			'name': 'Red box with black outline',
			'position': {
				'cartographicDegrees': [-107.0, 40.0, 300000.0]
			},
			'box': {
				'dimensions': {
					'cartesian': [400000.0, 300000.0, 500000.0]
				},
				'material': {
					'solidColor': {
						'color': {
							'rgba': [255, 0, 0, 128]
						}
					}
				},
				'outline': true,
				'outlineColor': {
					'rgba': [0, 0, 0, 255]
				}
			}
		}, {
			'id': 'shape3',
			'name': 'Yellow box outline',
			'position': {
				'cartographicDegrees': [-100.0, 40.0, 300000.0]
			},
			'box': {
				'dimensions': {
					'cartesian': [400000.0, 300000.0, 500000.0]
				},
				'fill': false,
				'outline': true,
				'outlineColor': {
					'rgba': [255, 255, 0, 255]
				}
			}
		}];
		CzmlDataSource.load(czml).then((czmlDataSource: CzmlDataSource) => {
			this.viewer.dataSources.add(czmlDataSource);
			this.viewer.zoomTo(czmlDataSource);
		});
	}
}

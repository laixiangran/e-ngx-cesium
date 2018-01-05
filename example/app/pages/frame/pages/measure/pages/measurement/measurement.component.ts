import { Component, OnInit } from '@angular/core';
import ViewerOptions = Cesium.ViewerOptions;
import Viewer = Cesium.Viewer;
import Scene = Cesium.Scene;
import Globe = Cesium.Globe;
import { SelectItem } from 'primeng/primeng';
import Cartesian3 = Cesium.Cartesian3;
import Cartographic = Cesium.Cartographic;
import sampleTerrain = Cesium.sampleTerrain;
import Entity = Cesium.Entity;
import PolylineGraphics = Cesium.PolylineGraphics;

@Component({
	templateUrl: './measurement.component.html',
	styleUrls: ['./measurement.component.scss']
})
export class MeasurementComponent implements OnInit {
	viewerOptions: ViewerOptions;
	viewer: Viewer;
	scene: Scene;
	globe: Globe;
	modes: SelectItem[];

	constructor() {
		this.modes = [
			{label: '--选择测量模式--', value: null},
			{label: '空间测量', value: 'space'},
			{label: '贴地测量', value: 'affixedTo'}
		];
	}

	ngOnInit() {
	}

	onViewerReady(evt: any) {
		this.viewer = evt.viewer;
		this.scene = evt.scene;
		this.globe = evt.globe;
		this.viewer.scene.camera.setView({
			destination: new Cartesian3(317341.1198994921, 5642696.778815073, 2961682.3300576834),
			orientation: {
				heading: 0.34555839949062594,
				pitch: -0.1422794351856307,
				roll: 0.0009471063581933947
			}
		});
	}

	/**
	 * 测距
	 */
	rangeFinding() {
		const positions: Cartesian3[] = Cartesian3.fromDegreesArray([-115, 35, -114, 36]);
		const flatPositions: number[] = Cesium['PolylinePipeline'].generateArc({
			positions: positions,
			granularity: 0.000001
		});
		console.log(flatPositions);
		const cartographicArray: Cartographic[] = [];
		for (let i = 0; i < flatPositions.length; i += 3) {
			const cartesian: Cartesian3 = Cesium.Cartesian3.unpack(flatPositions, i);
			cartographicArray.push(this.globe.ellipsoid.cartesianToCartographic(cartesian));
		}
		sampleTerrain(this.viewer.terrainProvider, 15, cartographicArray)
			.then((raisedPositionsCartograhpic) => {
				const raisedPositions: Cartesian3[] = this.globe.ellipsoid.cartographicArrayToCartesianArray(raisedPositionsCartograhpic);
				console.log(raisedPositions);
				this.viewer.entities.add(new Entity({
					polyline: new PolylineGraphics({
						positions: raisedPositions,
						width: 5,
						material: Cesium.Color.RED
					})
				}));
				this.viewer.zoomTo(this.viewer.entities);
			});
	}

	/**
	 * 清除
	 */
	clear() {

	}

	/**
	 * 测量模式切换
	 * @param $event
	 */
	modeChange($event) {

	}
}

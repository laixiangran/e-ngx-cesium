import { Component, OnInit, ViewChild } from '@angular/core';
import ViewerOptions = Cesium.ViewerOptions;
import Viewer = Cesium.Viewer;
import Globe = Cesium.Globe;
import Scene = Cesium.Scene;
import GeometryInstance = Cesium.GeometryInstance;
import Primitive = Cesium.Primitive;
import PrimitiveCollection = Cesium.PrimitiveCollection;
import EllipsoidSurfaceAppearance = Cesium.EllipsoidSurfaceAppearance;
import Material = Cesium.Material;
import RectangleGeometry = Cesium.RectangleGeometry;
import Rectangle = Cesium.Rectangle;
import { SelectItem } from 'primeng/primeng';
import PolygonGeometry = Cesium.PolygonGeometry;
import PolygonHierarchy = Cesium.PolygonHierarchy;
import Cartesian3 = Cesium.Cartesian3;
import ArcGisMapServerImageryProvider = Cesium.ArcGisMapServerImageryProvider;
import { ENgxCesiumComponent } from '../../../../../../../../src';
import Cartographic = Cesium.Cartographic;

@Component({
	selector: 'dynamic-water',
	templateUrl: './dynamic-water.component.html',
	styleUrls: ['./dynamic-water.component.scss']
})
export class DynamicWaterComponent implements OnInit {
	@ViewChild('eNgxCesium') eNgxCesium: ENgxCesiumComponent;
	viewerOptions: ViewerOptions;
	viewer: Viewer;
	scene: Scene;
	globe: Globe;
	dynamicWaterCollection: PrimitiveCollection;
	modes: SelectItem[];
	selectedMode: string;

	constructor() {
		this.modes = [
			{ label: '--选择加载方式--', value: null },
			{ label: '全球加载', value: 'globe' },
			{ label: '区域加载', value: 'area' }
		];
		this.viewerOptions = {
			imageryProvider: new ArcGisMapServerImageryProvider({
				url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
			})
		};
	}

	ngOnInit() {
	}

	onViewerReady(evt: any) {
		this.viewer = evt.viewer;
		this.scene = evt.scene;
		this.globe = evt.globe;
	}

	modeChange($event) {
		if (this.dynamicWaterCollection) {
			this.removeWaterMaterial(this.dynamicWaterCollection, this.scene);
		}
		const mode: string = $event.value;
		if (mode === 'globe') {
			this.viewer.camera.flyHome();
			this.dynamicWaterCollection = this.applyWaterMaterialWorld(this.scene);
		} else if (mode === 'area') {
			this.viewer.camera.flyTo({
				destination : Cesium.Cartesian3.fromDegrees(111.492615, 32.557921, 2000)
			});
			const coordinates: number[] = [111.48894522023063, 32.55843610413914, 111.48869238776277, 32.55602570974643, 111.49004745721604, 32.5548361448687, 111.49250635559537, 32.5526581917131, 111.49401017612676, 32.55129837476868, 111.49557557543416, 32.549965127681524, 111.49805874806115, 32.550219820173126, 111.49881935514881, 32.550823388219456, 111.49893286824275, 32.55195597852755, 111.4983164393889, 32.5535655841798, 111.49817521853979, 32.554570336381104, 111.49914284747027, 32.55554277243855, 111.49967950821859, 32.555814392110264, 111.50062151969038, 32.556517275179836, 111.50149914222958, 32.55731250438687, 111.50207800636986, 32.55757396515373, 111.50386396090245, 32.55781206769338, 111.50391371888884, 32.559650818164926, 111.50077307397399, 32.56013340913413, 111.49625702141412, 32.560250133340446, 111.49171532588734, 32.560183453792156, 111.48920373670329, 32.56015020231049, 111.48844043918616, 32.55981856869106, 111.48743657311691, 32.55945303779285, 111.48760383414758, 32.55863069835514, 111.48812831262538, 32.55837951411848];
			this.dynamicWaterCollection = this.applyWaterMaterial(coordinates, this.scene);
		}
	}

	/**
	 * 全球加载动态水效果
	 * @param {Cesium.Scene} waterScene
	 * @returns {Cesium.PrimitiveCollection}
	 */
	applyWaterMaterialWorld(waterScene: Scene): PrimitiveCollection {
		return waterScene.primitives.add(new Primitive({
			geometryInstances: new GeometryInstance({
				geometry: new RectangleGeometry({
					rectangle: Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0),
					vertexFormat: EllipsoidSurfaceAppearance.VERTEX_FORMAT
				})
			}),
			appearance: new EllipsoidSurfaceAppearance({
				aboveGround: false,
				material: new Material({
					fabric: {
						type: 'Water',
						uniforms: {
							specularMap: './assets/images/earthspec1k.jpg',
							normalMap: './assets/images/waterNormals.jpg',
							frequency: 10000.0,
							animationSpeed: 0.01,
							amplitude: 1.0
						}
					}
				})
			}),
			show: true
		}))
	}

	/**
	 * 指定区域加载动态水效果
	 * @param {number[]} coordinates 面所有的点坐标
	 * @param {Cesium.Scene} waterScene
	 * @returns {Cesium.PrimitiveCollection}
	 */
	applyWaterMaterial(coordinates: number[], waterScene: Scene): PrimitiveCollection {
		const coordinates_temp: number[] = JSON.parse(JSON.stringify(coordinates));
		for (let i = 0; i < coordinates_temp.length; i = i + 3) {
			const cartographic: Cartographic = this.eNgxCesium.longlat2cartographic({
				longitude: coordinates_temp[i],
				latitude: coordinates_temp[i + 1],
				height: 0
			});
			coordinates_temp.splice(i + 2, 0, this.eNgxCesium.getElevation(cartographic, this.globe));
		}
		console.log(coordinates_temp);
		return waterScene.primitives.add(new Primitive({
			geometryInstances: new GeometryInstance({
				geometry: new PolygonGeometry({
					polygonHierarchy: new PolygonHierarchy(
						Cartesian3.fromDegreesArrayHeights(coordinates_temp)
						// Cartesian3.fromDegreesArray(coordinates_temp)
					),
					vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
				})
			}),
			appearance: new EllipsoidSurfaceAppearance({
				aboveGround: false,
				material: new Material({
					fabric: {
						type: 'Water',
						uniforms: {
							normalMap: './assets/images/waterNormals.jpg',
							frequency: 10000.0,
							animationSpeed: 0.01,
							amplitude: 5
						}
					}
				})
			}),
			show: true
		}))
	}

	/**
	 * 移除动态水效果
	 * @param {Cesium.PrimitiveCollection} dynamicWaterCollection
	 * @param {Cesium.Scene} waterScene
	 */
	removeWaterMaterial(dynamicWaterCollection: PrimitiveCollection, waterScene: Scene) {
		waterScene.primitives.remove(dynamicWaterCollection)
	}
}

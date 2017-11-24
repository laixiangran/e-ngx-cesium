import { Component } from '@angular/core';
import ViewerOptions = Cesium.ViewerOptions;
import Viewer = Cesium.Viewer;
import Globe = Cesium.Globe;
import Scene = Cesium.Scene;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	viewerOptions: ViewerOptions;
	viewer: Viewer;
	scene: Scene;
	globe: Globe;
	enableLighting: boolean = false;
	depthTestAgainstTerrain: boolean = false;
	showWaterEffect: boolean = true;

	constructor() {
	}

	onViewerReady(evt: any) {
		this.viewer = evt.viewer;
		this.scene = evt.scene;
		this.globe = evt.globe;
	}

	doSkyAtmosphere() {
		const id: number = setTimeout(() => {
			clearTimeout(id);
			// this.scene.skyAtmosphere = this.enableLighting;
		});
	}

	doEnableLighting() {
		const id: number = setTimeout(() => {
			clearTimeout(id);
			this.globe.enableLighting = this.enableLighting;
		});
	}

	doDepthTestAgainstTerrain() {
		const id: number = setTimeout(() => {
			clearTimeout(id);
			this.globe.depthTestAgainstTerrain = this.depthTestAgainstTerrain;
		});
	}

	doShowWaterEffect() {
		const id: number = setTimeout(() => {
			clearTimeout(id);
			this.globe.showWaterEffect = this.showWaterEffect;
		});
	}
}

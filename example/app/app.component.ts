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
	showSkyAtmosphere: boolean = true;
	enableLighting: boolean = false;
	depthTestAgainstTerrain: boolean = false;
	showWaterEffect: boolean = true;
	enableFog: boolean = true;
	proxy: string = '/projectStart/proxy.jsp';

	constructor() {
	}

	onViewerReady(evt: any) {
		this.viewer = evt.viewer;
		this.scene = evt.scene;
		this.globe = evt.globe;
	}

	doShowSkyAtmosphere() {
		const id: number = setTimeout(() => {
			clearTimeout(id);
			this.scene.skyAtmosphere.show = this.showSkyAtmosphere;
		});
	}

	doEnableLighting() {
		const id: number = setTimeout(() => {
			clearTimeout(id);
			this.globe.enableLighting = this.enableLighting;
		});
	}

	doEnableFog() {
		const id: number = setTimeout(() => {
			clearTimeout(id);
			this.scene.fog.enabled = this.enableFog;
		});
	}

	doShowWaterEffect() {
		const id: number = setTimeout(() => {
			clearTimeout(id);
			this.globe.showWaterEffect = this.showWaterEffect;
		});
	}

	doDepthTestAgainstTerrain() {
		const id: number = setTimeout(() => {
			clearTimeout(id);
			this.globe.depthTestAgainstTerrain = this.depthTestAgainstTerrain;
		});
	}
}

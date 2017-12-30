import { Component, OnInit } from '@angular/core';
import ViewerOptions = Cesium.ViewerOptions;
import Viewer = Cesium.Viewer;
import Globe = Cesium.Globe;
import Scene = Cesium.Scene;

@Component({
	selector: 'render-effect',
	templateUrl: './render-effect.component.html',
	styleUrls: ['./render-effect.component.scss']
})
export class RenderEffectComponent implements OnInit {
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
	}
}

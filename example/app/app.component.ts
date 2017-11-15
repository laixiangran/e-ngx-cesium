import { Component } from '@angular/core';
import ViewerOptions = Cesium.ViewerOptions;
import Viewer = Cesium.Viewer;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	viewerOptions: ViewerOptions;
	viewer: Viewer;

	constructor() {
		this.viewerOptions = {
			scene3DOnly: true,
			selectionIndicator: false,
			baseLayerPicker: false
		};
	}

	onViewerReady($event: Viewer) {
		this.viewer = $event;
		console.log(this.viewer);
	}
}

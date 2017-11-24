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
	}

	onViewerReady(evt: any) {
		this.viewer = evt.viewer;
	}
}

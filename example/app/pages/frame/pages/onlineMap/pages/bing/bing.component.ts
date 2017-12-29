import { Component, OnInit } from '@angular/core';
import ViewerOptions = Cesium.ViewerOptions;
import Viewer = Cesium.Viewer;
import Scene = Cesium.Scene;
import Globe = Cesium.Globe;
import BingMapsImageryProvider = Cesium.BingMapsImageryProvider;

@Component({
	selector: 'app-bing',
	templateUrl: './bing.component.html',
	styleUrls: ['./bing.component.scss']
})
export class BingComponent implements OnInit {
	viewerOptions: ViewerOptions;
	viewer: Viewer;
	scene: Scene;
	globe: Globe;

	constructor() {
		this.viewerOptions = {
			imageryProvider: new BingMapsImageryProvider({
				key: 'AjQhMyw76oicHqFz7cUc3qTEy3M2fC2YIbcHjqgyMPuQprNVBr3SsvVdOfmlVc0v', // 可至官网（https://www.bingmapsportal.com/）申请key
				url: 'https://dev.virtualearth.net'
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

}

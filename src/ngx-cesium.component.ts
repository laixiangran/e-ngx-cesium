import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';

declare var Cesium: CesiumObj;
interface CesiumObj {
	Viewer: any;
}

@Component({
	selector: 'ngx-cesium',
	templateUrl: './ngx-cesium.component.html',
	styleUrls: ['./ngx-cesium.component.scss']
})
export class NgxCesiumComponent implements OnInit, OnDestroy {
	@ViewChild('ngxCesiumContainer') ngxCesiumContainerRef: ElementRef;
	ngxCesiumContainer: HTMLDivElement;
	viewer: any;

	constructor() {
	}

	ngOnInit() {
		this.ngxCesiumContainer = this.ngxCesiumContainerRef.nativeElement;
		this.initViewer();
	}

	/**
	 * 初始化视图
	 */
	initViewer() {
		this.viewer = new Cesium.Viewer(this.ngxCesiumContainer, {
			fullscreenElement: this.ngxCesiumContainer // 这里设置viewer所在元素为全屏的元素
		});
	}

	ngOnDestroy() {
		this.ngxCesiumContainer = this.ngxCesiumContainerRef.nativeElement;
		this.initViewer();
	}
}

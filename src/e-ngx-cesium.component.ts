import { Component, OnInit, ElementRef, ViewChild, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import ViewerOptions = Cesium.ViewerOptions;
import Viewer = Cesium.Viewer;

@Component({
	selector: 'e-ngx-cesium',
	templateUrl: './e-ngx-cesium.component.html',
	styleUrls: ['./e-ngx-cesium.component.scss']
})
export class ENgxCesiumComponent implements OnInit, OnDestroy {
	@ViewChild('ngxCesiumContainer') ngxCesiumContainerRef: ElementRef;

	private ngxCesiumContainer: HTMLDivElement;
	private viewer: Viewer;
	private defaultViewerOptions: ViewerOptions = {
		fullscreenElement: this.ngxCesiumContainer // 这里设置viewer所在元素为全屏的元素
	};

	@Input() viewerOptions: ViewerOptions;

	// 视图创建完成之后触发该事件
	@Output()
	viewerReady: EventEmitter<any> = new EventEmitter<any>(false);

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
		const viewerOptions: ViewerOptions = _.merge({}, this.defaultViewerOptions, this.viewerOptions);
		this.viewer = new Cesium.Viewer(this.ngxCesiumContainer, viewerOptions);
		this.viewerReady.emit(this.viewer);
	}

	ngOnDestroy() {
		this.viewer.destroy();
	}
}

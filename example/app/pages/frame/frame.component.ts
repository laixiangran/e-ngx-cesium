import { Component } from '@angular/core';

@Component({
	templateUrl: './frame.component.html',
	styleUrls: ['./frame.component.scss']
})
export class FrameComponent {
	currUserMenus: any[];

	constructor() {
		this.currUserMenus = [
			{
				url: '/frame/onlineMap',
				icon: 'fa fa-globe',
				label: '在线底图',
				children: [
					{
						url: '/frame/onlineMap/image',
						icon: 'fa fa-globe',
						label: '本地图片'
					},
					{
						url: '/frame/onlineMap/tdt',
						icon: 'fa fa-globe',
						label: '天地图'
					},
					{
						url: '/frame/onlineMap/gaode',
						icon: 'fa fa-globe',
						label: '高德地图'
					},
					{
						url: '/frame/onlineMap/bing',
						icon: 'fa fa-globe',
						label: 'BingMap'
					},
					{
						url: '/frame/onlineMap/arcgis',
						icon: 'fa fa-globe',
						label: 'ArcGIS'
					}
				]
			}
		];
	}
}

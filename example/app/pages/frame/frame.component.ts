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
			},
			{
				url: '/frame/scene',
				icon: 'fa fa-map',
				label: '场景',
				children: [
					{
						url: '/frame/scene/rollerShutters',
						icon: 'fa fa-map',
						label: '卷帘对比'
					},
					{
						url: '/frame/scene/modeSwitch',
						icon: 'fa fa-map',
						label: '模式切换'
					},
					{
						url: '/frame/scene/underGround',
						icon: 'fa fa-map',
						label: '地下模式'
					},
					{
						url: '/frame/scene/renderEffect',
						icon: 'fa fa-map',
						label: '场景效果'
					},
					{
						url: '/frame/scene/positionInfo',
						icon: 'fa fa-map',
						label: '位置信息'
					}
				]
			}
		];
	}
}

/**
 * Created by laixiangran on 2017/12/25.
 * homepage：http://www.laixiangran.cn.
 */
import DefaultProxy = Cesium.DefaultProxy;
import Credit = Cesium.Credit;
import UrlTemplateImageryProvider = Cesium.UrlTemplateImageryProvider;
import WebMercatorTilingScheme = Cesium.WebMercatorTilingScheme;
import { GaodeMapsStyle } from './GaodeMapsStyle';

export class GaodeImageryProvider extends UrlTemplateImageryProvider {

	constructor(mapStyle: string, proxy?: DefaultProxy) {
		let options: any;
		if (mapStyle === GaodeMapsStyle.VEC) {
			options = {
				url: `http://{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&L={z}&Z={z}&Y={y}&X={x}`,
				credit: new Credit('高德矢量地图服务'),
				subdomains: ['webrd01', 'webrd02', 'webrd03', 'webrd04'],
				tilingScheme: new WebMercatorTilingScheme(),
				maximumLevel: 18,
				proxy: proxy,
			};
		} else if (mapStyle === GaodeMapsStyle.IMG) {
			options = {
				url: 'http://{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
				credit: new Credit('高德影像地图服务'),
				subdomains: ['webst01', 'webst02', 'webst03', 'webst04'],
				tilingScheme: new WebMercatorTilingScheme(),
				maximumLevel: 18
			};
		} else if (mapStyle === GaodeMapsStyle.CIA) {
			options = {
				url: 'http://wprd{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=8&ltype=11',
				credit: new Credit('高德影像标注服务'),
				subdomains: ['01', '02', '03', '04'],
				tilingScheme: new WebMercatorTilingScheme(),
				maximumLevel: 18
			};
		}
		super(options);
	}
}

/**
 * Created by laixiangran on 2017/12/25.
 * homepage：http://www.laixiangran.cn.
 */
import DefaultProxy = Cesium.DefaultProxy;
import Credit = Cesium.Credit;
import UrlTemplateImageryProvider = Cesium.UrlTemplateImageryProvider;
import WebMercatorTilingScheme = Cesium.WebMercatorTilingScheme;
import { GoogleMapsStyle } from './GoogleMapsStyle';

export class GoogleMapsImageryProvider extends UrlTemplateImageryProvider {
	constructor(mapStyle: string, proxy?: DefaultProxy) {
		super({
			url: `http://{s}.google.cn/vt/lyrs=${mapStyle}&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Gali`,
			credit: new Credit(`谷歌${GoogleMapsStyle.Credit[mapStyle]}`),
			subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
			tilingScheme: new WebMercatorTilingScheme(),
			maximumLevel: 19,
			proxy: proxy
		});
	}
}

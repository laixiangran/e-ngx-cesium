/**
 * Created by laixiangran on 2017/12/25.
 * homepage：http://www.laixiangran.cn.
 */
import DefaultProxy = Cesium.DefaultProxy;
import WebMapTileServiceImageryProvider = Cesium.WebMapTileServiceImageryProvider;
import Credit = Cesium.Credit;
import GeographicTilingScheme = Cesium.GeographicTilingScheme;

export class TiandituMapsImageryProvider extends WebMapTileServiceImageryProvider {

	constructor(mapStyle: string, proxy?: DefaultProxy) {
		const layer: string = mapStyle.split('_')[0],
			tilematrixset: string = mapStyle.split('_')[1],
			options: any = {
				url: `http://{s}.tianditu.com/${mapStyle}/wmts?service=WMTS&version=1.0.0&request=GetTile&tilematrix={TileMatrix}&layer=${layer}&style=default&tileRow={TileRow}&tileCol={TileCol}&tilematrixset=${tilematrixset}&format=tiles`,
				layer: layer,
				style: 'default',
				format: 'tiles',
				tileMatrixSetID: `${tilematrixset}`,
				proxy: proxy,
				subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7']
			};
		if (tilematrixset === 'w') {
			options.credit = new Credit('天地图地图服务（墨卡托）');
			options.maximumLevel = 18;
		} else {
			options.tilingScheme = new GeographicTilingScheme(); // 指定为经纬度
			options.tileMatrixLabels = ['1', '2', '3', '4', '5', '6', '7']; // 经纬度的level是从1开始（而不是0），所以需要指定每一层级的索引号
			options.credit = new Credit('天地图地图服务（经纬度）');
			options.maximumLevel = 15;
		}
		super(options);
	}
}

/**
 * Created by laixiangran on 2017/12/25.
 * homepage：http://www.laixiangran.cn.
 */
import DefaultProxy = Cesium.DefaultProxy;
import WebMapTileServiceImageryProvider = Cesium.WebMapTileServiceImageryProvider;

export class TiandituImageryProvider extends WebMapTileServiceImageryProvider {

	constructor(mapStyle: string, proxy?: DefaultProxy) {
		const layer: string = mapStyle.split('_')[0],
			tilematrixset: string = mapStyle.split('_')[1];
		super({
			url: `http://{s}.tianditu.com/${mapStyle}/wmts?service=WMTS&version=1.0.0&request=GetTile&tilematrix={TileMatrix}&layer=${layer}&style=default&tileRow={TileRow}&tileCol={TileCol}&tilematrixset=${tilematrixset}&format=tiles`,
			layer: layer,
			style: 'default',
			tileMatrixSetID: tilematrixset,
			proxy: proxy,
			subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7']
		});
	}
}

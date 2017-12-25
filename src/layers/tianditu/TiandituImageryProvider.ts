/**
 * Created by laixiangran on 2017/12/25.
 * homepage：http://www.laixiangran.cn.
 */
import DefaultProxy = Cesium.DefaultProxy;
import WebMapTileServiceImageryProvider = Cesium.WebMapTileServiceImageryProvider;

export class TiandituImageryProvider {

	static init(mapStyle: string, proxy?: DefaultProxy): WebMapTileServiceImageryProvider {
		return new WebMapTileServiceImageryProvider({
			url: `http://t0.tianditu.com/${mapStyle}_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=${mapStyle}&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles`,
			layer: `tdt${mapStyle}BasicLayer`,
			style: 'default',
			format: 'image/jpeg',
			proxy: proxy,
			tileMatrixSetID: 'TDTMapsCompatible'
		});
	}
}

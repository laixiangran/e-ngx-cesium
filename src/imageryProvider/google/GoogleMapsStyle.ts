/**
 * Created by laixiangran on 2017/12/25.
 * homepage：http://www.laixiangran.cn.
 * 谷歌地图地图服务类型常量
 */

export class GoogleMapsStyle {
	/**
	 * 矢量地图服务
	 * @type {string}
	 */
	static M: string = 'm';

	/**
	 * 地形地图服务（含标注）
	 * @type {string}
	 */
	static P: string = 'p';

	/**
	 * 地形地图服务（不含标注）
	 * @type {string}
	 */
	static T: string = 't';

	/**
	 * 卫星地图服务（含标注）
	 * @type {string}
	 */
	static Y: string = 'y';

	/**
	 * 卫星地图服务（不含标注）
	 * @type {string}
	 */
	static S: string = 's';

	/**
	 * 地图标注服务（亮色系）
	 * @type {string}
	 */
	static H: string = 'h';

	/**
	 * 地图标注服务（暗色系）
	 * @type {string}
	 */
	static R: string = 'r';

	static Credit: any = {
		m: '矢量地图服务（含标注）',
		p: '地形地图服务（含标注）',
		t: '地形地图服务（不含标注）',
		y: '卫星地图服务（含标注）',
		s: '卫星地图服务（不含标注）',
		h: '地图标注服务（亮色系）',
		r: '地图标注服务（暗色系）'
	};
}

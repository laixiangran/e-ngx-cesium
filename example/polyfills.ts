/**
 * 这个文件包含Angular所需的填充程序，并在应用程序之前加载。也可以添加自定义的填充程序。
 *
 * 这个文件分为两部分：
 *   1. 浏览器填充：在ZoneJS加载之前按顺序加载到浏览器。
 *   2. 应用程序填充：在ZoneJS加载之后和main文件加载之前导入
 *
 * 当前配置支持的浏览器包括：
 * 桌面：Safari >= 10, Chrome >= 55, Opera >= 42, Firefox >= 50, IE >= 10, Edge >= 13.
 * 移动：and iOS 10 and Chrome on mobile.
 *
 * Learn more in https://angular.cn/docs/ts/latest/guide/browser-support.html
 */

/***************************************************************************************************
 * 浏览器填充
 */

/** IE9, IE10 and IE11 requires all of the following polyfills. **/
import 'core-js/es6/symbol';
import 'core-js/es6/object';
import 'core-js/es6/function';
import 'core-js/es6/parse-int';
import 'core-js/es6/parse-float';
import 'core-js/es6/number';
import 'core-js/es6/math';
import 'core-js/es6/string';
import 'core-js/es6/date';
import 'core-js/es6/array';
import 'core-js/es6/regexp';
import 'core-js/es6/map';
import 'core-js/es6/weak-map';
import 'core-js/es6/set';

/** 支持IE10和IE11在SVG元素上用NgClass */
import 'classlist.js';  // Run `npm install --save classlist.js`.

/** Evergreen browsers require these. **/
import 'core-js/es6/reflect';
import 'core-js/es7/reflect';

/**
 * 支持Web Animations `@angular/animation`.
 * 除 Chrome 和 Firefox 外的所有，但不支持 IE9。
 * http://caniuse.com/#feat=web-animation
 **/
import 'web-animations-js';  // Run `npm install --save web-animations-js`.

/***************************************************************************************************
 * zone.js是Angular自身依赖的程序
 */
import 'zone.js/dist/zone';  // Included with Angular CLI.

/***************************************************************************************************
 * 应用程序填充
 */

/**
 * Date、currency、decimal 和 percent 管道
 * 除了 Chrome、Firefox、Edge、IE11 和 Safari 10 外的所有浏览器
 */
import 'intl';  // Run `npm install --save intl`.
/**
 * 从intl至少导入一个本地环境数据
 */
import 'intl/locale-data/jsonp/zh';

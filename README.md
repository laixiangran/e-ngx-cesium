# ngx-cesium

ngx-cesium is a [cesium](https://cesiumjs.org/) component for Angular.

## Usage

1. Install

	```shell
	npm install --save ngx-cesium@latest
	```

2. Set in the `.angular-cli.json（@angular/cli）`

	```json
    "assets": [
        {
            "glob": "**/*",
            "input": "../node_modules/cesium/Build/Cesium",
            "output": "./assets/scripts/cesium"
        }
    ],
    "styles": [
        "../node_modules/cesium/Build/Cesium/Widgets/widgets.css"
    ],
    "scripts": [
        "../node_modules/cesium/Build/Cesium/Cesium.js"
    ]
	```

3. Set `CESIUM_BASE_URL` in main.ts

	```typescript
    window['CESIUM_BASE_URL'] = '/assets/scripts/cesium'; // 设置cesium请求资源的基本路径
	```

4. Add the `NgxCesiumModule`

	```typescript
	import { NgxCesiumModule } from "ngx-cesium";
	@NgModule({
	    imports: [
	        NgxCesiumModule
	    ]
	})
	```

5. Use in Template

	```html
	```

6. Use in Component

	```typescript
	```

## API

### Inputs

### Outputs

### Instance Method

## Develop

	```shell
	npm install // 安装依赖包
	
	npm start // 启动项目
	```

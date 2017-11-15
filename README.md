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

3. Add `cesium-typings` to `typings.d.ts`

	```typescript
    /// <reference path="../node_modules/cesium-typings/index.d.ts" />
	```

4. Set `CESIUM_BASE_URL` in main.ts

	```typescript
    window['CESIUM_BASE_URL'] = '/assets/scripts/cesium'; // 设置cesium请求资源的基本路径
    // window['CESIUM_BASE_URL']需在应用启动之前设置
    platformBrowserDynamic().bootstrapModule(AppModule);
	```

5. Add the `NgxCesiumModule`

	```typescript
	import { NgxCesiumModule } from "ngx-cesium";
	@NgModule({
	    imports: [
	        NgxCesiumModule
	    ]
	})
	```

6. Use in Template

	```html
	<ngx-cesium [viewerOptions]="viewerOptions" (viewerReady)="onViewerReady($event)"></ngx-cesium>
	```

7. Use in Component

	```typescript
    viewerOptions: ViewerOptions;
    viewer: Viewer;

    constructor() {
        this.viewerOptions = {
            scene3DOnly: true,
            selectionIndicator: false,
            baseLayerPicker: false
        };
    }

    onViewerReady($event: Viewer) {
        this.viewer = $event;
        console.log(this.viewer);
    }
	```

## API

### Inputs

- `viewerOptions`（`any`） - 创建Cesium.Viewer的属性配置

### Outputs

- `viewerReady` - 准备就绪后会触发该事件，参数$event为Cesium.Viewer

### Instance Method

- 无

## Develop

	```shell
	npm install // 安装依赖包
	
	npm start // 启动项目
	```

/**
 * Created by laixiangran on 2018/2/9.
 * homepage：http://www.laixiangran.cn.
 */

var _0;

function applyWaterMaterial(geometryInstance, waterScene) {
    _0 = waterScene.primitives.add(new Cesium.Primitive({
        geometryInstances: geometryInstance,
        appearance: new Cesium.EllipsoidSurfaceAppearance({
            aboveGround: false,
            material: new Cesium.Material({
                fabric: {
                    type: 'Water',
                    uniforms: {
                        specularMap: './assets/scripts/WaterMaterialHelper/earthspec1k.jpg',
                        normalMap: './assets/scripts/WaterMaterialHelper/waterNormals.jpg',
                        frequency: 10000.0,
                        animationSpeed: 0.01,
                        amplitude: 1.0
                    }
                }
            })
        }),
        show: true
    }))
}

function applyWaterMaterialWorld(waterScene) {
    _0 = waterScene.primitives.add(new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
            geometry: new Cesium.RectangleGeometry({
                rectangle: Cesium.Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0),
                vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
            })
        }),
        appearance: new Cesium.EllipsoidSurfaceAppearance({
            aboveGround: false,
            material: new Cesium.Material({
                fabric: {
                    type: 'Water',
                    uniforms: {
                        specularMap: './assets/scripts/WaterMaterialHelper/earthspec1k.jpg',
                        normalMap: './assets/scripts/WaterMaterialHelper/waterNormals.jpg',
                        frequency: 10000.0,
                        animationSpeed: 0.01,
                        amplitude: 1.0
                    }
                }
            })
        }),
        show: true
    }))
}

function removeWaterMaterial(waterScene) {if (!_0) {waterScene.primitives.remove(_0)}}
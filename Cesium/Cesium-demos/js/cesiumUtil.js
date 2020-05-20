	
	/**
	 * 制图坐标和笛卡尔空间坐标 平面坐标的转换
	 * Cartesian3(笛卡尔空间)
	 * Cartographic(制图 弧度)
	 * wsg84有弧度和经纬度 在ceseium中有制图弧度对象
	 */
	var radians = Cesium.Math.toRadians（degrees）;//经纬度转弧度
	var degrees = Cesium.Math.toDegrees（radians）;//弧度转经纬度
	
	//方法一：
	var longitude = Cesium.Math.toRadians(longitude1); //其中 longitude1为角度
	
	var latitude= Cesium.Math.toRadians(latitude1); //其中 latitude1为角度
	
	var cartographic = new Cesium.Cartographic(longitude, latitude, height)；
	
	//方法二：
	var cartographic= Cesium.Cartographic.fromDegrees(longitude, latitude, height);//其中，longitude和latitude为角度 转化为 wsg84有角度转化为弧度
	
	//方法三：
	var cartographic= Cesium.Cartographic.fromRadians(longitude, latitude, height);//其中，longitude和latitude为弧度
	// WGS84 =>  笛卡尔
	var position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height)；//其中，高度默认值为0，可以不用填写；longitude和latitude为角度
	
	var positions = Cesium.Cartesian3.fromDegreesArray(coordinates);//
	
	var positions = Cesium.Cartesian3.fromDegreesArrayHeights(coordinates)
	// 笛卡尔 => WGS84 
	var positions cartographic= Cesium.Cartographic.fromCartesian(cartesian3);
	
	//屏幕坐标转为笛卡尔空间坐标
	//若屏幕坐标处没有倾斜摄影表面、模型时，获取的笛卡尔坐标不准，此时要开启地形深度检测（viewer.scene.globe.depthTestAgainstTerrain = true; //默认为false）
	var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
	handler.setInputAction(function (movement) {
	     var position = viewer.scene.pickPosition(movement.position);
	     console.log(position);
	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
	//屏幕坐标转地表坐标-获取加载地形后对应的经纬度和高程
	var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
	handler.setInputAction(function (movement) {
	     var ray = viewer.camera.getPickRay(movement.position);
	     var position = viewer.scene.globe.pick(ray, viewer.scene);
	     console.log(position);
	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
	//屏幕坐标转椭球面坐标-获取鼠标点的对应椭球面位置
	var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
	handler.setInputAction(function (movement) {
	     var position = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
	     console.log(position);
	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
	//笛卡尔转平面
	var cartesian2= Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene,cartesian3)
	
	
	

const svgTransfer={};
//屏幕坐标转化为svg坐标
		// event为鼠标点击事件所在的点,event.pageX,event.page即为到x轴和y轴的距离,svgDom即svg的dom元素
	 svgTransfer.bindEvent=function(event,svgDom){
			let pageX = event.pageX;
			let pageY = event.pageY;
			let point =reportMouseCoordinates(svgDom, pageX, pageY);
			return point;
	}
	function reportMouseCoordinates(svgElement, pageX, pageY) {
		var point = svgElement.createSVGPoint();
		point.x =pageX; 
		point.y = pageY;
		point = coordinateTransform(point, svgElement);
		return point;
	}
	function coordinateTransform(screenPoint, someSvgObject) {
	    var CTM = someSvgObject.getScreenCTM();//	该矩阵将svg坐标转换为屏幕坐标
		return screenPoint.matrixTransform(CTM.inverse());///////matrix( 1 , 0 , 0 , 1 , 0 , 0 ),矩阵.inverse() =矩阵的逆矩阵
	}
	
	
	
	
	
//svg坐标转化为屏幕坐标
	// event为svg的坐标,如:{x:105.375,y:130},svgDom即svg的dom元素
	 svgTransfer.bindEvent1=function(event,svgDom){
			let pageX = event.x;
			let pageY = event.y;
			let point =reportMouseCoordinates1(svgDom, pageX, pageY);
			return point;
	}
	function reportMouseCoordinates1(svgElement, pageX, pageY) {
		var point = svgElement.createSVGPoint();
		point.x =pageX; 
		point.y = pageY;
		point = svgTo(point, svgElement);
		return point;
	}

	function svgTo(screenPoint,someSvgObject){
		var CTM = someSvgObject.getScreenCTM();//	该矩阵将svg坐标转换为屏幕坐标
		return screenPoint.matrixTransform(CTM)
	}

export default svgTransfer;
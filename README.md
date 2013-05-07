# Let any element can drag

## API
	var dd = new Dragdrop({
		target 	 拖拽元素 HTMLElemnt 必选
		bridge	 指定鼠标按下哪个元素时开始拖拽，实现模态对话框时用到 
		dragable 是否可拖拽	(true)默认
		dragX 	 true/false false水平方向不可拖拽 (true)默认
		dragY	 true/false false垂直方向不可拖拽 (true)默认
		area 	 [minX,maxX,minY,maxY] 指定拖拽范围 默认任意拖动
		inwin	true/false 仅在浏览器窗口内拖动 (false)默认
	})
	

## 事件
+ dragstart
	<pre>
	dd.ondragstart = function() {}
	</pre>
	
+ darg
	<pre>
	dd.ondrag = function() {}
	</pre>
	
+ dragend
	<pre>
	dd.ondragend = function() {}
	</pre>
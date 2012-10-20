window.onload = function(){
	var container = document.getElementById('container');
	var ele = document.getElementById('d1');
	var bodyWidth = container.offsetWidth,
		bodyHeight = container.offsetHeight;
	var maxX = bodyWidth - ele.offsetWidth - 10;
	var maxY = bodyHeight - ele.offsetHeight - 10;
	var dd = new Dragdrop({
		target: ele,
		area: [0, maxX, 0, maxY]
	});
	dd.ondrag = function(x, y) {
		if (this.getX()) {
			document.getElementById('x').innerHTML = 'x:' + x;
		}
		if (this.getY()) {
			document.getElementById('y').innerHTML = 'y:' + y;
		}
	}
	document.getElementById('setting').onclick = function(e) {
		e = e || event;
		var target = e.target || e.srcElement;
		if (target.value == '1' && target.checked) {
			dd.dragAll();
		}				
		if (target.value == '2' && target.checked) {
			dd.setX();
		}
		if (target.value == '3' && target.checked) {
			dd.setY();
		}
		if (target.value == '4' && target.checked) {
			dd.setDragable(false);
		}
		if (target.value == '5' && target.checked) {
			dd.setDragable(true);
		}
		if (target.value == '6' && target.checked) {
			dd.reStore();
			document.getElementById('x').innerHTML = 'x:0';
			document.getElementById('y').innerHTML = 'y:0';
		}
	}
}
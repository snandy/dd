window.onload = function(){
	var container = document.getElementById('container');
	var ele = document.getElementById('d1');
	var bodyWidth = container.offsetWidth,
		bodyHeight = container.offsetHeight;
	var maxX = bodyWidth - ele.offsetWidth - 10;
	var maxY = bodyHeight - ele.offsetHeight - 10;
	var dd = new Dragdrop({
		target : ele,
		area : [0,maxX,0,maxY],
		callback : function(obj){
			if(typeof obj.moveX == 'number' && this.dragX){
				document.getElementById('x').innerHTML = 'x:'+obj.moveX;
			}
			if(typeof obj.moveY == 'number' && this.dragY){
				document.getElementById('y').innerHTML = 'y:'+obj.moveY;
			}
		}
	});	
	document.getElementById('setting').onclick = function(e){
		e = e || event;
		var target = e.target || e.srcElement;
		if(target.value == '1' && target.checked){
			dd.dragAll();
		}				
		if(target.value == '2' && target.checked){
			dd.dragX();
		}
		if(target.value == '3' && target.checked){
			dd.dragY();
		}
		if(target.value == '4' && target.checked){
			dd.setDragable(false);
		}
		if(target.value == '5' && target.checked){
			dd.setDragable(true);
		}
		if(target.value == '6' && target.checked){
			dd.reStore();
			document.getElementById('x').innerHTML = 'x:0';
			document.getElementById('y').innerHTML = 'y:0';
		}
	}
}
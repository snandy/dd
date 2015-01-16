/* jdj - v0.1.0 - 2013-11-15 */
/**
* 浏览器类型检测
*
* **update**
* 2013-10-17 11:07:21
*/

;(function($, undefined){
	if (typeof($.browser) == 'undefined'){
		var userAgent = navigator.userAgent.toLowerCase();
		$.browser = {
			version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1],
			safari: /webkit/.test( userAgent ),
			opera: /opera/.test( userAgent ),
			msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
			mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
		};
	}
	
	/**
	* IE6
	*/
	$.browser.isIE6 = function(){
		 return $.browser.msie && $.browser.version == 6;
	}

	/**
	* IE7
	*/	
	$.browser.isIE7 = function(){
		 return $.browser.msie && $.browser.version == 7;
	}

	/**
	* IE8
	* $.browser.isIE8
	*/
	$.browser.isIE8 = function(){
		 return $.browser.msie && $.browser.version == 8;
	}

	/**
	* IE9
	* $.browser.isIE9
	*/
	$.browser.isIE9 = function(){
		 return $.browser.msie && $.browser.version == 9;
	}

	/**
	* IE10
	* $.browser.isIE10
	*/
	$.browser.isIE10 = function(){
		 return $.browser.msie && $.browser.version ==10;
	}

	/**
	* IE11
	* $.browser.isIE11
	*/
	$.browser.isIE11 = function(){
		 return $.browser.msie && $.browser.version ==11;
	}

})(jQuery);
/**
*原生JS扩展
*
* **update**
* 2013-10-17 11:07:21
*/

;(function($, undefined){
	/**
	 * 页面文档和浏览器窗口宽高
	 */
	$.page = function (){}
	
	/**
	 * 当前页面
	 * @return {Object} 
	 * @method $.page.doc()
	 */	
	$.page.doc = function(){
		return document.compatMode == "BackCompat" ? document.body : document.documentElement;
	}

	/**
	 * 浏览器窗口宽
	 * @return {Number} 宽度值
	 * @method $.page.clientWidth()
	 */
	$.page.clientWidth = function(){
		return $.page.doc().clientWidth;
	}

	/**
	 * 浏览器窗口高
	 * @return {Number} 高度值
	 * @method $.page.clientHeight()
	 */
	$.page.clientHeight = function(){
		return $.page.doc().clientHeight;
	}

	/**
	 * 文档宽
	 * @return {Number} 宽度值
	 * @method $.page.docWidth()
	 */
	$.page.docWidth = function(){
		return Math.max($.page.doc().clientWidth,$.page.doc().scrollWidth);		 
	}

	/**
	 * 文档高
	 * @return {Number} 高度值
	 * @method $.page.docHeight()
	 */
	$.page.docHeight = function(){
		return Math.max($.page.doc().clientHeight,$.page.doc().scrollHeight);		 
	}

	/**
	 * 检测HTML节点间的关系
	 * @method $.contains
	 * @param {Object} parent 父节点
	 * @param {Object} node 子节点
	 */
	 if (typeof($.contains) == 'undefined'){
		$.contains = function (parent, node) {
		return parent.compareDocumentPosition
			? !!(parent.compareDocumentPosition(node) & 16)
			: parent !== node && parent.contains(node)
	}
};
})(jQuery);
/**
 * 节流函数
 * 减少执行频率, 多次调用，在指定的时间内，只会执行一次。
 *
 ***参数**
 *
 *  - 	`func` {Function}  要节流的函数
 *  - 	`wait` {Number}  延时时间
 *
 ***举例** 
 *
 *	var throttleFn= function(){
 *		lazyload();//要节流的函数
 *	};
 *	var throttled = $.throttle(throttleFn,200);
 *	$(window).bind('scroll',throttled);
 */

;(function($, undefined){
	$.throttle = function(func, wait) {
		var context, args, timeout, result;
		var previous = 0;
		var later = function() {
			previous = new Date;
			timeout = null;
			result = func.apply(context, args);
		};
		return function() {
			var now = new Date;
			var remaining = wait - (now - previous);
			context = this;
			args = arguments;
			if (remaining <= 0) {
				clearTimeout(timeout);
				timeout = null;
				previous = now;
				result = func.apply(context, args);
			} else if (!timeout) {
				timeout = setTimeout(later, remaining);
			}
			return result;
		};
	}
})(jQuery);
/**
* 解析模版tpl
* @param {String} str 模板
* @param {Object} data 数据
* @example 
* 	var data = {name: 'lilei'};
* 	var str = "<h3><%=name%></h3>";
* 	console.log($.tpl(str, data)); // => <h3>lilei</h3>
*/

;(function( $, undefined ) {
	$.tpl = function(str, data){
		var tpl =  "var p=[],print=function(){p.push.apply(p,arguments);};" +
			"with(obj){p.push('" +
			str.replace(/[\r\t\n]/g, " ")
			  .split("<%").join("\t")
			  .replace(/((^|%>)[^\t]*)'/g, "$1\r")
			  .replace(/\t=(.*?)%>/g, "',$1,'")
			  .split("\t").join("');")
			  .split("%>").join("p.push('")
			  .split("\r").join("\\'")
			+ "');}return p.join('');";

		fn = new Function("obj",tpl);
		return data ? fn( data ) : fn;
	};
})( jQuery);
/**
*####ui组件基类####
*
*提供一个插件化的jQuery ui组件写法,参数放在组件的options中,并可以merge元素中data-*的参数,实例运行时会直接执行init函数.
*
*
***举例**
*
*	;(function($, undefined) {
*		$.ui.define('myui', {
*			 options: {
*				say:'hi'//组件参数,用this.options.test调用
*			},
*			init:function(){
*				//初始化函数,实例中会直接执行init
*			}
*		});
*	})(jQuery);
*
***使用此组件**
*
*html部分
*
*	<div id="test" data-tag="istest"></div>
*js部分
*
*	$('#test').myui({
*		say:'test'
*	})
*
* **update**
* 2013-10-14 17:59:45
*/

if (typeof($.ui) == 'undefined'){
	$.ui = {};
}

;(function($,undefined){
    function isPlainObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }

    //从某个元素上读取某个属性
    function parseData( data ) {
        try { // JSON.parse可能报错
            // 当data===null表示，没有此属性
            data = data === 'true' ? true :
                    data === 'false' ? false : data === 'null' ? null :

                    // 如果是数字类型，则将字符串类型转成数字类型
                    +data + '' === data ? +data :
                    /(?:\{[\s\S]*\}|\[[\s\S]*\])$/.test( data ) ?
                    JSON.parse( data ) : data;
        } catch(ex) {
            data = undefined;
        }

        return data;
    }

    //从DOM节点上获取配置项
    function getDomOptions( el ) {
        var ret = {},
            attrs = el && el.attributes,
            len = attrs && attrs.length,
            key,
            data;

        while (len--) {
            data = attrs[ len ];
            key = data.name;

           if (key.substring(0, 5) !== 'data-') {
                continue;
            }

            key = key.substring( 5 );
            data = parseData( data.value );

            data === undefined || (ret[key] = data);
        }

        return ret;
    }

    //合并对象
    function mergeObj() {
        var args = [].slice.call(arguments),
            i = args.length,
            last;

        while ( i-- ) {
            last = last || args[ i ];
            isPlainObject( args[ i ] ) || args.splice( i, 1 );
        }

        return args.length ?
			$.extend.apply( null, [ true, {} ].concat( args ) ) : last;
			// 深拷贝，options中某项为object时，用例中不能用==判断
    }
	
	var event = {
		//绑定事件
		on:function (name, fun) {
			var me = this;
			this.events = this.events || (this.events = []);
			this.events[name] = this.events[name] || [];
			var funType = typeof(fun);
			
			if (typeof(fun) === 'undefined'){
				var fun = function(){
					if (me[name]){
						 me[name]();
					}
				}
			}

			if (typeof(fun) === 'function'){
				this.events[name].push(fun);
			}
		},
		//解除事件绑定
		off:function (name, fun) {
			var even = this.events[name];
			if (even) {
				var l = even.length;
				while (l--) {
					if (even[l] === fun) {
						even.splice(even[l], 1);
					}
				}

			}
		},
		//触发事件
		trigger : function (name, obj) {
			var event = this.events[name];
			if (event) {
				for (var i in event ){
					if (typeof(event[i]) == 'function'){
						event[i]();
					}
				}
			}
		},
		removeAll:function (name) {
			this.events = [];
		}
	};

    //创建一个类
    function createClass(name,object){
		function klass(el, options) {
			var me = this;
			me.el = $(el);
			opts = me.options = mergeObj(klass.options, getDomOptions(el), options);
			me.name = name.toLowerCase();

			//me.tpl2html = function(){};
			/**
			me.on = event.on;
			me.off = event.off;
			me.trigger = event.trigger;
			me.removeAll = event.removeAll;
			*/

			me.init(opts);
			//me.trigger('ready');
			//me.bind();
			return me;
        }

		var fn = ['options'];
		for(var i=0;i<fn.length;i++){
			var item = fn[i];
			object[item] && (klass[item] = object[item]);
			delete object[item];
		}
		
		for(var i in object){
			klass.prototype[i] = object[i];
		}

        return klass;
    }
	
	/**
     * 在$.fn上挂组件
	 * @methord fn
     */
	$.ui.fn = function(name){
		var name = name.toLowerCase();
        $.fn[name] = function(opts) {
			var obj;
            $.each(this,function(i,el) {
				obj = new $.ui[name](el,opts);
            });
            return obj;
        };
	}
	
	/**
     * 定义一个组件
	 * @methord define
     */
	$.ui.define = function(name,object) {
		$.ui[name] = createClass(name,object);
		$.ui.fn(name);
	};
	
})(jQuery);
/**
*####吸顶灯####
* 
*当滚动条滚动至某个元素的顶部位置时,把它悬挂至页面最顶部,类似吸顶灯的效果
* 
***Demo**
* [ceilinglamp](../demo/ceilinglamp/ceilinglamp.html "Demo")
*
***参数**
*
*  - 	`top` {Number} 0 距离顶部的高度
*
***依赖**
*
* core/browser.js , core/extend.js
*
***举例**
* 
*js部分
*
*	$('#ceilinglamp').ceilinglamp();
* 
***html部分**
*	
*	<div class="ui-ceilinglamp" id="ceilinglamp">
*		<a href="#">吸顶灯</a>
*		</ul>
*	</div>		
*
* **update**
* 2013-11-12 9:11:39
*
*/

;(function($, undefined) {
	$.ui.define('ceilinglamp', {
		 options: {
			top:0
		},
		init:function(){
			this.showInit();
			this.bind();
		},
		show:function(){
			var opts = this.options;
			this.fix(this.el,{
				top:opts.top
			});
		},
		hide:function(){
			this.el.css({
				position:'relative',
				top:0
			})
		},
		showInit:function(){
			var scrollTop = $(document).scrollTop();
			if ( scrollTop > this.top ){
				this.show();
			}else{
				this.hide();
			}
		},
		bind:function(){
			var me = this;
			this.top = me.el.offset().top - this.options.top;

			$(window).scroll(function(){
				me.showInit();
			}); 
		},
		fix:function(ele,style) {
			if(ele){
				if (typeof(style) == 'undefined'){
					var style = {};
					style.top = 0;
				}

				if ($.browser.isIE6()){
					ele.css({position:'absolute'});
					var height = style.top;
					ele[0].style.setExpression("top", "eval((document.documentElement||document.body).scrollTop+" + height + ") + 'px'");
					delete style.top;
				} else {
					ele.css({position:'fixed'});
				}
				ele.css(style);
			}
		}
	});
})(jQuery);
/**
*####弹出层组件####
* 
***Demo**
* [dialog](../demo/dialog/dialog.html "Demo")
*
***参数**
*
*  - `maskHas` {Boolean} true  是否有遮盖层
*  - `maskClass`{String} 'ui-mask'  遮盖层的className
*  - `maskIframe`{Boolean} false  遮盖层是否用iframe
*  - `opacity` {Number} 0.15  遮盖层透明度
*  - `zIndex` {Number} 9998  遮盖层zIndex
*  - `type` {String} 'text'  主体类型包括text,html,image,json,iframe
*  - `source` {String} null  主体的内容
*  - `dialogClass` 'ui-dialog'  主体的className
*  - `autoIrame`{Boolean} true  主体类型如果是iframe是否自适应
*  - `autoOpen` {Boolean} true  是否直接打开
*  - `autoCloseTime` {Boolean} false  是否自动关闭
*  - `title` {Boolean} true  是否含有标题
*  - `button` {Boolean} false  是否有确定,取消按钮
*  - `closeButton` {Boolean} true  是否有关闭按钮
*  - `callback` {Function} null  回调函数
*  - `width` {Number} null  主体宽度
*  - `height ` {Number} null  主体高度
*  - `initialHeight` {Number} 300  iframe 类型的默认高度
*  - `stick` {Number} null需要粘在某个元素上
*
* **依赖**
* core/browser.js , core/extend.js , core/tpl.js
*
***举例**
* 
*	$('#dialog').dialog({
*		title:'title',
*		width:500,
*		type:'iframe',
*		source:'iframe.html'
*	});
*
* **update**
* 2013-10-17 9:10:17
*/

;(function($, undefined) {
	$.ui.define('dialog', {
		options:{			
			maskHas : true,//是否有遮盖层
			maskClass:'ui-mask',//遮盖层的className
			maskIframe:false,//遮盖层是否用iframe
			opacity : 0.15,//遮盖层透明度
			zIndex:9998,//遮盖层zIndex

			type:'text',//主体类型 text,html,image,json,iframe
			source:null,//主体的内容
			dialogClass:'ui-dialog',//主体的className
			autoIrame:true,//主体类型如果是iframe是否自适应
			autoOpen:true,//是否直接打开
			autoCloseTime:false,//是否自动关闭
			
			title:true,//是否含有标题
			button:false,//是否有确定,取消按钮
			closeButton:true,//是否有关闭按钮

			callback:null,//回调函数
			width : null,//主体宽度
			height :null,//主体高度
			initialHeight:300,//iframe 类型的默认高度
			stick:null//需要粘在某个元素上
		},
		init:function(){
			var self = this;
			var opts = this.options;
			var title = '';
			
			//title
			if (opts.title){
				title = $.tpl(this.tpl.title,{title:opts.title});
			}

			var dialogHtml = title + this.tpl.conten + (!opts.button ? '' :  this.tpl.button);
			//wrap
			this.el = $(this.tpl.wrap);
			$(dialogHtml).appendTo(this.el);
			this.el.appendTo('body');
			//主体
			this.content = this.el.find('.ui-dialog-content');
			this.title = this.el.find('.ui-dialog-title');
			
			//顶部关闭按钮
			if (opts.title && opts.closeButton){
				this.el.find('.ui-dialog-title').append(this.tpl.close);
			}

			this.mask();

			if (opts.autoOpen){
				this.open();
			}

			this.bind();
		},
		//tpl模板	
		tpl:{
			mask: '<div class="ui-mask"></div>',
			
			close: '<a class="ui-dialog-close" title="关闭"><span class="ui-icon ui-icon-delete"></span></a>',
			title: '<div class="ui-dialog-title">\
						<h3><%=title%></h3>\
					</div>\
				',
			wrap: '<div class="ui-dialog"></div>',
			conten: '<div class="ui-dialog-content"></div>',
			button:'<div class="ui-dialog-btns">\
						<a class="ui-btn ui-btn-submit">确定</a>\
						<a class="ui-btn ui-btn-cancel">取消</a>\
					</div>\
				'
		},
		bind:function(){
			var self = this;
			//this.mask.bind('click',function(){
			//	 self.close();
			//});
			
			//顶部关闭按钮
			if (this.options.title && this.options.closeButton){
				this.el.find('.ui-dialog-close').bind('click',function(){
					self.close();
				});
			}
		},
		/**
         * 创建遮盖层
         * @method mask
         */
		mask:function(){
			var self = this;
			var options = this.options;
			if (!options.maskHas) return;
			
			var maskObj = this.mask = $(document.createElement("div"));
			//this.mask.attr('class',options.maskClass);
			this.mask.addClass(options.maskClass).css({
				position:"absolute",
				left:0,
				top:0,
				opacity:options.opacity,
				zIndex:options.zIndex,
				backgroundColor:"#000",
				width:$.page.docWidth(),
				height:$.page.docHeight()
			});
			
			if (!$('.'+options.maskClass)[0]) this.mask.appendTo('body');
			
			//for IE6 add iframe
			if ($.browser.isIE6() || options.maskIframe){
				this.mask.append('<iframe src="javascript:;" class="jdMaskIframe" frameBorder="0" style="width:100%;height:100%;position:absolute;z-index:'+(options.zIndex+1)+';opacity:0;filter:alpha(opacity=0);top:0;left:0;">');
			}

			//自适应窗口
			$(window).resize(function(){
				self.mask.css({
					width:$.page.docWidth(),
					height:$.page.docHeight()
				}); 
			});
		},
		open:function(){
			this.openType();
			this.contentStyle();
			this.iframeSet();
			this.autoClose();
			if (this.options.callback){
				callback.call(this);
			}
		},
		/**
         * 打开不同类型的遮盖层
         * @method openType
         */
		openType:function(){
			var opts = this.options;
			switch (opts.type){
				case "text":
					this.content.html(opts.source);
					break ;
				case "html":
					$(opts.source).clone().appendTo(this.content);
					break ;
				case "iframe":
					var css = {
						width:"100%",
						height:"100%"
					}
					opts.source += '?t=' +new Date().getTime();

					this.iframe = $("<iframe src='" + opts.source + "' marginwidth='0' marginheight='0' frameborder='0' scrolling='no' style='border:0;'></iframe>").css(css).appendTo(this.content);
					this.iframe.attr('name','dialogIframe' + new Date().getTime())
					break ;
				case "image":
					 $("<img src='" + opts.source + "' width='" + opts.width + "' height='" + opts.height + "'>").appendTo(this.content);
					break ;
				case "json":
					//todo
					break ;
			}
		},
		/**
         * 遮盖层样式配置
         * @method contentStyle
         */
		contentStyle:function(){
			var opts = this.options;
			//title
			if (opts.title){
				if (opts.height){
					//增加一个title的高度
					opts.height  += 28;
				}
				//for IE6,IE7
				this.title.css({width:opts.width});
			}

			//wrap style
			var top = ($.page.clientHeight() - (!opts.height ? 0 : opts.height+28) ) / 2 + $(document).scrollTop();
			var left = ($.page.clientWidth() - (!opts.width ? 0 : opts.width +8) ) / 2 + $(document).scrollLeft();
			
			this.el.css({
				position: 'absolute',
				top:top,
				left:left,
				//height:!opts.height ? '' : opts.height,
				//width:!opts.width ? '' : opts.width,
				zIndex:opts.zIndex+2,
				display:"block"
			});
			
			//content style
			this.content.css({
				height:!opts.height ? '' : opts.height,
				width:!opts.width ? '' : opts.width
			})
		},
		 /**
         * 关闭当前对话框
         * @method close
         */
		close:function(){
			this.el.remove();
			this.mask.remove();
		},
		 /**
         * 计时autoCloseTime秒后关闭当前对话框
         * @method autoClose
         * @param {Number} autoCloseTime
         */
		autoClose:function(){
			var self = this;
			var autoCloseTime = this.options.autoCloseTime;
			 if (autoCloseTime){
				var x = autoCloseTime;
				$("<div class='ui-dialog-autoclose' style='width:" + this.options.width + "'><span id='ui-autoclose'>" + x + "</span>秒后自动关闭</div>").appendTo(this.el);
				autoCloseTimer = setInterval(function() {
					x--;
					$("#ui-autoclose").html(x);
					if (x == 0) {
						x = autoCloseTime;
						self.close()
					}
				}, 1000)
			 }
		},
		 /**
         * iframe高度
         * @method getIframeHeight
		 * @param {Object} [iframe] iframe对象
         * @return {Number} iframe高度
         */
		getIframeHeight:function (iframe) {
			var doc = iframe[0].contentWindow.document;
			if (doc.body.scrollHeight && doc.documentElement.scrollHeight) {
				return Math.min(
					doc.body.scrollHeight,
					doc.documentElement.scrollHeight
				);
			} else if (doc.documentElement.scrollHeight) {
				return doc.documentElement.scrollHeight;
			} else if (doc.body.scrollHeight) {
				return doc.body.scrollHeight;
			}
		},
		/**
		* 同步iframe高度
         * @method syncHeight
		*/
		syncHeight:function(){
			var opts = this.options;
			var height;
			try {
				height = this.getIframeHeight(this.iframe);
			}catch (error) {
				//页面跳转出错时处理
				height = this.options.initialHeight;
			}

			//主体样式重置
			this.iframe.css({height:height});
			var clientHeight = $.page.clientHeight();
			if (opts.title){
				height  += 28;//增加title的高度
			}
			this.el.css({
				top:( height > clientHeight ? 0: clientHeight - height) / 2 
			})
		},
		/**
		* iframe配置
         * @method iframeSet
		*/
		iframeSet:function(){
			var self = this;
			var opts = this.options;
			if (opts.type != "iframe"){
				return;
			}
			if(opts.autoIrame){
				this.iframe.one('load',function(){
					if (!opts.height){						
						//this.iframeInterval = setInterval(function(){
						//	self.syncHeight();
						//},300);
						self.syncHeight();
					}
				})
			}
		}
	});
})(jQuery);
/**
*####拖拽组件####
* 
* 拖拽的最简实现,可以锁定X,Y,拖动开始,拖动中,拖动结束时可加回调函数
* 拖动时加样式ui-drag-selected,回调中含有当前元素的top,left
* 
***Demo**
* [drag](../demo/drag/drag.html "Demo")
*
***参数**
*
*  - 	`lockX` {Boolse} false   锁定X
*  - 	`lockY`{Boolse}  false   锁定Y
*  - 	`start`  {Function}  null   开始拖动回调
*  - 	`drag`  {Function}  null   拖动中回调 返回left,top
*  - 	`end`   {Function} null   结束拖动回调
*  - 	`minLeft` {Number} null   left的最小值
*  - 	`maxLeft` {Number} null   left的最大值
*  - 	`minTop` {Number} null   top的最小值
*  - 	`maxTop` {Number} null top的最大值
*  - 	`dragClass` {String} null 'ui-drag-selected' 拖动时加的class
*
***举例**
* 
*js部分
*
*	$('#drag').drag({
*		lockX:true,
*		minTop:0,
*		maxTop: 30,
*		drag:function(data){
*			//console.log(data.top+','+data.left)
*		}
*	});
* 
*html部分
*	
*	<div class="ui-drag" id="drag">
*		drag
*	</div>		
*
* **update**
* 2013-11-13 11:11:00
*
*/

;(function($, undefined) {
	$.ui.define('drag', {
		 options: {
			lockX : false,//锁定X
			lockY : false,//锁定Y
			start : null,//开始拖动回调
			drag : null,//拖动中回调 返回left,top
			end : null,//结束拖动回调
			minLeft:null,//left的最小值
			maxLeft:null,//left的最大值
			minTop:null,//top的最小值
			maxTop:null,//top的最大值
			dragClass:'ui-drag-selected'//拖动时加的class
		},
		init:function(){
			this.styleInit();
			this.bind();
		},
		bind:function(){
			var self = this;
			this.el.bind('mousedown',function(event){
				self.mousedown(event);
			});
		},
		styleInit:function(){
			var style = {
				position:'absolute'
			};
			 if(this.el.css('top') == 'auto') style.top = 0;
			 if(this.el.css('left') == 'auto') style.left = 0;
			 this.el.css(style);
		},
		/**
         * mousedown
         * @method mousedown
         */
		mousedown:function(event){
			var self = this;
			var opts = this.options;
			var el = this.el;
			el.addClass(opts.dragClass);

			this.x = event.clientX;
			this.y = event.clientY;
			this.left = parseInt( el.css('left'));
			this.top = parseInt( el.css('top'));
			
			$(document).bind('mousemove',function(event){
				 self.mousemove(event); 
			})

			if(opts.start != null) opts.start.call();
			event.preventDefault();
		},
		/**
         * mousemove
         * @method mousemove
         */
		mousemove:function(event){
			var opts = this.options;
			var el = this.el;

			var top,left;
			if (!opts.lockY){
				top = this.top + ( event.clientY - this.y);
				if (opts.minTop!=null && top < opts.minTop) top = opts.minTop;
				if (opts.maxTop!=null && top > opts.maxTop) top = opts.maxTop;
				el.css({top:top});
			}
	
			if (!opts.lockX){
				left = this.left + ( event.clientX - this.x);
				if (opts.minLeft!=null && top < opts.minLeft) left = opts.minLeft;
				if (opts.maxLeft!=null && top > opts.maxLeft) left = opts.maxLeft;
				el.css({left:left})
			}

			var arg = {};
			arg.left = left;
			arg.top = top;

			if(opts.drag != null) opts.drag.call(null,arg);

			$(document).bind('mouseup',function(event){
				$(document).unbind('mousemove');
				el.removeClass(opts.dragClass);
				if(opts.end != null) opts.end.call(null);
			})

			event.preventDefault();
		}
	});
})(jQuery);
/**
*####下拉菜单####
* 
***Demo**
* [dropdown](../demo/dropdown/dropdown.html "Demo")
*
***参数**
*
*  - `nav` {String} 'ui-dropdown-item'  菜单className
*  - `current` {String} "hover"  选中时样式
*  - `topspeed` {Boolean} false  极速模式
*  - `boundary` {Number} 10  边界值修正
*  - `enterDelay` {Number} 0  菜单进入时delay
*  - ` leaveDelay` {Number} 0  菜单移除后delay
*
***举例**
*html部分
* 
*	<div class="ui-dropdown clearfix" id="dropdown2">
*		<ul class="ui-dropdown-body">
*			<li class="ui-dropdown-item">
*				<div class="ui-dropdown-nav"><a href="http://jd2008.jd.com/JdHome/OrderList.aspx">我的订单 </a> | </div>
*			</li>
*			<li class="ui-dropdown-item">
*				<div class="ui-dropdown-nav"><a href="http://app.jd.com/">手机京东</a> | </div>
*			</li>
*			<li class="ui-dropdown-item">
*				<div class="ui-dropdown-nav">客户服务</div>
*				<div class="ui-dropdown-main">
*					<ul>
*						<li><a href="http://help.jd.com/index.html" target="_blank"> 帮助中心 </a></li>
*						<li><a href="http://myjd.jd.com/repair/orderlist.action" target="_blank" rel="nofollow"> 售后服务</a> </li>
*						<li><a href="http://chat.jd.com/jdchat/custom.action" target="_blank" rel="nofollow"> 在线客服</a> </li>
*						<li><a href="http://myjd.jd.com/opinion/list.action" target="_blank" rel="nofollow"> 投诉中心 </a></li>
*						<li><a href="http://www.jd.com/contact/service.html" target="_blank"> 客服邮箱 </a></li>
*					</ul>
*				</div>
*			</li>
*		</ul>
*	</div> 
* 
* js部分
*
*	$('#dropdown2').dropdown();
*
* **update**
* 2013-10-21 17:31:29
*
*/
;(function($, undefined) {
	$.ui.define('dropdown', {
		 options: {
			nav:'ui-dropdown-item',//菜单className
			current:"hover",//选中时样式
			topspeed:false,//极速模式
			boundary:10,//边界值
			enterDelay:0,//菜单进入时delay
			leaveDelay:0//菜单移除后delay
        },
		init:function(){
			this.mouseLocs = [];
			this.lastDelayLoc = null;

			this.bind();
		},
		bind:function(){
			var self = this;
			var o = this.el;
			var opts = this.options;
			var item = o.find('.'+opts.nav);
			var showTag = false;
			var dropdownTimer,enterTimer; 
			var mouseLocsLength = 3;

			//事件绑定
			o.bind('mouseenter',function(){
				clearTimeout(dropdownTimer);
			});
			
			o.bind('mouseleave',function(){
				if (showTag){
					dropdownTimer = setTimeout(function(){
						item.removeClass(opts.current);
					},opts.leaveDelay);
				}
			});

			item.bind('mouseenter',function(){
				 var $this = $(this);
				 enterTimer = setTimeout(function(){
					if (self.topspeed($this) == 0){
						item.removeClass(opts.current);
						$this.addClass(opts.current);
						showTag = true;
						if(opts.callback) opts.callback.call(this,$this);
					 }
				 },opts.enterDelay);
			});

			item.bind('mouseleave',function(){
				clearTimeout(enterTimer);
			});

			 $(document).mousemove(function(e){
				self.mouseLocs.push({x: e.pageX, y: e.pageY});
				if (self.mouseLocs.length > mouseLocsLength) {
					self.mouseLocs.shift();
				}
			 });			 
		},
		/**
		* 极速模式
		* @method topspeed
		*/
		topspeed:function(){
			var opts = this.options;
			if (!opts.topspeed){
				return 0;	
			}
			
			var o = this.el;
			var offset = o.offset(),
			upperLeft = {
				x: offset.left,
				y: offset.top 
			},
			upperRight = {
				x: offset.left + o.outerWidth(),
				y: upperLeft.y
			},
			lowerLeft = {
				x: offset.left,
				y: offset.top + o.outerHeight()
			},
			lowerRight = {
				x: offset.left + o.outerWidth(),
				y: lowerLeft.y
			}
			loc = this.mouseLocs[this.mouseLocs.length - 1],
			prevLoc = this.mouseLocs[0];

			if (!loc) {
				return 0;
			}

			if (!prevLoc) {
				prevLoc = loc;
			}

			if (prevLoc.x < offset.left || prevLoc.x > lowerRight.x ||
				prevLoc.y < offset.top || prevLoc.y > lowerRight.y) {
				return 0;
			}

			if (this.lastDelayLoc && loc.x == this.lastDelayLoc.x && loc.y == this.lastDelayLoc.y) {
				return 0;
			}

			//求倾斜率
			function slope(a, b) {
				return (b.y - a.y) / (b.x - a.x);
			}

			var decreasingCorner = upperRight,
				increasingCorner = lowerRight;

			 var	decreasingSlope = slope(loc, decreasingCorner),
					prevDecreasingSlope = slope(prevLoc, decreasingCorner),
					
					increasingSlope = slope(loc, increasingCorner),
					prevIncreasingSlope = slope(prevLoc, increasingCorner);

			if (decreasingSlope < prevDecreasingSlope && increasingSlope > prevIncreasingSlope) {
			    if ( (prevLoc.x-upperLeft.x) < opts.boundary){
					return 0;
				}
				this.lastDelayLoc = loc;
				return 300;
			}

			this.lastDelayLoc = null;
			return 0;			 
		}
	});
})(jQuery);
/**
*####fixable固定位置####
* 
*可以使用元素固定在页面任意位置,并且位置不随滚动条滚动而改变
*兼容IE6的postion:fixed
*
***Demo**
* [fixable](../demo/fixable/fixable.html "Demo")
*
***参数**
*
*  - 	`x` {String}  'left'    左右
*  - 	`y` {String}   'top'    底尾部
*  - 	`xValue` {Number}  0   左右偏移值,center时为距中
*  - 	`yValue` {Number} 0   底尾部偏移值,center时为距中
*
***依赖**
*
* core/browser.js , core/extend.js
*
***举例**
* 
*html部分
*	
*	<div class="ui-fixable" id="fixable">
*		fixable
*	</div>		
*
*js部分
*
*	$('#fixable').fixable({
*		x:'right', 
*		y:'bottom',
*		xValue:0,
*		yValue:0
*	})
* 
* **update**
* 2013-11-12 9:11:39
*
*/

;(function($, undefined) {
	$.ui.define('fixable', {
		 options: {
			x:'left', //左右
			y:'top', //底尾部
			xValue:0 , //左右偏移值,center时为距中
			yValue:0  //底尾部偏移值,center时为距中
		},
		init:function(){
			var ele = this.el;
			var opts = this.options;
			var isLowBroswer = $.browser.isIE6();
			var currentStyle = {};

			var xValue = opts.xValue;
			var yValue = opts.yValue;
			
			if (xValue == 'center'){
				var w = ele.outerWidth() / 2 ;
				if (isLowBroswer){
					xValue = $.page.clientWidth() / 2 - w;
				}else{
					currentStyle.marginLeft = - w;
					xValue = '50%';
				}
			}

			if (yValue == 'center'){
				var h = ele.outerHeight() / 2;
				if (isLowBroswer){
					yValue = $.page.clientHeight() / 2 - h;
				}else{
					currentStyle.marginTop = - h;
					yValue = '50%';
				}
			}

			if (isLowBroswer){
				currentStyle.position = 'absolute' ;
				
				if (opts.y == 'top'){
					ele[0].style.setExpression("top", "eval((document.documentElement||document.body).scrollTop+" + yValue + ") + 'px'");
				}

				if (opts.y == 'bottom'){
					ele[0].style.setExpression("top", "eval((document.documentElement||document.body).scrollTop+ "+ - yValue + " + (document.documentElement||document.body).clientHeight-this.offsetHeight-(parseInt(this.currentStyle.marginTop,10)||0)-(parseInt(this.currentStyle.marginBottom,10)||0))+'px'");
				}

				if (opts.x == 'left'){
					ele[0].style.setExpression("left", "eval((document.documentElement||document.body).scrollLeft+" + xValue + ") + 'px'");
				}

				if (opts.x == 'right'){
					ele[0].style.setExpression("left", "(eval((document.documentElement||document.body).scrollLeft + "+ - xValue + " + (document.documentElement||document.body).clientWidth-this.offsetWidth)-(parseInt(this.currentStyle.marginLeft,10)||0)-(parseInt(this.currentStyle.marginRight,10)||0)) + 'px'");
				}
			} else {
				currentStyle.position = 'fixed' ;
				currentStyle[opts.x] = xValue;
				currentStyle[opts.y] = yValue;
			}

			ele.css(currentStyle);
		}
	});
})(jQuery);
/**
*####返回顶部####
* 
***Demo**
* [gotop](../demo/gotop/gotop.html "Demo")
*
***参数**
*
*  - `scrollTop` {Number} 50  滚动条高度达到此高度时显示
*
***举例**
* 
*	$('#gotop').gotop({
*		scrollTop:300
*	});
*
* **update**
* 2013-10-15 20:32:35
*
*/

;(function($, undefined) {
	$.ui.define('gotop', {
		 options: {
			scrollTop:50//滚动条高度达到此高度时显示
        },
		 /**
         * 显示
         * @method show
         */
		show:function(){
			this.el.show(); 
		},
		 /**
         * 关闭
         * @method hide
         */
		hide:function(){
			this.el.hide(); 
		},
		bind:function(){
			var self = this;
			this.el.bind('click',function(){
				self.hide();
				$(document).scrollTop(0);
			});

			$(window).scroll(function(){
				var scrollTop = $(document).scrollTop();
				if (scrollTop>self.options.scrollTop){
					self.show();
				}else{
					self.hide();
				}
			}); 
		},
		init:function(){
			this.bind();
			this.hide();
		}
	});
})(jQuery);
/**
 * ![jd](http://misc.360buyimg.com/lib/img/e/logo-201305.png "jd FE team")
 *
 * jdj是基于jQuery的轻量级UI组件库,符合jquery ui规范,组件提供了一些必要的公共方法
 *
 * 另外**jdf**是前端综合解决方案: 包括jdj常见UI组件,模块加载器,jdt工具包括JS打包合并,加时间戳等,以及JS文档生成工具jdd等
 *
 * jdj兼容 jQuery v1.2.6 ~ v1.6.2
 * 兼容IE6-IE10,chrome,firefox,safari等国内常见浏览器
 *
 * Beta版本下载 
 * [jdj_beta_v0.1.0](../build/jdj.js "jdj_beta_v0.1.0")  
 * [jdj_beta_v0.1.0压缩版本](../build/jdj_min.js "jdj_beta_v0.1.0压缩版本")  
 *
 */
/**
*####懒惰加载####
* 
***Demo**
* [lazyload](../demo/lazyload/lazyload.html "Demo")
* 
***参数**
*
*  - `type` {String} 'file'    加载js时为file,图片为img
*  - `source` {String}  'data-lazy-path'    加载js文件为data-lazy-path，图片类型默认为data-lazy-img
*  - `init` {String} 'data-lazy-init'    加载js文件时的初始化方法
*  - `delay` {Number} 100    滚动条滚动加载时加延时
*  - `space` {Number} 300    预加载距屏幕下多长的距离的元素
*  - `placeholder` {String} "http://misc.360buyimg.com/lib/skin/e/i/loading-jd.gif"   加载图片前的占位图片
*
* **依赖**
* seajs.js
*
***举例**
* 
*	$('body').lazyload();
*
* **update**
* 2013-10-23 9:18:05
*
*/


;(function($, undefined) {
	$.ui.define('lazyload', {
		options:{
			type:'file',
			source:'data-lazy-path',
			init:'data-lazy-init',
			delay:100,
			space:300,
			placeholder:"http://misc.360buyimg.com/lib/skin/e/i/loading-jd.gif"
		},
		init:function(){
			var self = this;
			var opts = this.options;
			var loadDone = false;
			self.isImg = false;
			if (opts.type == 'img'){
				self.isImg = true;
			}
			if (self.isImg && opts.source == 'data-lazy-path'){
				opts.source = 'data-lazy-img';
			}

			function lazyload(){
				var tag = 'div';
				if (opts.type =='img'){
					tag = 'IMG';
				}

				var item = $(tag,self.el);
				$.each(item,function(i){
					var $this = $(this);
					var path = $this.attr(opts.source);
					if (path){
						var scrollTop = $.page.clientHeight() + $(document).scrollTop()+opts.space;
						var top = $this.offset().top;
						var data = $this.attr(opts.init);
						if (opts.type == 'img'){
							data = $this.attr(opts.source);
						}
				       
					    //图片增加占位符
						if (self.isImg){
							//tag = 'IMG';
							var src = $this.attr('src');
							if (!src){
								$this.attr('src',opts.placeholder);
							}
						}

						loadDone = (data == 'done');
						if (scrollTop > top && !loadDone){
							if (self.isImg){
								$this.attr('src',data);
								$this.attr(opts.source,'done');
							}else{
								try{
									seajs.use(path,function(e){
										e.init(data);
										//eval(data);
										$this.attr(opts.init,'done');
									});
								}catch(e){}
							}
						}else if(loadDone){
							return;
						}
					}
				});
				
				if (loadDone){
					$(window).unbind('scroll',throttled);
				}
			}
			
			//为了首屏,初始化时加载一次
			lazyload();
			
			//加节流函数
			var throttleFn= function(){
				lazyload();
			};
			var throttled = $.throttle(throttleFn,opts.delay);
			$(window).bind('scroll',throttled);
		}
	});
})(jQuery);
/**
*####跑马灯####
* 
***Demo**
* [marquee](../demo/marquee/marquee.html "Demo")
*
***参数**
*
*  - 	`align` {String}   'left' 向左或向上滚动left,top
*  - 	`step`  {Number} 1  步长
*  - 	`delay` {Number}  50 时间间隔
*  - 	`mainClass` {String}  'ui-marquee-main' 主体样式
*  - 	`itemClass` {String}  'ui-marquee-item' 列表样式
*  - 	`timeout` {Number}  1000 延时timeout后触发
*
***举例**
* 
*js部分
*
*	$('#marquee').marquee();
* 
*html部分
*	
*	<div class="ui-marquee" id="marquee">
*		<ul class="ui-marquee-main">
*			<li class="ui-marquee-item"><a href="#" target="_blank">● 1 你敢抢？我减！我就敢减！</a> </li>
*			<li class="ui-marquee-item"><a href="#" target="_blank">● 2 京豆体系上线公告</a> </li>
*		</ul>
*	</div>		
*
* **update**
* 2013-11-12 9:11:39
*
*/

;(function($, undefined) {
	$.ui.define('marquee', {
		 options: {
			align:'left',//向左或向上滚动left,top
			step : 1 ,//步长
			delay : 40,//时间间隔
			mainClass : 'ui-marquee-main',//主体样式
			itemClass : 'ui-marquee-item',//列表样式
			timeout : 1000//延时timeout后第一次触发
		},
		init:function(){
			var opts = this.options;
			var el = this.el.find('.'+opts.mainClass);
			var main = this.el.find('.'+opts.mainClass);
			var item = this.el.find('.'+opts.itemClass);
			
			var direction = - 1;

			var styleType = 'width';
			var rollType = 'left';
			var half = main.outerHeight() 
			
			var marqueeTimer;

			if (opts.align == 'top'){
				styleType = 'height';
				rollType = 'top';
			}else if (opts.align == 'left'){
				//以第一个元素为基准
				var width = item.eq(0).outerWidth();
				half = width*2;
				item.css({float:'left',width:width});
				main.css(styleType,half*2);
			}
		
			this.el.css({position:'relative'});
			main.css({position:'absolute'});
			//clone一份
			main[0].innerHTML += main[0].innerHTML;
			
			var i = 0;
			var star = function(){
				marqueeTimer = setInterval(function(){
					if (i >= half){
						i=0;
					}
					i += opts.step;

					main.css(rollType, direction * i);
				},opts.delay);
			}

			setTimeout(function(){
				star();
			},opts.timeout);
			
			this.el.bind('mouseover',function(){
				clearInterval(marqueeTimer);
			})

			this.el.bind('mouseout',function(){
				 star();
			})
		}
	});
})(jQuery);
/**
*####分页组件####
* 
***Demo**
* [page](../demo/pager/pager.html "Demo")
*
***参数**
*
*  - `currentPageClass ` {String} 'current'  当前页样式
*  - `currentPage `{Number}  1  当前页
*  - `totalPage ` {Number} 9  总页数
*  - `viewSize `  {Number} 5  显示几页
*  - `labelFirst ` {String} '首页'  首页文案
*  - `labelPrev ` {String} '上一页'  上一页文案
*  - `labelNext `{String}  '下一页'  下一页文案
*  - `labelLast `{String}  '尾页'  尾页文案
*  - `callback`{Function} null 回调函数
*
***举例**
* 
*	$('#pager').pager();
*
* **update**
* 2013-11-8 15:32:38
*
*/

;(function($, undefined) {
	$.ui.define('pager', {
		options: {
			currentPageClass : 'current',//当前页样式
			currentPage : 1,//当前页
			totalPage : 9,//总页数
			viewSize : 5,//显示几页
			labelFirst : '首页',//首页文案
			labelPrev : '上一页',//上一页文案
			labelNext : '下一页',//下一页文案
			labelLast : '尾页',//尾页文案
			callback:null//回调函数
        },
		 /**
         * 显示
         * @method rander
         */
		rander:function(){
			var opts = this.options;
			var html = '';
			if (opts.currentPage <1){
				opts.currentPage  =1;
			}

			if (opts.currentPage > opts.totalPage){
				opts.currentPage  = opts.totalPage;
			}

			var begin = 1;
			var end = opts.viewSize;

			if (opts.currentPage > opts.viewSize){
				var m = Math.floor(opts.currentPage / opts.viewSize);
				if ( (opts.currentPage % opts.viewSize) === 0){
					m = m - 1;
				}
				if (m>=1){
					begin = m*opts.viewSize+1;
					end = (m+1)*opts.viewSize;
				}
			}

			if (end>opts.totalPage){
				end  = opts.totalPage;
			}

			html +=  '<a rel="1" href="javascript:void(0)">'+opts.labelFirst+'</a>';
			if (opts.currentPage>1){
				html +=  '<a rel="'+(opts.currentPage-1)+'" class="ui-pager-prev" data-pager="true" href="javascript:void(0)">上一页</a>';
			}

			for (var i = begin ; i < end +1; i++ ){
				var classHtml = '';
				if (i==opts.currentPage){
					classHtml = ' class='+opts.currentPageClass;
				}
				html += '<a rel="'+i+'" '+classHtml+' href="javascript:void(0)">'+i+'</a>';
			}
		
			if (opts.currentPage<opts.totalPage){
				html +=  '<a rel="'+(opts.currentPage+1)+'" class="ui-pager-next" data-pager="true" href="javascript:void(0)">下一页</a>';
			}
			
			html +=  '<a rel="'+opts.totalPage+'" href="javascript:void(0)">'+opts.labelLast+'</a>';

			this.el.html(html);
		},
		/**
        * 更新
        * @method update
        */
		update:function(num){
			var opts = this.options;
			opts.currentPage = parseInt(num);
			this.rander();
			this.bind();
			if (opts.callback){
				opts.callback(opts.currentPage);
			}
		},
		bind:function(){
			var me = this;
			this.el.find('a').bind('click',function(){
				var $this = $(this);
				if (!$this.attr('data-pager')){
					me.update($(this).attr('rel'));
				}
			})
				
			this.el.find('.ui-pager-prev').bind('click',function(event){
				me.update($(this).attr('rel'));
			})

			this.el.find('.ui-pager-next').bind('click',function(event){
				 me.update($(this).attr('rel'));
			})
		},
		init:function(){
			var me = this;
			this.rander();
			this.bind();
		}
	});
})(jQuery);
/**
*####模拟滚动条####
* 
* 模拟原生滚动条,支持鼠标中轮滑动,内容变更可更新滚动条高度
* 
***Demo**
* [scrollbar](../demo/scrollbar/scrollbar.html "Demo")
*
***参数**
*
*  - 	`wrapClass` {String} 'ui-scrollbar-wrap'  主体class
*  - 	`width` {Number} 12  滚动条宽度
*  - 	`mixHeight` {Number} 30  滚动条最小高度
*  - 	`scrollClass` {String} 'isScroll'  滚动条class
*  - 	`step` {Number} 5  滚动条步进值
*  - 	`limit` {Boole} true 滑轮超出边界是否继续滚动
*
***举例**
* 
*js部分
*
*	var scrollbar = $('#scrollbar').scrollbar();
*	scrollbar.update();//更新时调用
* 
*html部分
*	
*	<div class="ui-scrollbar" id="scrollbar">
*		scrollbar
*	</div>		
*
* **update**
* 2013-11-13 9:11:39
*
*/

;(function($, undefined) {
	$.ui.define('scrollbar', {
		 options: {
			scrollClass : 'ui-scrollbar-item',//滚动条class
			mainClass:'ui-scrollbar-main',//主体clsass
			wrapClass : 'ui-scrollbar-wrap',//最外层class
			width : 10,//滚动条宽度
			mixHeight : 15,//滚动条最小高度
			step :5, //滚动条步进值
			limit:true //滑轮超出边界是否继续滚动
		},
		//原理: 总体高度H  试图区域高度h1  滚动条高度h2  
		//(H-h1)/H = (h1-h2)/h1   即h2 = h1*h1 / H
		init:function(){
			this.create();
			this.scrollInit();
			this.bind();
			this.dragInit();
		},
		/**
		* 更新滚动条
		* @method update
		*/
		update:function(){
			this.scrollInit();
			this.dragInit();
		},
		/**
		* 创建滚动条
		* @method create
		*/
		create:function(){
			var opts = this.options;
			this.el.css({position:'absolute',left:0,top:0});

			this.wrapWidth = this.el.outerWidth();
			this.wrapHeight = this.el.outerHeight();

			var main = $(document.createElement('div'));
			main.addClass(opts.wrapClass);
			this.el.after(main);
			main.append(this.el);
			this.main = main;
			
			var scroll = $(document.createElement('div'));
			scroll.addClass(opts.scrollClass);
			this.el.after(scroll);
			this.scroll = scroll;

			this.main.css({
				position:'relative',
				overflow:'hidden',
				width:this.wrapWidth,
				height:this.wrapHeight
			});
			
			this.scroll.css({
				position:'absolute',
				left:this.wrapWidth-this.options.width,
				top:0,
				width:this.options.width
			});
		},
		/**
		* 滚动条初始化
		* @method scrollInit
		*/
		scrollInit:function(){
			var opts = this.options;
			var itemHeight = this.el.find('.'+opts.mainClass).outerHeight();
			if ( itemHeight - this.wrapHeight <= 0){
				this.scroll.hide();
			}else{
				var H = this.H = itemHeight;//主体所有高度
				var h1  = this.h1 = this.wrapHeight;//可视区域高度
				var h2  = parseInt ( ( h1 * h1 ) / H ); //滚动条高度
				if (h2<opts.mixHeight) h2 = opts.mixHeight;
			    this.h2 = h2;
				this.el.css({height:H})
				this.scroll.css({height:h2}).show();
			}
		},
		bind:function(){
			var self = this;
			var mousewheelEvent = 'mousewheel';
			var isFirefox = $.browser.mozilla;
			if (isFirefox) mousewheelEvent = 'DOMMouseScroll';
			this.main.bind(mousewheelEvent,function(event){
				var stepValue;
				//jquery v1.6.4 + no event.wheelDelta
				var wheelValue = event.wheelDelta;
				if (isFirefox) wheelValue = - event.detail;
				if (wheelValue){
					self.mousewheel(wheelValue);
				}

				if (self.limit && self.options.limit){
					event.preventDefault();
				}
			});
		},
		//设置滚动条top值
		setTop:function(top){
			var top = [( this.H - this.h1) / (this.h1-this.h2)] * top;
			this.el.css({top:-top});
		},
		//拖拽初始化
		dragInit:function(){
			var me = this;
			var maxTop =  this.wrapHeight - this.h2 ;
			this.scroll.drag({
				lockX:true,
				minTop:0,
				maxTop: maxTop,
				drag:function(data){
					me.setTop(data.top);
				}
			})
		},
		top:0,
		mousewheel:function(wheelValue){
			var h1 = this.h1;
			var h2 = this.h2;
			var H  = this.H;
			var step = this.options.step * parseInt( (H-h1) / h1);
			var top = this.top;

			var scrollStepValue = ( 1 / step ) * (h1-h2);
			if (wheelValue<0){
				top += scrollStepValue;
			}else{
				top -= scrollStepValue;
			}

			if ( ( top > (h1 - h2) ) || top < 0 ){
				this.limit = false;
			}else{
				this.limit = true;
			}

			if (top>(h1-h2) && wheelValue<0) top=(h1-h2);
			if (top<0 && wheelValue>0) top=0;
			
			this.scroll.css({top:top});
			this.setTop(top);
			this.top = top;
		}
	});
})(jQuery);
/**
*####智能提示组件####
* 
***Demo**
* [gotop](../demo/suggestion/suggestion.html "Demo")
*
***参数**
*
*  - `url` {String} "http://dd.search.360buy.com/?key=" 来源url
*  - `dataType` {String} jsonp 请求类型
*  - `mainId` {String} 主体ID
*  - `mainClass` {String} 主体样式名称
*  - `callback` {Function} 点击后回调函数
*  - `itemTpl` {String}  列表模版
*
***举例**
* 
*	$('#suggestion').suggestion({
*		url:"http://dd.search.360buy.com/?key=",
*		dataType:"jsonp",
*		mainId :'suggestion'
*	});
*
* **依赖**
* core/tpl.js , core/extend.js
*
* **update**
* 2013-11-11 15:54:53
*
*/

;(function($, undefined) {
	$.ui.define('suggestion', {
		 options: {
			url:"http://dd.search.360buy.com/?key=",
			dataType:"jsonp",
			mainId :'suggestionMain',
			mainClass :'ui-suggestion-content',
			callback:null,
			itemTpl:'<li class="ui-suggest-item"><a href="javascript:void(0)" class="ui-suggest-key"><%=keyword%></a></li>'
        },
		init:function(){
			var opts = this.options;
			$('body').append($('<ul id="'+opts.mainId+'" style="display:none" class="'+opts.mainClass+'"></ul>'));
			this.main = $('#'+opts.mainId);

			this.set();
			this.bind();
		},
		bind:function(){
			var me = this;
			this.el.keyup(function(e){
				var key = $(this).val();
				me.get(key);
			});

			this.el.click(function(){
				me.get('');
			})

			$(window).resize(function(){
				me.set();
			})

			//点空白隐藏
			$(document).click(function(event){
				if ($.contains(event.target,me.main[0])){
					me.hide();
				}
			})
		},
		rander:function(data){
			var me = this;
			var sugLength = data.length ;
			if (sugLength>0){
				for (var i =0 ; i<sugLength ;i++ ){
					var html = '';
					for (var i=0 ; i<sugLength ;i ++ ){
						var keyword = $.trim(data[i].keyword);
						if (keyword != 'undefined' && typeof(keyword) != 'undefined' ){
							html += $.tpl(me.options.itemTpl,data[i]);
						}
					}
					html += '<li class="ui-suggest-close"><a href="javascript:void(0)">关闭</a></li>'
					me.main.html(html).show();
				
					me.main.find('.ui-suggest-item').click(function(){
						var key = $(this).text();
						key = $(this).find('.ui-suggest-key').text();
						me.hide();
						me.el.val(key);
						if (me.options.callback){
							me.options.callback.call();
						}
					})

					me.main.find('.ui-suggest-close').click(function(){
						me.hide();
					})
				}
			}else{
				me.hide();
			}
		},
		hide:function(){
			 this.main.hide();
		},
		set:function(){
			var left = this.el.offset().left;
			var top = this.el.offset().top;
			var height = this.el.outerHeight();
			top = top + height;
			 this.main.css({position:'absolute',top:top,left:left})
		},
		/**
		 * 获取数据
		 * @method get
		 * @param {Object} key 关键词
		 */
		get:function(key){
			var me = this;
			var opts = me.options;
			$.ajax({
				url:opts.url+key,
				dataType:opts.dataType,
				success:function(data){
					me.rander(data);
				}
			});
		}
	});
})(jQuery);
/**
*####switch切换组件####
* 
* switch切换组件提供一个可切换的panel,可广泛应用在tab切换,focus焦点图,slider,旋转木马carousel等
* 
***Demo**
* [tab切换](../demo/switchable/tab.html "Demo")
* [focus焦点图](../demo/switchable/focus.html "Demo")
* [slider](../demo/switchable/slider.html "Demo")
* [carousel旋转木马](../demo/switchable/carousel.html "Demo")
*
***参数**
*
*  - `type`   {String}  'tab'    panel方式tab,focus,slider,carousel
*  - `direction`   {String}  'left'   slider类型的方向值 left,up
*  - `navClass`   {String}  'ui-switchable-trigger'    nav的className
*  - `navItem`  {String}   'ui-switchable-item'    nav中item的className
*  - `navSelectedClass`  {String}   'ui-switchable-selected'    nav选中时className
*  - `navIframe`  {String}   'data-iframe'    nav中iframe的配置项
*  - `mainClass`  {String}   'ui-switchable-panel'    主体的className
*  - `mainSelectedClass`  {String}   'ui-switchable-selected' 主体选中时className
*  - `tabSetup`   {Boolean}  'left'   tab的显示和隐藏是否自己处理
*  - `page`  {Boolean}  false    是否带翻页
*  - `autoLock` {Boolean}   false    带翻页时超过最大值是否锁定
*  - `prevClass`  {String}   'ui-switchable-prev'    带翻页时上一页的className
*  - `nextClass`  {String}   'ui-switchable-next'    带翻页时下一页的className
*  - `pageCancel` {String}    'ui-switchable-cancel'    分页不能点击时的增加class
*  - `hasArrow` {Boolean}   false    tab下面小箭头(特殊需求)
*  - `arrowClass`   {String}  'ui-switchable-arrow'    小箭头(className)
*  - `event`  {String}   'mouseover'    绑定事件建议为mouseover||click
*  - `callback` {Function}   null    回调函数
*  - `speed` {Number} || {String}  400  动画速度值:fast,slow或者具体数字
*  - `delay`  {Number}  150    延时触发
*  - `defaultPanel`   {Number}  0    默认选中的panel,第一个为0
*  - `autoPlay`  {Boolean}  false    自动播放
*  - `stayTime`  {Number}  5000  自动播放间隔时间
*
* **依赖**
* core/browser.js , core/extend.js
*
***举例**
* html部分
*
*	<div class="ui-switchable clearfix" id="tab">
*		<ul class="ui-switchable-nav clearfix">
*			<li class="ui-switchable-item">今日特价</li>
*			<li class="ui-switchable-item">热卖商品</li>
*			<li class="ui-switchable-item">最新降价</li>
*			<li class="ui-switchable-item">新品到货</li>
*		</ul>
*		<div class="ui-switchable-body clearfix">
*			<div class="ui-switchable-panel-main">
*				<div class="ui-switchable-panel" ><img src="http://img13.360buyimg.com/da/g14/M05/15/1C/rBEhVVJfWUwIAAAAAADuXEur8t8AAER1AJFwNkAAO50477.jpg" /></div>
*				<div class="ui-switchable-panel" style="display:none;"><img src="http://img13.360buyimg.com/da/g14/M04/16/05/rBEhVlJgxDkIAAAAAADnpQs6f5gAAEVKwFHGIwAAOe9074.jpg" /></div>
*				<div class="ui-switchable-panel" style="display:none;"><img src="http://img10.360buyimg.com/da/g15/M03/0F/18/rBEhWFJeTdgIAAAAAADnzmiSQTQAAENfwKFvmMAAOfm066.jpg" /></div>
*				<div class="ui-switchable-panel" style="display:none;"><img src="http://img11.360buyimg.com/da/g14/M00/15/15/rBEhVlJeCegIAAAAAADhV3zKug8AAEO1AGW8mYAAOFv185.jpg" /></div>
*			</div>
*		</div>
*	</div>
*
*
* js部分
* 
*	$('#tab').switch({
*		type:'tab'
*	});
*
* **update**
* 2013-10-17 9:10:17
*
*/

;(function($, undefined) {
	$.ui.define('switchable', {
		options:{
			type:'tab',//panel方式tab,focus,slider,carousel
			direction:'left',//slider的方向值 left,up
			tabSetup: false,//tab类型的显示和隐藏是否自己处理
			navClass:'ui-switchable-trigger',//nav的className
			navItem:'ui-switchable-item',//nav中item的className
			navSelectedClass:'ui-switchable-selected',//nav选中时className
			navIframe:'data-iframe',//nav中iframe的配置项
			
			mainClass:'ui-switchable-panel',//主体的className
			mainSelectedClass:'ui-switchable-selected',//主体选中时className
			
			page:false,//翻页
			autoLock:false,//超过数量时是否锁定
			prevClass:'ui-switchable-prev',//上一页
			nextClass:'ui-switchable-next',//下一页
			pageCancel:'ui-switchable-cancel',//分页不能点击时的增加class
			
			hasArrow:false,//tab下面小箭头,特殊需求
			arrowClass:'ui-switchable-arrow',//小箭头className

			event:'mouseover',//绑定事件建议为mouseover||click
			speed:400,//动画速度值
			callback:null,//回调函数
			delay:150,//延时触发
			defaultPanel:0,//默认选中的panel
			autoPlay:false,//自动播放
			stayTime:5000//自动播放间隔时间
		},
		init:function(){
			var self = this;

			self.nav = self.el.find('.'+self.options.navItem);
			self.main = self.el.find('.'+self.options.mainClass);
			self.size = self.main.size();

			var now = this.options.defaultPanel;
			this.last = now;
			this.current = now;
			this.isInit = true;
			this.switchTo(now);

			self.autoInterval=null;
			self.eventTimer=null;

			self.page();
			self.autoPlay();

			this.bind();
		},
		bind:function(){
			var self = this;
			self.nav.each(function(i){
				$(this).bind(self.options.event,function(){
					clearTimeout(self.eventTimer);
					clearInterval(self.autoInterval);
					self.eventTimer = setTimeout(function(){
						self.current = i;
						self.switchTo(i);
					},self.options.delay);
				}).bind('mouseleave',function(){
					clearTimeout(self.eventTimer);
					self.autoPlay();
				 });

				if (self.options.event=='click'){
					$(this).bind('mouseover',function(){
						clearTimeout(self.eventTimer);
						clearInterval(self.autoInterval);
					})
				}
			})
		},
		/**
		* 展示选中的panel
		* @param {Number} i 展示panel i
        * @method switchTo
		*/
		switchTo:function(i){
			var self = this;
			var opts = this.options;

			this.iframe(i);

			this.nav.removeClass(opts.navSelectedClass);
			this.nav.eq(i).addClass(opts.navSelectedClass);

			this.main.removeClass(opts.mainSelectedClass);
			this.main.eq(i).addClass(opts.mainSelectedClass);
			
			//当前panel重复多次点击时仅触发第一次
			if (!this.isInit && this.last == i ){
				return;	
			}

			this.switchType(i);
			
			if (opts.callback!=null){
				opts.callback.call(this,i,this.nav.eq(i));
			}
			
			this.last = i;
		},
		/**
		* 展示不同类型的panel
        * @method switchType
		* @param {Number} i 展示不同类型的panel i
		*/
		switchType:function(i){
			var self = this;
			var opts = this.options;
			switch (opts.type){
				case "tab":
					this.tab(i);
					break ;
				case "focus":
					this.focus(i);
					break ;
				case "slider":
					this.slider(i);
					break ;
				case "carousel":
					this.carousel(i);
					break ;
			}
		},
		/**
		* 默认panel配置,也可应用tab
		* @param {Number} i 切换panel i
        * @method switchDefault
		*/
		switchDefault:function(i){
			this.main.hide();
			this.main.eq(i).show();
		},
		/**
		* tab切换
        * @method tab
		* @param {Number} i 切换panel i
		*/
		tab:function(i){
			if (!this.options.tabSetup){
				this.switchDefault(i);
			}

			if (this.options.hasArrow){
				var arrowClass = this.options.arrowClass ;
				var left = (this.nav.eq(i).outerWidth()+20) * i;
				if (this.isInit){
					var navParent = this.nav.parent();
					navParent.prepend('<div class="'+arrowClass+'"><b></b></div>').css({position:'relative'});
					this.el.find('.'+arrowClass).css({left:left});
				}else{
					this.el.find('.'+arrowClass).stop(true).animate({left:left},this.options.speed);
				}
			}

			this.isInit = false;
		},
		/**
		* 焦点图
        * @method focus
		* @param {Number} i 切换panel i
		*/
		focus:function(i){
			if (this.isInit){
				this.main.parent().css({position:'relative'})
				this.main.css({position:'absolute',zIndex:0,opacity:0}).show();
				this.main.eq(i).css({zIndex:1,opacity:1})
			}else{
				this.main.eq(this.last).css({zIndex:0}).stop(true).animate({opacity:1},this.options.speed,function(){ 
					$(this).css('opacity',0); 
				});
			}
			this.main.eq(i).css({zIndex:1}).stop(true).animate({opacity:1},this.options.speed);
			this.isInit = false;
		},
		/**
		* slider
        * @method slider
		* @param {Number} i 切换panel i
		*/	
		slider:function(i){
			var opts = this.options;
			var body = this.main.parent();
			var height = this.main.outerHeight() * i;
			var width = this.main.outerWidth() * i;

			if (this.isInit){
				if (opts.direction == 'left'){
					//左右滚动
					this.main.css({float:'left'})
					body.css({width:this.el.outerWidth()*this.size});
					body.css({left:-width});
				}else if (opts.direction == 'top'){
					//上下滚动 
					body.css({top:-height});
				}
				this.switchDefault(i);
				this.isInit = false;						
			}else{
				if (opts.direction == 'left'){
					//左右滚动
					body.stop(true).animate({left:-width},this.options.speed);
				}else if (opts.direction == 'top'){
					//上下滚动 
					body.stop(true).animate({top:-height},this.options.speed);
				}
				this.main.show();
			}
		},
		/**
		* 悬转木马
        * @method carousel
		* @param {Number} i 切换panel i
		*/	
		carousel:function(i){
			this.slider(i);
		},
		/**
		* 翻页
        * @method page
		*/	
		page:function(){
			var self = this;
			if (self.options.page){	
				var next = this.el.find('.'+this.options.nextClass);
				var prev = this.el.find('.'+this.options.prevClass);
				var cancelClass = this.options.pageCancel;
				prev.bind('click',function(){
					if (self.options.autoLock){
						next.removeClass(cancelClass);
						if (self.current==1){
							$(this).addClass(cancelClass);
						}
						if (self.current==0){
							return;
						}
					}
					self.prev();
				});

				next.bind('click',function(){
					if (self.options.autoLock){
						prev.removeClass(cancelClass);
						if (self.current==self.size-2){
							$(this).addClass(cancelClass);
						}
						if (self.current==self.size-1){
							return;
						}
					}
					self.next();
				});

				if (self.current==0 && self.options.autoLock){
					prev.addClass(cancelClass);
				}
			}
		},
		/**
		* 下一帧
        * @method next
		*/	
		next:function(){
			this.current = this.current+1;
			if (this.current>=this.size){
				this.current = 0;
			}
			this.switchTo(this.current);
		},
		/**
		* 上一帧
        * @method prev
		*/	
		prev:function(){
			this.current = this.current - 1;
			if (this.current<0){
				this.current = this.size-1;
			}
			this.switchTo(this.current);
		},
		/**
		* 自动播放
		* @method autoPlay
		*/
		autoPlay:function(){
			var self = this;
			if (this.options.autoPlay){
				self.autoInterval = setInterval(function(){
					self.next();
				},self.options.stayTime);	
			}
		},
		/**
		* iframe配置
		* @method iframe
		*/
		iframe:function(i){
			var self = this;
			var $main = self.main.eq(i);
			var $nav = self.nav.eq(i);
			var iframeSrc = $nav.attr(self.options.navIframe);
			if (iframeSrc){
				var iframe = document.createElement('iframe');
				iframe.src = iframeSrc;
				$main.html(iframe);
				$nav.removeAttr(self.options.navIframe);
			}
		}
	});
})(jQuery);
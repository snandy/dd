/**
 * JavaScript Dragdrop Library
 * Copyright (c) 2010 snandy
 * 
 * 基本拖拽
 * var dd = new Dragdrop({
 *     elem     拖拽元素 HTMLElemnt 必选
 *     handle     指定鼠标按下哪个元素时开始拖拽，实现模态对话框时用到 
 *     dragable   是否可拖拽    (true)默认
 *     dragX      true/false false水平方向不可拖拽 (true)默认
 *     dragY      true/false false垂直方向不可拖拽 (true)默认
 *     area       [minX,maxX,minY,maxY] 指定拖拽范围 默认任意拖动
 *     inwin      true/false 仅在浏览器窗口内拖动
 *     fixed      true/false 出现滚动条时保持fixed 默认true
 * });
 * 
 * 事件
 * dragstart
 * dd.onstart = function() {}
 * 
 * darg
 * dd.ondrag = function() {}
 * 
 * dragend
 * onend = function() {}
 * 
 * demo.html
 * 
 */

Dragdrop = function(window) {
    var doc = window.document
    var w3c = !!window.addEventListener
    var addEvent = w3c ?
            function(el, type, fn) { el.addEventListener(type, fn, false) } :
            function(el, type, fn) { el.attachEvent("on" + type, fn) }
    var removeEvent = w3c ?
            function(el, type, fn) { el.removeEventListener(type, fn, false) } :
            function(el, type, fn) { el.detachEvent("on" + type, fn) }
    
    // 获取视窗宽度
    function getWinWidth() {
        var arr = []
        if (window.innerWidth) {
            arr.push(window.innerWidth)
        }
        if (document.documentElement) {
            arr.push(document.documentElement.clientWidth)
        }
        return Math.min.apply({}, arr)
    }

    // 获取视窗高度
    function getWinHeight() {
        var arr = []
        if (window.innerHeight) {
            arr.push(window.innerHeight)
        }
        if (document.documentElement) {
            arr.push(document.documentElement.clientHeight)
        }
        return Math.max.apply({}, arr)
    }
    
    // 配置类
    function Config(opt) {
        this.elem     = opt.elem
        this.handle   = opt.handle
        this.dragable = opt.dragable !== false
        this.dragX    = opt.dragX !== false
        this.dragY    = opt.dragY !== false
        this.area     = opt.area || []
        this.inwin    = opt.inwin
        this.cursor   = opt.cursor || 'move'
    }
        
    return function(opt) {
        var conf, defaultConf, diffX, diffY, dd
        
        function Dragdrop(opt) {
            var elDown
            if (!opt) return
            
            conf = new Config(opt)
            defaultConf = new Config(opt)
            elDown = conf.handle || conf.elem
            elDown.style.cursor = conf.cursor
            addEvent(elDown, 'mousedown', mousedown)
            
            // 出现滚动条时保持fixed
            if (conf.fixed) {
                var docEl = doc.documentElement
                var elem  = conf.elem
                addEvent(window, 'scroll', function() {
                    var winHeight = getWinHeight()
                    var top = (winHeight)/2 - (elem.clientHeight)/2 + docEl.scrollTop
                    elem.style.top = top + 'px'
                })
            }
        }
        Dragdrop.prototype = {
            dragX: function() {
                conf.dragX = true
                conf.dragY = false
            },
            dragY: function(b) {
                conf.dragY = true
                conf.dragX = false
            },
            dragAll: function() {
                conf.dragX = true
                conf.dragY = true
            },
            setArea: function(a) {
                conf.area = a
            },
            setHandle: function(b) {
                conf.handle = b
            },
            setDragable: function(b) {
                conf.dragable = b
            },
            reStore: function() {
                conf = new Config(defaultConf)
                conf.elem.style.top = '0px'
                conf.elem.style.left = '0px'
            },
            getDragX: function() {
                return conf.dragX
            },
            getDragY: function() {
                return conf.dragY
            }
        }
        function mousedown(e) {
            var el = conf.elem
            el.style.position = 'absolute'
            
            if (window.captureEvents) { //标准DOM
                e.stopPropagation()
                e.preventDefault()
                addEvent(window, "blur", mouseup)
            } else if(el.setCapture) { //IE
                el.setCapture()
                e.cancelBubble = true
                addEvent(el, "losecapture", mouseup)
            }
            
            diffX = e.clientX - el.offsetLeft
            diffY = e.clientY - el.offsetTop
            addEvent(doc, 'mousemove', mousemove)
            addEvent(doc, 'mouseup', mouseup)
            // dragstart event
            if (dd.onstart) {
                dd.onstart()
            }
        }
        function mousemove(e) {
            var el = conf.elem, minX, maxX, minY, maxY,
                moveX = e.clientX - diffX,
                moveY = e.clientY - diffY
    
            if (conf.inwin) {
                var bodyWidth = getWinWidth()
                var bodyHeight = getWinHeight()
                var winX = bodyWidth - Math.max(el.offsetWidth, el.clientWidth)
                var winY = bodyHeight - Math.max(el.offsetHeight, el.clientHeight)
                conf.area = [0, winX, 0, winY]
            }
            if (conf.area) {
                minX = conf.area[0]
                maxX = conf.area[1]
                minY = conf.area[2]
                maxY = conf.area[3]
                moveX < minX && (moveX = minX) // left 最小值
                moveX > maxX && (moveX = maxX) // left 最大值
                moveY < minY && (moveY = minY) // top 最小值
                moveY > maxY && (moveY = maxY) // top 最大值
            }
            if (conf.dragable) {
                //设置位置，并修正margin
                moveX = moveX - (parseInt(el.style.marginLeft, 10) || 0)
                moveY = moveY - (parseInt(el.style.marginTop, 10) || 0)
                conf.dragX && (el.style.left = moveX + 'px')
                conf.dragY && (el.style.top =  moveY + 'px')
            }
            // drag event
            if (dd.ondrag) {
                dd.ondrag(moveX, moveY)
            }
        }
        function mouseup(e) {
            var el = conf.elem
            removeEvent(doc, 'mousemove', mousemove)
            removeEvent(doc, 'mouseup', mouseup)
            
            if (window.releaseEvents) { //标准DOM
                removeEvent(window, 'blur', mouseup)
            } else if(el.releaseCapture) { //IE
                removeEvent(el, 'losecapture', mouseup)
                el.releaseCapture()
            }
            // dragend evnet
            if (dd.onend) {
                dd.onend()
            }
        }
        
        return dd = new Dragdrop(opt)
    }
    
}(this);

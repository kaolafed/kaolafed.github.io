/*
 * --------------------------------------------
 * 项目内工具函数集合，此页面尽量写注释
 * @version  1.0
 * @author   yuqijun(yuqijun@corp.netease.com)
 * --------------------------------------------
 */
define([
    ], function() {

	var _ = {},
    cache = {},
    startX, startY, startTime, endTime;
var Id = function(elm) {
    var id = elm.id;
    if (!id) {
    	id = Math.round(Math.random() * 10000000)
        elm.id = id;
    }
    return id;
}
var log = (function(){
	var result = document.getElementById('result');
	return function(_log){
		if(!result){
			return;
		}
		result.innerHTML += _log+'<br/>';
	}
})()
/**
 * 鼠标和touch事件的兼容
 */
function getTouch(e) {
    var touch;
    if (!e.changedTouches) {
        touch = e;
    } else {
        touch = e.changedTouches[0]
    };
    return touch;
}
/**
 * 鼠标和touch事件的兼容
 */
function getTarget(e) {
    var elm = e.currentTarget;
    while(!elm.id){
    	elm = elm.parentNode;
    }
    return elm;
}
/**
 * 总体的封装函数，把事件缓存在cache中
 */
var touchEvent = function(elm, callback) {
    var id = Id(elm);
    if (!cache[id]['touchstart']) {
        var touchStart = function(e) {
            var touchobj = getTouch(e);

            startX = touchobj.pageX,
            startY = touchobj.pageY;
            startTime = +new Date;
            e.preventDefault();
        }
        cache[id]['touchstart'] = callback;
        elm.addEventListener('touchstart', touchStart, false);
        elm.addEventListener('mousedown', touchStart, false);
    }
    if (!cache[id]['touchend']) {
        var touchEnd = function(e) {
            var touchobj = getTouch(e),
                distX = touchobj.pageX - startX,
                distY = touchobj.pageY - startY,
                endTime = +new Date;
            e.preventDefault();
            if ((endTime - startTime) / 1000 < 300) {
                if ((Math.abs(distX)) <10&& (Math.abs(distY)<10)) {
                	try{
                	var event = document.createEvent('Event');
                	event.initEvent('click',false,true);
                	e.target.dispatchEvent(event);
                	} catch(e){
                		console.log(e.message);
                	}
                } else{
	                if (distX > 0) { //right
	                    cache[id]['swiperight'] &&
	                        cache[id]['swiperight']({
	                        	target:e.target,
	                            pagX: touchobj.pageX,
	                            pagY: touchobj.pageY,
	                            distX: distX,
	                            distY: distY,
	                            type: 'swiperight'
	                        })
	                } else { //left
	                    cache[id]['swipeleft'] &&
	                        cache[id]['swipeleft']({
	                        	target:e.target,
	                            pagX: touchobj.pageX,
	                            pagY: touchobj.pageY,
	                            distX: distX,
	                            distY: distY,
	                            type: 'swipeleft'
	                        })
	                }
	                if (distY < 0) { //up
	                    cache[id]['swipeup'] &&
	                        cache[id]['swipeup']({
	                        	target:e.target,
	                            pagX: touchobj.pageX,
	                            pagY: touchobj.pageY,
	                            distX: distX,
	                            distY: distY,
	                            type: 'swipeup'
	                        })
	                } else { //down
	                    cache[id]['swipedown'] &&
	                        cache[id]['swipedown']({
	                        	target:e.target,
	                            pagX: touchobj.pageX,
	                            pagY: touchobj.pageY,
	                            distX: distX,
	                            distY: distY,
	                            type: 'swipedown'
	                        })
	                }
	            }
            } else {
                cache[id]['move'] &&
                    cache[id]['move']({
                    	target:e.target,
                        pagX: touchobj.pageX,
                        pagY: touchobj.pageY,
                        distX: distX,
                        distY: distY,
                        type: 'moved'
                    })

            }
            startX = null;
            startY = null;
            startTime = null;
        }
        cache[id]['touchend'] = callback;
        elm.addEventListener('touchend', touchEnd, false);
        elm.addEventListener('mouseup', touchEnd, false);
    };
    var touchMove = function(e) { //move allback
        if(!startTime){
          return;
        }
        var touchobj = getTouch(e);
        var elm = getTarget(e);
        var id = Id(elm);
        cache[id]['touchmove'] &&
        cache[id]['touchmove']({
        	target:e.target,
            pagX: touchobj.pageX,
            pagY: touchobj.pageY,
            distX: touchobj.pageX - startX,
            distY: touchobj.pageY - startY,
            type: 'move'
        })
    }
if (!cache[id]['touchmove'] ) {
    cache[id]['touchmove'] = callback;
    elm.addEventListener('touchmove', touchMove, false);
    elm.addEventListener('mousemove', touchMove, false);
  }

};
/**
 * 监听swipeLeft事件
 */
_.swipeLeft = function(elm, callback) {
    var _id = Id(elm);
    cache[_id] = cache[_id] || {};
    cache[_id]['swipeleft'] = callback;
    touchEvent(elm, callback);
};
/**
 * 监听swipe事件
 */
_.swipe = function(elm, callback) {
    var _id = Id(elm);
    cache[_id] = cache[_id] || {};
    cache[_id]['swipeleft'] = callback;
    cache[_id]['swiperight'] = callback;
    cache[_id]['swipedown'] = callback;
    cache[_id]['swipeup'] = callback;
    touchEvent(elm, callback);
    
};
/**
 * 监听swipeRight事件
 */
_.swipeRight = function(elm, callback) {
    var _id = Id(elm);
    cache[_id] = cache[_id] || {};
    cache[_id]['swiperight'] = callback;
    touchEvent(elm, callback);
};
/**
 * 监听swipeUp事件
 */
_.swipeUp = function(elm, callback) {
    var _id = Id(elm);
    cache[_id] = cache[_id] || {};
    cache[_id]['swipeup'] = callback;
    touchEvent(elm, callback);
};
/**
 * 监听swipeDown事件
 */
_.swipeDown = function(elm, callback) {
    var _id = Id(elm);
    cache[_id] = cache[_id] || {};
    cache[_id]['swipedown'] = callback;
    touchEvent(elm, callback);
};
  return _;
})
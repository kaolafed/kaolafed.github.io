/*
 * --------------------------------------------
 * 项目内工具函数集合，此页面尽量写注释
 * @version  1.0
 * @author   yuqijun(yuqijun@corp.netease.com)
 * --------------------------------------------
 */
define([
        'base/util'
    ], function(_ut) {

  var _ = {},
    noop = function(){},
    _userAgent = navigator.userAgent,
    // IOS
    _isIOS = !!_userAgent.match(/(iPhone|iPod|iPad)/i),
    // AOS
    _isAOS = !!_userAgent.match(/Android/i),
    _searchPram = location.search.replace('?',''),
	_urlObj = _ut._$query2object(_searchPram);
  // 类型判断， 同typeof
  _.typeOf = function (o) {
    return o == null ? String(o) : ({}).toString.call(o).slice(8, -1).toLowerCase();
  }


  _.findInList = function(id, list, ident){
    ident = ident || "id";
    var len = list.length;
    for(; len--;){
      if(list[len][ident] == id) return len
    }
    return -1;
  }
  _.merge = function(obj1, obj2){
    var
      type1 = _.typeOf(obj1),
      type2 = _.typeOf(obj2),
      len;

    if(type1 !== type2) return obj2;
    switch(type2){
      case 'object':
        for(var i in obj2){
          if(obj2.hasOwnProperty(i)){
            obj1[i] = _.merge(obj1[i], obj2[i]);
          }
        }
        break;
      case "array":
        for(var i = 0, len = obj2.length; i < len; i++ ){
          obj1[i] = _.merge(obj1[i], obj2[i]);
        }
        obj1.length = obj2.length;
        break;
      default:
        return obj2;
    }
    return obj1;
   }  // meregeList

  _.mergeList = function(list, list2, ident){
    ident = ident || "id";
    var len = list.length;
    for(; len--;){
      for(var i = 0, len1 = list2.length; i < len1; i++){
        if(list2[i][ident] != null&&list2[i][ident] === list[len][ident]){
          list.splice(len, 1, _.merge(list2[i],list[len]));
          break;
        }
      }
    }
  }
  // 深度clone
  _.clone = function(obj){
    var type = _.typeOf(obj);
    switch(type){
      case "object":
        var cloned = {};
        for(var i in obj){
          cloned[i] = _.clone(obj[i])
        }
        return cloned;
      case 'array':
        return obj.map(_.clone);
      default:
        return obj;
    }
    return obj;
  }

  _.extend = function(o1, o2 ,override){
	    for( var i in o2 ) if( o1[i] == undefined || override){
	      o1[i] = o2[i]
	    }
	    return o1;
	  }
  _.initSelect = function(_select,_list,_value,_text){
	  _select.options.length = 0;
	  _value = _value||'value';
	  _text = _text||'text';
	  for(var i=0,l=_list.length;i<l;i++){
		  if(typeof _list[i]==='string'){
			  var option = new Option(_list[i],_list[i]);
		  } else{
			  var option = new Option(_list[i][_text],_list[i][_value]);
		  }
		  _select.options.add(option);
	  }
  }

  // 利用一个webp图片能否显示来检测当前浏览器环境是否支持webp
  // 返回true 支持，否则不支持
  // added by hzliuxinqi 2015-8-11
  _._$supportWebp = (function(){
      var __supportwebp = false;
      (function(){
          var webp = new Image();
          webp.onload = webp.onerror = function() {
              __supportwebp = webp.height === 2;
              webp.onload = webp.onerror = null;
              webp = null;
          };
          //高度为2的一个webp图片
          webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
      })();
      return function(){ return __supportwebp; };
  })();

  // 获取nos压缩处理后图像的链接
  _.imgThumbnailUrl = function(url, width, height, quality){
    try{
      var suffix = 'imageView',
          _width = width||0,
          _height = _height || 0,
          _quality = quality || 85;
      if (!url) { return url; };
      //已经有处理标记的不再处理
      if (url.indexOf(suffix) !== -1 && url.indexOf('thumbnail') !== -1) {
        return url;
      }
      //png 图片不处理
      if (url.indexOf('.png') !== -1) {
        return url;
      };
      //2g,3g网络下将图片质量调整到60
      var _network = window.__kaolaNetwork || '4g';  //默认值4g
      if (!quality) {
        //没有指明质量时才按网络情况处理
        if (['2g','3g'].indexOf(_network) !== -1) {
          _quality = 60;
        };
      };

      //2g 网络下图片宽度减少75%
      if (_network=='2g') {
        _width = Math.ceil(_width*0.75);
      };

      //检查当前环境是否支持webp， 如果支持且没有webp参数，则可以增加
      var needWebp = this._$supportWebp() && url.indexOf('type=webp')<0;

      var _platform = window.__kaolaPlatform || 0, _webpTail = '';
      if (_platform===1 || needWebp) {
        _webpTail = '&type=webp';
        // 在支持webp的情况下，将压缩率提高10
        if (_quality > 70) {
          _quality -= 10;
        }
      };

      var params = suffix+'&thumbnail='+_width+'x'+_height+'&quality='+_quality + _webpTail;
      if (url.indexOf('?') !==-1) {
        return url+'&'+ params;
      }else{
        return url+'?'+ params;
      }
    }catch(e){
      return url;
    }

  }

  // 函数执行频度控制， added by hzliuxinqi refer from underscore
  /**
   * 频率控制 返回函数连续调用时，func 执行频率限定为 次 / wait
   *
   * @param  {function}   func      传入函数
   * @param  {number}     wait      表示时间窗口的间隔
   * @param  {object}     options   如果想忽略开始边界上的调用，传入{leading: false}。
   *                                如果想忽略结尾边界上的调用，传入{trailing: false}
   * @return {function}             返回客户调用函数
   */
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    // 上次执行时间点
    var previous = 0;
    if (!options) options = {};
    // 延迟执行函数
    var later = function() {
      // 若设定了开始边界不执行选项，上次执行时间始终为0
      previous = options.leading === false ? 0 : (+new Date);
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = (+new Date);
      // 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
      if (!previous && options.leading === false) previous = now;
      // 延迟执行时间间隔
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      // 延迟时间间隔remaining小于等于0，表示上次执行至此所间隔时间已经超过一个时间窗口
      // remaining大于时间窗口wait，表示客户端系统时间被调整过
      if (remaining <= 0 || remaining > wait) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      //如果延迟执行不存在，且没有设定结尾边界不执行选项
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  /**
   * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
   *
   * @param  {function} func        传入函数
   * @param  {number}   wait        表示时间窗口的间隔
   * @param  {boolean}  immediate   设置为ture时，调用触发于开始边界而不是结束边界
   * @return {function}             返回客户调用函数
   */
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      // 据上一次触发时间间隔
      var last = (+new Date) - timestamp;

      // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = (+new Date);
      var callNow = immediate && !timeout;
      // 如果延时不存在，重新设定延时
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  //提供在浏览器下一帧渲染时回调的入口
  //added by hzliuxinqi 2015-08-25
  _.nextFrame = (function(){
      var vendors = ['ms', 'moz', 'webkit', 'o'];
      var w = {};
      w.__requestAnimationFrame = window.requestAnimationFrame;
      for(var x = 0; x < vendors.length && !w.__requestAnimationFrame; ++x) {
          w.__requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
      }

      if (!w.__requestAnimationFrame)
          w.__requestAnimationFrame = function(callback) {
              var id = window.setTimeout(function() { callback(); }, 16);
              return id;
          };

      return function(callback){
          w.__requestAnimationFrame.apply(window, arguments);
      };
  })();


  /**
   * 判别网页是否跑在旧版本的app中
   * _aosVersion	低于安卓版本号,aos的版本号是,1,2,3,4这样的版本号
   * _iosVersion	低于ios版本号  ios是1.3为10300
   */
  _.isOldApp = function(_aosVersion,_iosVersion){
	  _aosVersion = _aosVersion||10;
	  _iosVersion =_iosVersion||10300;
	  if(_urlObj.apiVersion&&
			  ((parseInt(_urlObj.version||'1')<_aosVersion&&_isAOS)||
					  (parseInt(_urlObj.version||'10')<_iosVersion&&_isIOS))){
			return true;
		} else{
			return false;
		}
  };

  _.isAOSAPP = function(){
    var reg = /kaolaApp/,
        regSp = /kaolaAppSpring/;
    return (reg.test(_userAgent)||regSp.test(_userAgent))&&_isAOS;   
  };

  /**
   * 通过jsBridge 调用native方法
   * @param  {String}  method   调用的Native方法名称
   * @param  {Object}  args   调用的Native方法的参数
   * @param  {Function} callback   exec回调 参数flag=1调用成功，0调用失败
   * @param  {Function} nativeSucCb   native成功回调
   * @param  {Function} nativeErrCb   native失败回调
   * hzmating 20150625
   */
  _.exec = function(_option){
    var method = _option.method,
        args = _option.args||{},
        callback = _option.callback||function(res){},
        nativeSucCb = _option.nativeSucCb||function(res){},
        nativeErrCb = _option.nativeErrCb||function(res){};
    if(!method){
      callback(-1);
      return;
    }
    if(window.WeixinJSBridge){
    	WeixinJSBridge.invoke(method,args,nativeSucCb,nativeErrCb);
      callback(1);
    }else{
      callback(0);
    }
  };

  /**
   * wap登录相关 使用前请在页面底部加<@footerWidget/>
   * add by hzmating
   * @return {[type]} [description]
   */
  _.isLogin = function(){
    return !!window.__isKaolaLogin || !!nej.j._$cookie("NTES_SESS");
  };
  _.toLogin = function(targetUrl){
    window.location.href = "/login.html?target="+window.encodeURIComponent(targetUrl || window.location.href);
  };
  //先判断登录，若未登录，则去登陆；若已登录，则执行参数中的方法；
  _.afterLogin = function(cb,cxt){
    _.isLogin() ? cb.call(cxt) : _.toLogin();
  };
  /**
   * 判断是否是在kaola APP中 使用前请在页面底部加<@footerWidget/>
   * add by hzmating
   * @return {Boolean} [true:是;false:否]
   */
  _.isKaolaApp = function(){
	var UA = window.navigator.userAgent,
    	reg = /kaolaApp/,
    	regSp = /kaolaAppSpring/;
    return !!window.__isKaolaApp||reg.test(UA)||regSp.test(UA);
  };
  /**
   * 判断app版本是否大于等于x.x 使用前请在页面底部加<@footerWidget/>
   * add by hzmating
   * @return {Number} [1:是;-1:否,0:非APP]
   */
  _.isGteKaolaVer = (function(){
    var isApp , curVer, isLowerVer = false;
    if(_.isKaolaApp()){
      var UA = window.navigator.userAgent;
      var index = UA.indexOf("kaolaApp/");
      var spIndex = UA.indexOf("kaolaAppSpring/");
      isApp = true;
      if(index<0 && spIndex<0){
        isLowerVer = true;
      }else{
        if(index>=0){
          curVer = +UA.slice(index+9,index+12);
        }else{
          curVer = +UA.slice(spIndex+15,spIndex+18);
        }
      }
    }else{
      isApp = false;
    }
    return function(testVer){
      return isApp ? isLowerVer ? -1 : curVer>=testVer ? 1 : -1 : 0;
    };
  })();
  /**
   * 获取url的search中的参数值  param具体参数的key；all若为true，返回整个urlObj对象
   * add by hzmating
   * 20150920
   */
  _.getUrlParam = function(param,all){
    if(!!all){
      return _urlObj;
    }else{
      return _urlObj[param];
    }
  };

  return _;


})

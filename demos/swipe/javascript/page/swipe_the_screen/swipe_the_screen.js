/**
 * 刮奖的启动页
 * author hzxujunyu(hzxujunyu@corp.netease.com)
 * 2015-11-16
 */

define(['base/klass'
       ,'base/util'
       ,'base/event'
       ,'base/element'
       ,'util/event'
       ,'pro/widget/request'
       ,'pro/extend/util'
       ,'{lib}util/cache/cookie.js'
       ,'./swipe.js'
      //  ,'./dialog/dialog.js'
      ],
        function(k,ut,v,e,_t0,request,util,j,swipeMdl,
        	// dialog
        	p) { 
		/**
		 * 继承父类，具备init等方法(抽象原型链)
		 */
		p._$$swipe = k._$klass();
		pro = p._$$swipe._$extend(_t0._$$EventTarget);

		pro.__init = function(opt){
			console.log('-----init------');
			this.startSwipe = e._$getByClassName(document,'j-nodes')[0];
			this.__initEvent();
			this.__super(opt);
		}
		pro.__initEvent = function () {
			v._$addEvent(this.startSwipe,'click',function (argument) {
				this.__initCanvas.call(this);
			}._$bind(this));
		}
		pro.__initCanvas = function () {
			swipeMdl._$$swipeModule._$allocate({
			});
		}
		 p._$$swipe._$allocate();
        });
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
       ,'./swipe.js'
       ,'pro/components/dialog/dialog'
       ,'pro/components/toast/toast'
       ,'pro/page/swipe_the_screen/rule/rule'
      ],
        function(k,
        	ut,v,e,_t0,swipeMdl,
        	dialog,
        	toast,
        	rule,
        	p) { 
		/**
		 * 继承父类，具备init等方法(抽象原型链)
		 */
		p._$$swipe = k._$klass();
		pro = p._$$swipe._$extend(_t0._$$EventTarget);

		pro.__init = function(opt){
			this.startSwipe = e._$getByClassName(document,'swipe_start')[0];
			this.swipe_wrap = e._$getByClassName(document,'swipe_wrap')[0];
			this.swipe_desc = e._$getByClassName(document,'swipe_desc')[0];
			this.swipe_Again = e._$getByClassName(document,'swipe_again_btn')[0];
			this.swipe_result_btngroup = e._$getByClassName(document,'swipe_result_btngroup')[0];
			this.swipe_showrules = e._$getByClassName(document,'swipe_showrules')[0];
			this.__initCanvas.call(this);
			this.__initEvent();
			this.__super(opt);
		}
		pro.__initEvent = function () {
			v._$addEvent(this.startSwipe,'click',function () {
				this.__confirmPlay(0);
			}._$bind(this));
			v._$addEvent(this.swipe_Again,'click',function () {
				this.__confirmPlay(1);
			}._$bind(this));
			v._$addEvent(this.swipe_showrules,'click',function () {
				this.__showRules();
			}._$bind(this));
		}
		pro.__showRules = function () {
			this.rule = new rule({data:{hideMask:false}});
              	this.rule.$inject(document.body,"bottom");
		}
		pro.__gamePlay = function(type){
			switch(type){
				case 0:
					this.__initPlay();
					break;
				case 1:
					this.__againPlay();
					break;
			}
		}
		pro.__confirmPlay = function(type){
			var _this = this;
			new dialog({
	              config:function(){
	                  this.$on('confirm',function(){
	                  	// toast.show('最多只能添加10个地址');
	                  	_this.__gamePlay(type);
	                  	this.$emit('close');
	                  });
	                  this.$on('close',function(){
	                  	this.destroy();
	                  });
	              },
	              data:{"content":"nihao",
	                  "confirm":{
	                      "text":"确认花费5考拉豆刮奖？",
	                      "desc":"confirm-1",
	                      "confirmBg":"/res/images/catchkaola/confirmbg-1.png",
	                      "btns":[
	                          {"text":"取消","action":"close"},
	                          {"text":"确认","action":"confirm"}
	                          ]}
	              }
	          }).$inject(document.body);
		}
		pro.__initPlay = function(){
			this.swipe_desc.parentNode.removeChild(this.swipe_desc);
			this.swipe._$initEvent();
		}
		pro.__againPlay = function(){
			this.swipe.__againGame();
			e._$delClassName(this.swipe_result_btngroup,'show');
		}
		pro.__initCanvas = function () {
			this.swipe = swipeMdl._$$swipeModule._$allocate({
				overline:20,
				line_width:10,
				callback:function(){
					e._$addClassName(this.swipe_result_btngroup,'show');
				}._$bind(this)
			});
		}
		p._$$swipe._$allocate();
        });
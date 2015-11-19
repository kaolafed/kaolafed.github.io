/**
 * 基础模块
 * author yuqijun(yuqijun@corp.netease.com)
 */
define(['base/element',
        'util/event',
        'util/template/tpl',
        'util/query/query',
        'pro/widget/BaseComponent',
        'pro/widget/frame/topbar',
        'pro/components/toast/toast',
        'pro/widget/actionManage'        
       ],
    function(_e,ut,e, e2,BaseComponent,Topbar,Toast,_am,_p,_o,_f,_r,_pro) {

        _p._$$Module = NEJ.C();
        _pro = _p._$$Module._$extend(ut._$$EventTarget);

        _pro.__init = function(_options) {
            this.__supInit(_options);
            this.__initTopBar(_options||{});
//            this.__pageLoadFinish();
            this.__jsBridgeEvents();
            this._$seedAfterPageInit();
            _am._$$ActionManage._$allocate();
        };
        _pro.__initTopBar = function(_options){
            this.__topbar = Topbar._$$FrmTopBar._$allocate({noback:_options.noback});
        };
        //通知app页面load完成，去掉浮层
//        _pro.__pageLoadFinish = function(){
//            if (window.HTNativePageLoadFinish) {
//                window.HTNativePageLoadFinish();
//            }
//        };
        //jsBridge
        _pro.__jsBridgeEvents = function(){
          document.addEventListener('WeixinJSBridgeReady', function() {
              var NJ = WeixinJSBridge;
              // Kaola App 分享
              // alert('0');
              NJ.on('kaola_appmessage', function() {
                  NJ.invoke('shareKaolaAppMessage', window.shareConfig, function(res){});
              });
          });
          //提供给APP调用获取当前页分享图片的函数 2015-10-08
          //有图片时返回图片，否则返回空字符串
          window.NTGetShareImageUrl = function(){
            if (window.shareConfig && window.shareConfig.img_url) {
              return window.shareConfig.img_url;
            }
            return '';
          }            
        };

        _pro._$setTitle = function(title){
          this.__topbar && this.__topbar._$setTitle && this.__topbar._$setTitle(title);
        };

        /**
         * added by hzliuxinqi 2015-7-10
         * 页面初始化完成后执行，主要用于部分不需要在页面显示后第一时间需要处理的操作，比如
         *   回到顶部，app下载条等
         * 也可以用来避免iOS平台第三方浏览器唤醒app时，当前页面的部分js被终止执行的问题。
         * 此函数通过setTimeout 的方式来执行，一般不会被iOS的墓碑机制给cancel
         * 函数具体执行内容需要子类实现
         */
        _pro._$afterPageInit = _f;
        _pro._$seedAfterPageInit = function(){
            var delay = 500; //延迟500ms开始执行
            if (this._$afterPageInit && this._$afterPageInit != _f) {
                setTimeout(this._$afterPageInit._$bind(this), delay);
            }
        };

        return _p._$$Module;
    });

/*
 * ------------------------------------------
 * 顶栏功能实现文件
 * @version  1.0
 * @author   zzj(hzzhangzhoujie@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    'base/klass',
    'base/util',
    'util/event',
    'base/element',
    'pro/extend/util',
    'base/event'
],function(_k,_u,_t,_e,_,_v,_p,_o,_f,_r,_pro){
    /**
     * 顶栏功能控件封装
     *
     * @class   _$$ActionManage
     * @extends _$$EventTarget
     *  <a data-gatype="xinchonghui" data-gaop="libao" data-gatag="activitymain"></a>
     */
    _p._$$ActionManage = _k._$klass();
    _pro = _p._$$ActionManage._$extend(_t._$$EventTarget);

    /**
     * 控件初始化
     * @param  {Object} 配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        _v._$addEvent(document, 'click', this.__onGACheck._$bind(this));
    };
    /**
     * 登录
     * @return {Void}
     */
    _pro.__onGACheck = function(_event){
      var _elm = _v._$getElement(_event,'d:gatype');
      var _gaType = _e._$dataset(_elm,'gatype');
      var _gaOP = _e._$dataset(_elm,'gaop');
      var _gaTag = _e._$dataset(_elm,'gatag');
      if(_gaType){
    	  _gaq.push(['_trackEvent', _gaType, _gaOP, _gaTag]);
      }
    };

    return _p;
});

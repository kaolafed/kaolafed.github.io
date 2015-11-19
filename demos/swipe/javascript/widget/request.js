/*
 * --------------------------------------------
 * 项目内工具函数集合，此页面尽量写注释
 * @version  1.0
 * @author   yuqijun(yuqijun@corp.netease.com)
 * --------------------------------------------
 */
define([
    'pro/components/progress/progress',
    'base/util',
    'util/ajax/rest',
    'util/ajax/xdr'
    ], function( progress ,t, rest, xdr) {

var noop = function(){};
  /**
   * 平台request, 避免后续需要统一处理
   * opt:  其他参数如 $request
   *   - progress:  是否使用进度条提示(假)
   *   - norest:  是否 不使用REST接口
   */
  var request = function(url, opt){
    opt = opt || {};
    var olderror = opt.onerror || noop,
      oldload = opt.onload || noop;

    if(opt.progress){
      progress.start();
      opt.onload = function(json){
        // for retcode
        json.code = json.code || json.retcode;
        if(json && json.code>=200 && json.code < 400 ){
          progress.end();
          oldload.apply(this, arguments);
        }else{
          progress.end(true)
          olderror.apply(this, arguments);
        }
      }
      opt.onerror = function(json){
        progress.end(true)
        olderror.apply(this, arguments);
      }
    }
    if(!opt.type){
    	opt.type='json';
    }
    if(!opt.method||(opt.method&&opt.method.toLowerCase()=='get')){
        if(!opt.query){
            opt.query ={};
          }
        opt.query.t= +new Date;
      }
    if(opt.norest){
      if(typeof opt.data=='object'){
    	  opt.data = t._$object2query(opt.data);
      }
      xdr._$request(url, opt)
    }else{
      rest._$request(url, opt)
    }
  }
  return request;
})
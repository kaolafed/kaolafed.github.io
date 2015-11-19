/*
 * --------------------------------------------
 * 全局配置参数
 * @version  1.0
 * @author   hzzhenghaibo(hzzhenghaibo@corp.netease.com)
 * --------------------------------------------
 */
define([
    '{lib}base/global.js'], function() {

  var config = {};

  
  if(DEBUG){
	  window.URL = config.URL = '';
  } else{
	  window.URL = config.URL = 'http://m.kaola.com';
  }


  return config;


})
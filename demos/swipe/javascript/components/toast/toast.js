/*
 * --------------------------------------------
 * 全局notify接口
 * @version  1.0
 * @author   hzzhenghaibo(hzzhenghaibo@corp.netease.com)
 * --------------------------------------------
 */
define([
  "text!./toast.html",
  "pro/lib/regularjs/dist/regular",
  'pro/extend/util'
  ], function(tpl, R, _ ){

  var Toast = Regular.extend({
    template: tpl,
    //默认时间 
    duration: 1300,
    singleMsg: false,
        
    // icon对应
    iconMap: {
      "error": "remove-circle",
      "success": "ok-sign",
      "warning": "warning-sign",
      "info": "info-sign",
      "loading": "info-sign",
    },
    config: function(data){
      _.extend(data, {
        messages: [],
        position: 'right',
        isHide:true 
      })
    },
    // 初始化后的函数
    init: function(){
      // 证明不是内嵌组件
      if(this.$root == this) this.$inject(document.body);
    },
    /**
     * 增加一个提醒，添加到队伍前方
     * @param  {String|Object} message 消息或消息对象
     *      -type: error, info ,warning, success, 默认为info
     *      -title: 信息标题，默认为空
     *      -message: toast的内容
     *      -duration: 信息停留时间，-1 为无限. 默认2秒
     *      -singleMsg: 是否允许同时显示多条消息， true为同时只允许显示一条消息，默认值为false
     * @return {Function}              不等待定时器，删除掉此提醒
     */
    toast: function(message){
      if(typeof message === "string"){
        message = {
          message: message
        }
      }
      _.extend(message,{
        type: 'info',
        duration: this.duration,
        singleMsg: this.singleMsg
      })
      if (message.singleMsg 
          && (!this.data.isHide || this.data.messages.length>0) ) { return; };
      
      this.$update(function(data){
          data.isHide = false;
      })
      
      setTimeout(function(){
    	  this.$update(function(data){
	        data.messages.unshift(message)
	      })
      }._$bind(this),10);
      var clearFn = this.clear.bind(this, message);
      setTimeout(clearFn,message.duration==-1? 1300: message.duration);
      return clearFn;
    },
    /**
     * 与notify一致，但是会清理所有消息，用于唯一的消息提醒
     * @param  {String|Object} message 消息或消息对象
     * @return {Function}              不等待定时器，删除掉此提醒
     */
    show: function(message){
      if (message && !message.singleMsg) {
        this.clearTotal();
      };      
      return this.toast(message);
    },
    /**
     * 与notify一致，但是会清理所有消息，用于唯一的消息提醒
     * @param  {String|Object} message 消息或消息对象
     * @return {Function}              不等待定时器，删除掉此提醒
     */

    showError: function(message,options){
      options = _.extend(options||{}, {
        type: 'error'
      })
      return this.show(message, options);
    },
    clear: function(message){
      var messages = this.data.messages,
        len = messages.length; 

      for( ;len--; ){
	        if(message === messages[len]){
	        	messages[len].toastClass = 'toastFadeOut';
	        	this.__clearIndex = len;
	        } 
      }
      this.$update();
      setTimeout(
		  function(){
			  this.data.messages.splice(this.__clearIndex, 1);
			  this.$update(function(){
		    	  this.data.isHide = true; //动画触发，动画时间为 5秒
		    	  //alert(this.data.messages.length)
		      }._$bind(this))
		      this.__clearIndex = undefined;
		  }._$bind(this), 500 );
    },
    clearTotal: function(){
      this.$update("messages", []);
    }
    // 使用timeout模块
  }).use('timeout');

  
  // 单例, 直接初始化
  var toast = new Toast({});
  return toast;



  /**
   * 使用:
   *    notify.notify(msg) 开始进度条
   *    notify.show(msg)   显示信息
   *    notify.showError(msg) 显示错误 , show的简便接口
   */

})
define([
  'pro/extend/util',
  'base/util',
  'pro/widget/BaseComponent',
  'text!./rule.html',
  'pro/components/toast/toast',
  'pro/lib/iscroll'
  ], function(_,_ut, BaseComponent,tpl,toast,iscroll){
  var rule = BaseComponent.extend({
    template: tpl,
    config: function(data){
      // _.extend(data,{
    	 //  address:'',
    	 //  couponId:window['couponId']
      // });
    },
    init: function (data) {
      // this.$watch("hideMask",function(newValue){
      //   if(newValue == false){
      //     this.forbidBodyScroll();
      //   }else{
      //     this.allowBodyScroll();
      //   }
      // }._$bind(this));
      // this.forbidBodyScroll();
      setTimeout(function(){
        this.__iscroll = new iscroll(this.$refs.contentWrap, {tap: true});
      }._$bind(this), 0);
      
	  },
    // allowBodyScroll : function(){
    //   document.body.style.overflow = "auto";
    // },
    // forbidBodyScroll : function(){
    //   document.body.style.overflow = "hidden";
    // },
    onMaskTouchMove : function(evt){
      evt.preventDefault();
      // evt.stopPropagation();
      // evt.event.stopPropagation();
      return false;
    },
    onRuleTouchMove : function(evt){
      // evt.stopPropagation();
      // evt.event.stopPropagation();
    }
  });

  return rule;

})

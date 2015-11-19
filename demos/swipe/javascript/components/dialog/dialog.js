/**
 * dialog 
 * added by hzliuxinqi 2015-6-10
 */

define([
	"text!./dialog.html",
	"pro/widget/BaseComponent"]
	, function(tpl, Base){
	"use strict";

	var Dialog = Base.extend({
		template: tpl,
		config: function(data){
			data._aniClass = '';
		},
		init : function(){
			this.show();
			this.$emit('init');
		},
		show: function(){
			setTimeout(function(){
				this.data._aniClass = 'show';	
				this.$update();
			}._$bind(this), 0);
			
		},
		hide: function(){
			this.data._aniClass = '';	
			this.$update();
		},
		remove: function(){
			this.hide();
			setTimeout(function(){
				this.destroy();
			}._$bind(this), 200);
		},
		preventMove: function(evt){
			evt.preventDefault();			
		},
		btnClick: function(action,evt){
			switch(action){
				case 'close':
					this.$emit('close', evt);
					this.remove();
					break;
				default:
					this.$emit(action, evt);
			}
		}
	});

	return Dialog;
});
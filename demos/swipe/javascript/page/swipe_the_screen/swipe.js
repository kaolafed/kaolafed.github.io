define(['base/klass'
       ,'base/util'
       ,'base/event'
       ,'base/element'
       ,'util/event'],
       function  (k,ut,v,e,_t0,p) {
              p._$$swipeModule = k._$klass();
              pro = p._$$swipeModule._$extend(_t0._$$EventTarget);
              /**
               * 初始化函数
               */
              pro.__init = function  (opt) {
                     this.__initData(opt);
                     this.__showStage();
                     this.__initStage();
                     this.__initEvent();
                     this.__super(opt);
              }
              /**
               * 初始化数据
               */
              pro.__initData = function(opt) {
                     this.elements = {};
                     this.datas = {};
                     this.fns = {};
                     this.elements.swipeWrap = e._$getByClassName(document,'u-swipe-wrap')[0];
                     this.elements.swipe = e._$get('swipe');
                     this.elements.ctx  = this.elements.swipe.getContext('2d');
                     this.datas.scaleValue = Math.round(this._$getScale());
                     this.datas.coordinate = {x: -1, y: -1};
                     this._$extend(this.datas.coordinate,this.datas.firstTouch);
                     this._$extend(opt,this.datas);
              }
              /**
               * 展示舞台
               */
              pro.__showStage = function () {
                     e._$setStyle(this.elements.swipeWrap,'display','block');
              }
              /**
               * 初始化舞台
               */
              pro.__initStage = function  () {
                     var elements = this.elements;
                     var datas = this.datas;
                     var swipe = elements.swipe;
                     var ctx = elements.ctx;
                     datas.winW = 300 * datas.scaleValue;
                     datas.winH = 200 * datas.scaleValue;
                     datas.centerX = datas.winW/2;
                     datas.centerY = datas.winH/2;
                     swipe.width = datas.winW;
                     swipe.height = datas.winH;
                     this.__setBackground(ctx,datas,'#ccc');
              }
              /**
               * 加上触摸事件
               */
              pro.__initEvent = function () {
                     var elements = this.elements;
                     var datas = this.datas;
                     var swipe = elements.swipe;
                     var ctx = elements.ctx;
                     var fns = this.fns;
                     fns.start = this.__swipeOn._$bind(this);
                     fns.move = this.__swipe._$bind(this);
                     fns.end = this.__touchout._$bind(this);

                     swipe.addEventListener('touchstart',fns.start,false);
                     swipe.addEventListener('touchmove',fns.move,false);
                     swipe.addEventListener('touchend',fns.end,false);
              }
              /**
               * 开始触屏
               */
              pro.__swipeOn = function(e){

                     var datas = this.datas;
                     var touchs = e.changedTouches;
                     var touch = touchs[touchs.length-1]
                     var x = (touch.pageX-swipe.offsetLeft) * datas.scaleValue;
                     var y = (touch.pageY-swipe.offsetTop) * datas.scaleValue;

                     e.preventDefault();
                     datas.firstTouch = {x: x,y: y};
                     this._$extend(datas.firstTouch,datas.coordinate);
              }
              /**
               * 移动手指
               */
              pro.__swipe = function(e){

                     var elements = this.elements;
                     var datas = this.datas;
                     var swipe = elements.swipe;
                     var ctx = elements.ctx;
                     var touchs = e.changedTouches;

                     e.preventDefault();
                     ctx.globalCompositeOperation = 'destination-out';   
                     Array.prototype.forEach.call(touchs,function(touch){
                            var x = (touch.pageX-swipe.offsetLeft) * datas.scaleValue;
                            var y = (touch.pageY-swipe.offsetTop) * datas.scaleValue;
                            if(datas.firstTouch.x!=-1&&datas.firstTouch.y!=-1){
                                   ctx.beginPath();
                                   ctx.arc(datas.firstTouch.x, datas.firstTouch.y, 10*datas.scaleValue, 0, Math.PI * 2);
                                   ctx.fill();
                                   datas.firstTouch={
                                          x:-1,
                                          y:-1
                                   }
                            }
                            if(datas.coordinate.x!=-1&&datas.coordinate.y!=-1){
                                   var collections=this.__computeBoundPoints(datas.coordinate.x,
                                          datas.coordinate.y,
                                          x,
                                          y);
                                   this.__drawBounds.call(this,collections);
                            }
                            ctx.beginPath();
                            ctx.arc(x, y, 10*datas.scaleValue, 0, Math.PI * 2);
                            ctx.fill();
                            datas.coordinate = {
                                   x:x,
                                   y:y
                            }
                     }._$bind(this));
              }
              /**
               * 结束划屏
               */
              pro.__touchout = function(e){

                     var datas = this.datas;
                     var fns = this.fns;
                     var elements = this.elements;
                     var swipe = elements.swipe;
                     var ctx = elements.ctx;
                     e.preventDefault();   
                     datas.coordinate = {
                            x:-1,
                            y:-1
                     }
                     if(this.getTransparentPercent()>datas.overline){
                            ctx.clearRect(0,0,datas.winW,datas.winH);
                            swipe.removeEventListener('touchstart',fns.start);
                            swipe.removeEventListener('touchmove',fns.move);
                            swipe.removeEventListener('touchend',fns.end);
                            datas.callback();
                     }
              }
              /**
               * 计算边界
               * @param  {int} x1 [点1x坐标]
               * @param  {int} y1 [点1y坐标]
               * @param  {int} x2 [点2x坐标]
               * @param  {int} y2 [点2y坐标]
               * @return {array}    4个点的x,y坐标
               */
              pro.__computeBoundPoints = function(x1,y1,x2,y2){
                     var a = Math.abs(x2-x1);
                     var b = Math.abs(y2-y1);
                     var c = Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
                     var a1,b1,c1;
                     var m={},n={}, o={}, p={};
                     var key = this._$isEval(this._$maxIndex([y1,y2]),this._$maxIndex([x1,x2]))?1:-1
                     
                     c1 = 10*this.datas.scaleValue;

                     a1 = a/c*c1;
                     b1 = b/c*c1;
                     
                     m.x = x1-b1;
                     m.y = y1+a1*key;

                     n.x = x1+b1;
                     n.y = y1-a1*key;

                     o.x = x2-b1;
                     o.y = y2+a1*key;

                     p.x = x2+b1;
                     p.y = y2-a1*key;

                     console.log(m);
                     console.log(n);
                     console.log(p);
                     console.log(o);
                     console.log('-------------------------------');
                     return [m,n,p,o];
              }
              /**
               * 划边界
               */
              pro.__drawBounds = function(arr){
                     var ctx = this.elements.ctx;
                     ctx.moveTo(arr[0].x, arr[0].y);//将画笔移到x0,y0处
                     ctx.lineTo(arr[1].x, arr[1].y);//从x0,y0到x1,y1画一条线
                     ctx.lineTo(arr[2].x, arr[2].y);//从x1,y1到x2,y2画条线
                     ctx.lineTo(arr[3].x, arr[3].y);//从x1,y1到x2,y2画条线
                     ctx.moveTo(arr[0].x, arr[0].y);//从x1,y1到x2,y2画条线
                     ctx.fill();//填充
              }
              /**
               * 输出当前覆盖面积
               * @return {int} [0~100 表示当前覆盖面积]
               */
              pro.getTransparentPercent = function(){
                     var elements = this.elements;
                     var datas = this.datas;
                     var ctx = elements.ctx;
                     var width = datas.winW;
                     var height = datas.winH;
                     var imgData = ctx.getImageData(0, 0, width, height),
                            transPixs = [],
                            pixles = imgData.data;
                     
                     for (var i = 0, j = pixles.length; i < j; i += 4) {
                            var a = pixles[i + 3];
                            if (a < 128) {
                                   transPixs.push(i);
                            }
                     }
                     return (transPixs.length / (pixles.length / 4) * 100).toFixed(2);
              }
              /**
               * 设置背景色
               */
              pro.__setBackground = function(ctx,datas,color){
                     ctx.fillStyle = color;
                     ctx.fillRect(0,0,datas.winW,datas.winH);
              }
              /**
               * 获取设备dpr
               * @return {int} [dpr]
               */
              pro._$getScale = function () {
                     return window.devicePixelRatio;
              }
              /**
               * 获取数据中的最大值得index
               * @param  {array} array 
               * @return {int}       [角标]
               */
              pro._$maxIndex = function(array){
                     return array.indexOf(Math.max.apply(null,array));
              }
              /**
               * 判断是否相等
               * @param  {int} val1 [description]
               * @param  {int} val2 [description]
               * @return {boolean}      [description]
               */
              pro._$isEval = function(val1,val2){
                     return val1 == val2;
              }
              /**
               * 扩展
               * @description source=>target
               */
              pro._$extend = function(source,target){
                     if(!target)
                            target = {};

                     for(var attr in source){
                            if(!target.hasOwnProperty(attr)){
                                   target[attr] = source[attr];
                            }
                     }
              }
              
              return p;
       });
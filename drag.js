/**
The MIT License (MIT)
Copyright (c) <2014> <lovelotte.net>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */;

(function($){
    
    var data_key = "drag";
    
    var defaults = {
        dir: null,
        min: 0,
        max: null
    };
    
    
    $.drag = function(el, opts){        
        this.o = $.extend({}, defaults, opts);
        this.$t = $(el);
        this.ix = this.iy = this.sx = this.sy = 0; //initial x,y and scroll x,y
        this.md = false;
        var p = this.$t.css('position');
        if( !p || p == "static" ) this.$t.css('position', 'relative');

        var $p = this.$t.parent();
        p = $p.css('position');
        if( !p || p == 'static' ) $p.css('position', 'relative');
        
        if( !this.o.dir && this.o.dir !== 0){
            this.v = true;
            this.h = true;
        }else{
            this.h = this.o.dir==0 || this.o.dir=="h";
            this.v = this.o.dir==1 || this.o.dir=="v";
        }
        
        if( !this.v && ! this.h ) return; 
        
        this.$t.mousedown( $.proxy(this, 'mousedown') );
        $(window).mouseup($.proxy(this, 'mouseup')).mousemove($.proxy(this, 'mousemove'));
    };
    
    $.drag.prototype.mousedown = function(e){
        this.md = true;
        this.p = this.$t.position(); //starting position
        
        getCurrentXY.call(this, e);
        this.$t.trigger('drag::dragStart', this);

        e.preventDefault();
        e.stopPropagation();
    };
    
    $.drag.prototype.mouseup = function(){
        this.md = false;
        this.$t.trigger('drag::dragStop', this);
    };
    
    $.drag.prototype.mousemove = function(e){  
        if( !this.md ) return; 
        
        var m = getCurrentXY.call(this, e, true);
        var mX, MX, mY, MY; 
        
        if( this.o.min === null ){
            
        }else if( this.o.min instanceof Array ){
            mX = this.o.min[0];
            mY = this.o.min[1]; 
        }else{
            mX = mY = this.o.min;
        }
        
        if( this.o.max === null ){
            //do nothing
        }else if( this.o.max instanceof Array ){
            MX = this.o.max[0];
            MY = this.o.max[1]; 
        }else{
            MX=MY=this.o.max;
        }
        
        var dy=0; var dx=0;
        if( this.v ){
            dy = m[1] - this.iy + m[3] - this.sy + this.p.top; 
            if( dy < mY ) dy = mY; 
            else if( MY && dy > MY ) dy = MY;
            this.$t.css('top', dy + "px");
        }
        
        if( this.h ){
            dx = m[0] - this.ix + m[2] - this.sx + this.p.left;
            if( dx< mX ) dx = mX;
            else if( MX && dx>MX ) dx = MX;
            this.$t.css('left', dx + "px");
        }
        
        this.$t.trigger('drag::dragging', [dx, dy]);
    };
    
    function getCurrentXY(e, ret){
        var x=e.pageX, y=e.pageY;
        var sy = this.$t.scrollTop(); 
        var sx = this.$t.scrollLeft();  
        
        if( ! ret ){
            this.ix = x;
            this.iy = y;
            this.sx = sx;
            this.sy = sy;            
        }else{
            return [x, y, sx, sy];
        }
    }
    
    $.fn.drag = function(opts){
        if( $(this).size() != 1 ){
            var arr = []; 
            $(this).each(function(){ arr.push($(this).drag(opts)); });
            return arr;
        }
        
        var l = $(this).data(data_key);
        if( l instanceof $.drag ) return l;
        
        l = new $.drag(this, opts);
        return l;        
    };
   
})(jQuery);
(function() {

    var canvas;
    // var backCode;// 배경 스트링 코드

    var backCode2;

    function mergeObjects(obj1, obj2) {
        var obj3 = {};
        var attrname;
        for (attrname in (obj1 || {})) {
            if (obj1.hasOwnProperty(attrname)) {
                obj3[attrname] = obj1[attrname];
            }
        }
        for (attrname in (obj2 || {})) {
            if (obj2.hasOwnProperty(attrname)) {
                obj3[attrname] = obj2[attrname];
            }
        }
        return obj3;
    }


    function Sketchpad(el, opts) {
        var that = this;

        if (!el) {
            throw new Error('Must pass in a container element');
        }

        opts = opts || {};
        var strokes = [];
        var undos = [];

        var backCode;

        if (opts.data) {
            opts.aspectRatio = opts.data.aspectRatio;
            strokes = opts.data.strokes;            
        }

        // alert("sketch init: opts ="+JSON.stringify(opts));

        opts.aspectRatio = opts.aspectRatio || 1;
        opts.width = opts.width || el.clientWidth;
        opts.height = opts.height || opts.width * opts.aspectRatio;
        opts.line = mergeObjects({
            color: '#000',
            size: 5,
            cap: 'round',
            join: 'round',
            miterLimit: 10
        }, opts.line);
        opts.url = undefined;
        opts.opacity = 0.5;

        // Boolean indicating if currently drawing
        var sketching = false;

        // Create a canvas element
        canvas = document.createElement('canvas');

        /**
         * Set the size of canvas
         */
        function setCanvasSize(width, height) {
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
        }

        /**
         * Set a background of canvas
         */
        // bbbbbbbbbbb
        function setCanvasBackground(url = undefined, opacity = 0.5) {
            
            // alert("setCanvasBackground");
            
            if (url == undefined)
                canvas.style.background = "white";
            else {
                
                canvas.style.background = "linear-gradient(rgba(255, 255, 255, " + opacity + "), rgba(255, 255, 255, " + opacity + ")), url('" + url + "') no-repeat";
                canvas.style.backgroundSize = "contain";
                canvas.style.backgroundPositionX = "center";
                canvas.style.backgroundPositionY = "center";
            }
                        
            // alert("data.backDDD2="+ backCode2);

            if(backCode2 != "" && backCode2!=null &&  backCode2!='undefined'){
                canvas.style.background = "linear-gradient(rgba(255, 255, 255, " + opacity + "), rgba(255, 255, 255, " + opacity + ")), url('" + backCode2 + "') no-repeat";
                canvas.style.backgroundSize = "contain";
                canvas.style.backgroundPositionX = "center";
                canvas.style.backgroundPositionY = "center";

                // canvas.style.backgroundImage = "url('"+backCode+"')";
            }
        

            // canvas.style.background = "white";
            // canvas.style.opacity=0.5;

        }

        /**
         * Get the size of the canvas
         */
        function getCanvasSize() {
            return {
                width: canvas.width,
                height: canvas.height
            };
        }

        setCanvasSize(opts.width, opts.height);
        el.appendChild(canvas);
        var context = canvas.getContext('2d');

        /**
         * Returns a points x,y locations relative to the size of the canvase
         */
        function getPointRelativeToCanvas(point) {
            return {
                x: point.x / canvas.width,
                y: point.y / canvas.height
            };
        }

        /**
         * Returns true if is a touch event, false otherwise
         */
        function isTouchEvent(e) {
            return e.type.indexOf('touch') !== -1;
        }

        /**
         * Get location of the cursor in the canvas
         */
        function getCursorRelativeToCanvas(e) {
            var cur = {};

            if (isTouchEvent(e)) {
                cur.x = e.touches[0].pageX - canvas.offsetLeft;
                cur.y = e.touches[0].pageY - canvas.offsetTop;
            } else {
                var rect = that.canvas.getBoundingClientRect();
                cur.x = e.clientX - rect.left;
                cur.y = e.clientY - rect.top;
            }

            return getPointRelativeToCanvas(cur);
        }

        /**
         * Get the line size relative to the size of the canvas
         * @return {[type]} [description]
         */
        function getLineSizeRelativeToCanvas(size) {
            return size / canvas.width;
        }

        /**
         * Erase everything in the canvase
         */
        function clearCanvas() {
            
            
            context.clearRect(0, 0, canvas.width, canvas.height);

            if (opts.backgroundColor) {
                context.fillStyle = opts.backgroundColor;
                context.fillRect(0, 0, canvas.width, canvas.height);
            }
        }

        /**
         * Since points are stored relative to the size of the canvas
         * this takes a point and converts it to actual x, y distances in the canvas
         */
        function normalizePoint(point) {
            return {
                x: point.x * canvas.width,
                y: point.y * canvas.height
            };
        }

        /**
         * Since line sizes are stored relative to the size of the canvas
         * this takes a line size and converts it to a line size
         * appropriate to the size of the canvas
         */
        function normalizeLineSize(size) {
            return size * canvas.width;
        }

        /**
         * Draw a stroke on the canvas
         */
        function drawStroke(stroke ,lineWidth_ ) {
            
            context.beginPath();

            
            for (var j = 0; j < stroke.points.length - 1; j++) {
                var start = normalizePoint(stroke.points[j]);
                var end = normalizePoint(stroke.points[j + 1]);

                context.moveTo(start.x, start.y);
                context.lineTo(end.x, end.y);

                //context.lineWidth = lineWidth_;
            }

            context.closePath();

            context.strokeStyle = stroke.color;
            context.lineWidth = normalizeLineSize(stroke.size);
            // context.lineWidth = lineWidth_;

            context.lineJoin = stroke.join;
            context.lineCap = stroke.cap;
            context.miterLimit = stroke.miterLimit;

            context.stroke();
        }

        // ddddd1
        function makeBack()
        {

        }
        
        var lineWidth_ = 1;
        var lineFlag = true;

        /**
         * Redraw the canvas
         */
        function redraw() {
            clearCanvas();

            /*
            var imageCode = new Image();
            imageCode.src = backCode;
            
            var opacity = 0.5;
            canvas.style.background = "linear-gradient(rgba(255, 255, 255, " + opacity + "), rgba(255, 255, 255, " + opacity + ")), url('" + imageCode + "') no-repeat";
            */
            
            // canvas.style.background = imageCode;

            // var ctx = canvas.getContext('2d');
            // ctx.drawImage(imageCode,0,0);
            
            //var lineWidth_ = 1;
            // var lineFlag = true;

            console.log("that.strokes.length="+that.strokes.length);

            for (var i = 0; i < that.strokes.length; i++) {

                console.log("lineWidth_=" + lineWidth_);

                drawStroke(that.strokes[i], lineWidth_ );
                
                lineWidth_  += 0.1;

                /*
                if(lineFlag){
                    lineWidth_  += 0.1;

                    if(lineWidth_ > 5){
                        lineFlag = false;
                    }

                }else {
                    lineWidth_  -= 0.1;

                    if(lineWidth_<1){
                        lineFlag = true;
                    }
                }
                */
                
            }
        }

        // On mouse down, create a new stroke with a start location
        function startLine(e) {
            e.preventDefault();

            strokes = that.strokes;
            sketching = true;
            that.undos = [];

            var cursor = getCursorRelativeToCanvas(e);
            strokes.push({
                points: [cursor],
                color: opts.line.color,
                size: getLineSizeRelativeToCanvas(opts.line.size),
                cap: opts.line.cap,
                join: opts.line.join,
                miterLimit: opts.line.miterLimit
            });
        }

        function drawLine(e) {
            if (!sketching) {
                return;
            }

            e.preventDefault();

            var cursor = getCursorRelativeToCanvas(e);
            that.strokes[strokes.length - 1].points.push({
                x: cursor.x,
                y: cursor.y
            });

            that.redraw();
        }

        function endLine(e) {
            if (!sketching) {
                return;
            }

            e.preventDefault();

            sketching = false;

            if (isTouchEvent(e)) {
                return; // touchend events do not have a cursor position
            }

            var cursor = getCursorRelativeToCanvas(e);
            that.strokes[strokes.length - 1].points.push({
                x: cursor.x,
                y: cursor.y
            });

            that.redraw();

            if (that.onDrawEnd) that.onDrawEnd();
        }

        console.log(opts.drawingLock);

        if (opts.drawingLock === undefined || opts.drawingLock === false) {
            console.log("drawlingLock = false");
            // Event Listeners
            canvas.addEventListener('mousedown', startLine);
            canvas.addEventListener('touchstart', startLine);

            canvas.addEventListener('mousemove', drawLine);
            canvas.addEventListener('touchmove', drawLine);

            canvas.addEventListener('mouseup', endLine);
            canvas.addEventListener('mouseleave', endLine);
            canvas.addEventListener('touchend', endLine);
        }

        if (typeof opts.onDrawEnd === 'function') {
            this.onDrawEnd = opts.onDrawEnd;
        }

        // Public variables
        this.canvas = canvas;
        this.strokes = strokes;
        this.undos = undos;
        this.opts = opts;

        this.backCode = backCode;

        // Public functions
        this.redraw = redraw;
        this.setCanvasSize = setCanvasSize;
        this.setCanvasBackground = setCanvasBackground;
        this.getPointRelativeToCanvas = getPointRelativeToCanvas;
        this.getLineSizeRelativeToCanvas = getLineSizeRelativeToCanvas;

        if (strokes) {
            redraw();
        }
    }

    /**
     * Undo the last action
     */
    Sketchpad.prototype.undo = function() {
        if (this.strokes.length === 0) {
            return;
        }

        this.undos.push(this.strokes.pop());
        this.redraw();
    };

    /**
     * Redo the last undo action
     */
    Sketchpad.prototype.redo = function() {
        if (this.undos.length === 0) {
            return;
        }

        this.strokes.push(this.undos.pop());
        this.redraw();
    };

    /**
     * Clear the sketchpad
     */
    Sketchpad.prototype.clear = function() {
        this.undos = []; // TODO: Add clear action to undo
        this.strokes = [];
        this.redraw();
    };


    /**
     * Convert the sketchpad to a JSON object that can be loaded into
     * other sketchpads or stored on a server
     */
    Sketchpad.prototype.toJSON = function() {
        
        
        return {
            aspectRatio: this.canvas.height / this.canvas.width,
            strokes: this.strokes,
            backDDD:this.backCode
        };
    };

    /**
     * Load a json object into the sketchpad
     * @return {object} - JSON object to load
     */
    Sketchpad.prototype.loadJSON = function(data) {
        this.strokes = data.strokes;
        
        // this.backCode = data.backDDD;
        backCode2 = data.backDDD;
        // alert("data.backDDD0="+data.backDDD);
        // alert("data.backDDD1="+backCode2);
        
        this.redraw();
    };

    /**
     * Set the line size
     * @param {number} size - Size of the brush
     */
    Sketchpad.prototype.setLineSize = function(size) {
        this.opts.line.size = size;
    };

    /**
     * Set the line color
     * @param {string} color - Hexadecimal color code
     */
    Sketchpad.prototype.setLineColor = function(color) {
        this.opts.line.color = color;
    };

    /**
     * Draw a line
     * @param  {object} start    - Starting x and y locations
     * @param  {object} end      - Ending x and y locations
     * @param  {object} lineOpts - Options for line (color, size, etc.)
     */
    Sketchpad.prototype.drawLine = function(start, end, lineOpts) {
        lineOpts = mergeObjects(this.opts.line, lineOpts);
        start = this.getPointRelativeToCanvas(start);
        end = this.getPointRelativeToCanvas(end);

        this.strokes.push({
            points: [start, end],
            color: lineOpts.color,
            size: this.getLineSizeRelativeToCanvas(lineOpts.size),
            cap: lineOpts.cap,
            join: lineOpts.join,
            miterLimit: lineOpts.miterLimit
        });
        this.redraw();
    };

    /**
     * Resize the canvas maintaining original aspect ratio
     * @param  {number} width - New width of the canvas
     */
    Sketchpad.prototype.resize = function(width) {
        var height = width * this.opts.aspectRatio;
        this.opts.lineSize = this.opts.lineSize * (width / this.opts.width);
        this.opts.width = width;
        this.opts.height = height;

        this.setCanvasSize(width, height);
        this.setCanvasBackground(this.opts.url, this.opts.opacity);
        this.redraw();
    };



    // tttttt1
    Sketchpad.prototype.makeShapeDD = function(shapeType, count) {
        
        var c_w = canvas.width;
        var c_h = canvas.height;
                
        var min = 10;
        var add = 10;

        console.log("pad gogo Shape111: ");
        
        var ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // var count = 6;

        // 전체너비 500 도형 너비 20일 때 안나가게.        
        // (500 - 40)랜덤 + 20. 20~480
        
        for(var i=0; i<count; i++) {
            // var index = Math.floor(Math.random() * 10); // 0~9까지.
            // var ranIndex = Math.floor(Math.random() * length);

            var www = min + add*i;

            var x_ran = Math.floor(Math.random() * (c_w - www*2 )) + www;
            var y_ran = Math.floor(Math.random() * (c_h - www*2 )) + www;

            var r=  Math.floor(Math.random() *255) ;
            var g=  Math.floor(Math.random() *255) ;
            var b=  Math.floor(Math.random() *255) ;

            ctx.fillStyle = 'rgb('+r+',' +g+',' +b+')';

            if(shapeType=="rect"){ // 네모
                ctx.fillRect(x_ran, y_ran, www, www);

            } else if(shapeType=="number"){ // 숫자
                ctx.font = "32px Arial";
                ctx.fillText(""+i, x_ran, y_ran);

            }            
            else { // 원.
                ctx.beginPath();
                ctx.arc(x_ran, y_ran, www, 0,2*Math.PI);
                ctx.stroke();

            }

        }
        
        this.backCode = canvas.toDataURL();
        //alert("bbb"+this.backCode);

        // 만들어진 도형으로 배경 세팅.
        this.setCanvasBackground(this.backCode, 0.5);

    };


    /**
     * Set a background image with opacity
     * @param  {string} url - image url
     * @param  {number} opacity - image opacity (0~1.0)
     */
    Sketchpad.prototype.setBackground = function(url = undefined, opacity = 0.5) {
        this.opts.url = url;
        this.opts.opacity = opacity;
        this.setCanvasBackground(url, opacity);
    };

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = Sketchpad;
    } else {
        window.Sketchpad = Sketchpad;
    }
})();
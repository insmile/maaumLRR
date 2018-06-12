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

    // 문제등록. 흐음.
    function Sketchpad(el, opts) {
        // alert("sketchpad 초기화!");
        
        backCode2 = "";

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
            }

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


        var ddddd=1; // 선두께 초기값

        /**
         * Draw a stroke on the canvas
         */
        function drawStroke(stroke) {
                        
            var ddd_term = 0;

            for (var j = 0; j < stroke.points.length - 1; j++) {
                
                context.lineWidth = ddddd;
                context.beginPath();

                var start = normalizePoint(stroke.points[j]);
                var end = normalizePoint(stroke.points[j + 1]);

                // console.log("start_x:"+start.x+", start_y:"+start.y);
                // console.log("end_x:"+end.x+", end_y:"+end.y);

                context.moveTo(start.x, start.y);
                context.lineTo(end.x, end.y);

                context.closePath();
                // context.miterLimit = stroke.miterLimit;
    
                context.strokeStyle = stroke.color;

                context.lineJoin = stroke.join;
                context.lineCap = stroke.cap;
            
                context.stroke();

                if(ddddd < 7){ // 두께 최대치

                    if(ddd_term > 4){                    
                        ddddd += 0.1;
                        ddd_term=0;
                    }
                }

                ddd_term++;

                if(j==0){
                    makeCircle(start.x, start.y, j);
                }

                if(j == stroke.points.length - 2){
                    // alert("last!!!!");
                    makeCircle(start.x, start.y, j);
                }
                
            }
        }

        // ddddd1
        function makeBack()
        {

        }

        function makeCircle(posX, posY, order){
            var ctx = canvas.getContext('2d');
            ctx.beginPath();

            if(order==0){
                ctx.arc(posX, posY, 5, 0,2*Math.PI);    
            }else {
                ctx.arc(posX, posY, 8, 0,2*Math.PI);
            }
            
            ctx.stroke();
        }
        
        var lineWidth_ = 1;
        var lineFlag = true;

        /**
         * Redraw the canvas
         */
        function redraw() {
            
            ddddd=1;
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
            
            
            for (var i = 0; i < that.strokes.length; i++) {

                drawStroke(that.strokes[i]);
                
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
        this.makeShapeDD = makeShapeDD;
        this.makeCircle = makeCircle;

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


    var myShapeArr = [];

    var draw2Data;

    // 외부에서 호출하는 인터페이스.
    Sketchpad.prototype.makeDraw2 = function(drawData) {
        
        // {"sstt1":"off","sstt2":"on","sstt3":"off","sstt4":"off","sstt5":"off","shapeCount":6}
        // 삼각형, 사각형, 원, // 숫자, 가나다.
        draw2Data = drawData;
        
        var makeShape="";

        if(drawData.sstt1=="on") {
            if(makeShape=="") {
                makeShape="triangle"
            }else {
                makeShape += ":";
                makeShape += "triangle";
            }
        }

        if(drawData.sstt2=="on") {
            if(makeShape=="") {
                makeShape="rect"
            }else {
                makeShape += ":";
                makeShape += "rect";
            }
        }

        if(drawData.sstt3=="on") {
            if(makeShape=="") {
                makeShape="circle"
            }else {
                makeShape += ":";
                makeShape += "circle";
            }
        }

        if(drawData.sstt4=="on") {
            if(makeShape=="") {
                makeShape="number"
            }else {
                makeShape += ":";
                makeShape += "number";
            }
        }

        if(drawData.sstt5=="on") {
            if(makeShape=="") {
                makeShape="ganada"
            }else {
                makeShape += ":";
                makeShape += "ganada";
            }
        }
        
        var count = drawData.shapeCount;

        this.makeShapeDD(makeShape, count);
    };

    Sketchpad.prototype.makeDraw2_reset = function() {
        // alert("939393912333");
        var drawData = draw2Data;
        this.undos = []; // TODO: Add clear action to undo
        this.strokes = [];

        var makeShape="";

        if(drawData.sstt1=="on") {
            if(makeShape=="") {
                makeShape="triangle"
            }else {
                makeShape += ":";
                makeShape += "triangle";
            }
        }

        if(drawData.sstt2=="on") {
            if(makeShape=="") {
                makeShape="rect"
            }else {
                makeShape += ":";
                makeShape += "rect";
            }
        }

        if(drawData.sstt3=="on") {
            if(makeShape=="") {
                makeShape="circle"
            }else {
                makeShape += ":";
                makeShape += "circle";
            }
        }

        if(drawData.sstt4=="on") {
            if(makeShape=="") {
                makeShape="number"
            }else {
                makeShape += ":";
                makeShape += "number";
            }
        }

        if(drawData.sstt5=="on") {
            if(makeShape=="") {
                makeShape="ganada"
            }else {
                makeShape += ":";
                makeShape += "ganada";
            }
        }

        var count = draw2Data.shapeCount;

        this.makeShapeDD(makeShape, count);
    }


    // 도형 그리기.
    /*
        원 안에 숫자.
        원 크기.
        원+세모.
        원 안에 숫자+가나다.
    */
    function makeShapeDD(shapeType, count) {
        
        // shapeType = "ganada:number";
        
        var my_shapesArr = shapeType.split(":");
        
        var shapeIndex = 0; 

        myShapeArr = []; // 그린 곳에 또 그리지 않기 위해 만들어진 도형 저장.

        var c_w = canvas.width;
        var c_h = canvas.height;
                
        var min = 10;
        var add = 10;
        
        var ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // var count = 6;

        // 전체너비 500 도형 너비 20일 때 안나가게.        
        // (500 - 40)랜덤 + 20. 20~480
        // count = 3;

        var index = 0;
        var indexLimit = 0;

        var index_number = 1;
        var index_ganada = 0;
        var ganadaArr = ["가","나","다","라","마","바","사","아","자","차","카","타","파","하"];

        while(true){
            var shapeStr = my_shapesArr[shapeIndex];
            
            console.log("daddddd:"+shapeStr);

            // var my_shapesArr = shapeType.split(":");        
            // var shapeIndex = 0; 

            indexLimit++
            var www = min + add * index;

            if(shapeStr=="number" || shapeStr=="ganada" ){ // 숫자 혹은 가나다.
                www = 40; // 글자크기 적당히.
            }

            var padding_x = 150;
            var padding_y = 150;

            var x_ran;
            var y_ran;

            if(shapeStr=="rect"){
                // 도형 기준점이 왼쪽 위.
                x_ran = Math.floor(Math.random() * (c_w - www - padding_x*2 ) ) + padding_x;
                y_ran = Math.floor(Math.random() * (c_h - www - padding_y*2 ) ) + padding_y;

            } else {
                // 기준점이 가운데.
                x_ran = Math.floor(Math.random() * (c_w - (www+padding_x)*2 )) + www+padding_x;
                y_ran = Math.floor(Math.random() * (c_h - (www+padding_y)*2 )) + www+padding_y;

            }
            
            // x_ran = Math.floor(Math.random() * 200 );
            // y_ran = Math.floor(Math.random() * 200 );

            var r=  Math.floor(Math.random() *255) ;
            var g=  Math.floor(Math.random() *255) ;
            var b=  Math.floor(Math.random() *255) ;

            ctx.fillStyle = 'rgb('+r+',' +g+',' +b+')';

            var isDrawReady = false;

            if(index==0){
                isDrawReady = true;
                // myShapeArr.push({"x":x_ran, "y":y_ran, "www":www});
                
            }else {
                isDrawReady = !checkOverlap(myShapeArr, x_ran, y_ran, www, shapeStr );
            }

            if(isDrawReady) {

                shapeIndex++;

                if(shapeIndex == my_shapesArr.length) {
                    shapeIndex = 0; // 초기화.
                }
                
                index++;
                var textData="";
                
                if(shapeStr=="rect"){ // 네모
    
                } else if(shapeStr=="number"){ // 숫자
        
                    textData = index_number;

                    index_number++;
    
                } else if(shapeStr=="ganada"){ // 가나다
                    
                    var ttt = ganadaArr[index_ganada];
                    textData = ttt;

                   
                    index_ganada++;
                }
                else if(shapeStr=="triangle") {
                    
                }
                else { // 원.

                }

                myShapeArr.push({"x":x_ran, "y":y_ran, "www":www, "shapeStr":shapeStr,"textData":textData});

                indexLimit = 0;
            }  

            if(indexLimit>200){
                alert("겹치지 않게 그릴 공간이 없습니다.");
                break;
            }
            if(index >= count){
                break;
            }            
        }      

        realDraw_(myShapeArr);
        
        this.backCode = canvas.toDataURL();
        
        // 만들어진 도형으로 배경 세팅.
        this.setCanvasBackground(this.backCode, 0.5);
    };

    
    function realDraw_(drawDataArr) {
        
        var ctx = canvas.getContext('2d');

        /* 컬러 설정.
            var r=  Math.floor(Math.random() *255) ;
            var g=  Math.floor(Math.random() *255) ;
            var b=  Math.floor(Math.random() *255) ;
            ctx.fillStyle = 'rgb('+r+',' +g+',' +b+')';
        */

        // myShapeArr.push({"x":x_ran, "y":y_ran, "www":www, "shapeStr":shapeStr,"textData":textData});
        
        for(var i = 0; i<drawDataArr.length; i++) {
            
            var data = drawDataArr[i];

            var x_ran = data.x;
            var y_ran = data.y;
            var www = data.www;
            var textData = data.textData;
            var shapeStr = data.shapeStr;

            if(data.shapeStr=="rect") {
                ctx.fillRect(x_ran, y_ran, www, www);

            }else if(shapeStr=="number" || shapeStr=="ganada"){ // 숫자
                ctx.beginPath();
                ctx.arc(x_ran, y_ran-10, 15, 0,2*Math.PI);
                
                ctx.font = "20px Arial";
                ctx.fillStyle = "grey";
                ctx.fillText(textData, x_ran, y_ran);
                ctx.textAlign = "center";                     
                ctx.stroke(); 
            }
            else if(shapeStr=="triangle") {
                ctx.beginPath();                
                ctx.moveTo(x_ran - www/2 , y_ran + www/2);
                ctx.lineTo(x_ran + www/2 , y_ran + www/2);
                ctx.lineTo(x_ran, y_ran - www/2);
    
                ctx.fill();
            }
            else { // 원.
                ctx.beginPath();
                ctx.arc(x_ran, y_ran, www, 0,2*Math.PI);
                // ctx.stroke();
                ctx.fill();
            }
        }             
    }
    

    // 하..오버랩 체크 함수가 없네 수동으로 체크.....ㅠㅠ
    function checkOverlap(myShapeArr, x_ran, y_ran, www, shapeType){
        
        // 중심 포인트가 왼쪽 위. 
        console.log("myShapeArr.length==="+myShapeArr.length);
        console.log("myShapeArr.length==="+JSON.stringify(myShapeArr));

        var ddf = false;
        
        www = www + 10; // 약간 더 크게 해서 계산.

        for(var i=0; i<myShapeArr.length; i++) {
            var x_ = myShapeArr[i]['x'];
            var y_ = myShapeArr[i]['y'];
            var www_ = myShapeArr[i]['www'];

            www_ = www_ + 10; // 약간 더 크게 해서 계산.

            var x_term1;
            var x_term2;
            var y_term1;
            var y_term2;
            var newShape_x1;
            var newShape_x2;
            var newShape_y1;
            var newShape_y2;

            // 왼쪽 상단이 기준점.
            if(shapeType=="rect"){
                // 왼쪽.
                x_term1 = x_ ;

                // 오른쪽.
                x_term2 = x_ + www_ ;

                // 아래
                y_term1 = y_ ;

                // 위
                y_term2 = y_ + www_;
                
                newShape_x1 = x_ran;
                newShape_x2 = x_ran + www;

                newShape_y1 = y_ran;
                newShape_y2 = y_ran + www;

            }else { // 가운데가 기준점.
                // 왼쪽.
                x_term1 = x_ - www_ ;

                // 오른쪽.
                x_term2 = x_ + www_ ;

                // 아래
                y_term1 = y_ - www_ ;

                // 위
                y_term2 = y_ + www_ ;

                
                newShape_x1 = x_ran - www ;
                newShape_x2 = x_ran + www ;

                newShape_y1 = y_ran - www ;
                newShape_y2 = y_ran + www ;
            }

            console.log("index="+i+"기본x : "+x_term1+ ", "+x_term2);
            console.log("index="+i+"기본y : "+y_term1+ ", "+y_term2);

            console.log("index="+i+"newShape_x : "+newShape_x1+ ", "+newShape_x2);
            console.log("index="+i+"newShape_y : "+newShape_y1+ ", "+newShape_y2);

            var x_overlap = false;
            var y_overlap = false;

            if( x_term1 > newShape_x1 && x_term1 < newShape_x2) {
                x_overlap = true;                    
            }

            if(x_term2 > newShape_x1 && x_term2 < newShape_x2){
                x_overlap = true;
            }

                
            if(  y_term1 > newShape_y1 && y_term1 < newShape_y2) {
                y_overlap = true;                    
            }

            if(y_term2 > newShape_y1 && y_term2 < newShape_y2) {
                y_overlap = true;
            }

            if(x_overlap && y_overlap){
                console.log("겹친다 다시 그려!");
                return true;                
            }
        }
        return false;
    }

    
    

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
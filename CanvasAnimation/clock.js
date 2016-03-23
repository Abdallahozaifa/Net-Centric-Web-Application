$(document).ready(function(){
    function showTime() {
        var clock = document.getElementById("clock");
        var t = new Date();
        clock.innerHTML = t.toLocaleTimeString();
        //setTimeout(showTime, 1000);
    }

    function showBrowserInfo() {
        console.log(window.navigator.appName);
        console.log(window.navigator.appVersion);
        console.log(window.navigator.appCodeName);
    };

    window.onload = function () {
        updateTime();
    };


    function updateTime() { // Update the SVG clock graphic to show current time
        var now = new Date(); 						// Current time
        var min = now.getMinutes(); 				// Minutes
        var hour = (now.getHours() % 12) + min/60; 	// Fractional hours
        var minangle = min*6; 						// 6 degrees per minute
        var hourangle = hour*30; 					// 30 degrees per hour

        // Get SVG elements for the hands of the clock
        var o = document.getElementById("svgClock"); 
        var oSvgDoc = o;
        var minhand = oSvgDoc.getElementById("minutehand");
        var hourhand = oSvgDoc.getElementById("hourhand");

        // Set an SVG attribute on them to move them around the clock face
        minhand.setAttribute("transform", "rotate(" + minangle + ",50,50)");
        hourhand.setAttribute("transform", "rotate(" + hourangle + ",50,50)");

        // Update the clock again in 1 minute
        setTimeout(updateTime, 60000);
    }
    
    /**
      * Animation Class 
      */
    var Animation = function(){
             this.divs = '';
             this.flags = ["flag1.png", "flag2.jpg", "flag3.png", "flag4.png", "flag5.png", "flag6.png", "flag4.png", "flag5.png", "flag6.png", "flag4.png", "flag5.png", "flag6.png"];
             this.yDegrees = [0,40,80,120,160,200,240,280,320,320,320];
             this.zDegrees = [200,200,200,200,200,200,200,200,200,200,200];
            this.yFlagRotation = [30,60,90,120,150,180,210,240,270,300,330,360]
    };
    
     /**
      * handles the movement 
      */
    Animation.prototype.movement = function(){
        for (var k = 1; k < 10; k++) {
            this.flagindex1 = Math.floor(Math.random() * this.flags.length);
            this.flagindex2 = Math.floor(Math.random() * this.flags.length);
            this.flagindex3 = Math.floor(Math.random() * this.flags.length);
            this.divs = this.divs + "<div id='flag" + k + "'><img src = 'assets/" + this.flags[this.flagindex1] + "' height = '60' width = '120'  class = 'flag' >\n\
            <img src = 'assets/" + this.flags[this.flagindex2] + "' height = '60' width = '120'  class = 'flag' >\n\
            <img src = 'assets/" + this.flags[this.flagindex3] + "' height = '60' width = '120'  class = 'flag' ></div>";
        }
        $('.animation').html(this.divs);
    };
    
     /**
      * animates each single component
      */
    Animation.prototype.animateSingleComponent = function(elm, yDegree, zDegree, yFlagRotationDegree){
        $(elm).css({
            WebkitTransform: 'rotate(' + yDegree +  'deg)',
            WebkitTransform: 'translateZ(' + zDegree + 'px)',
            transform: 'rotateY(' + (2* yFlagRotationDegree) + 'deg)',
        }); 
        console.log(elm);
    };
    
     /**
      * animates all the components 
      */
    Animation.prototype.animateAllComponents = function(){
        this.components = this.getAllComponents();
        for(var i=0;i<9;i++){
            animation.animateSingleComponent(this.components[i],this.yDegrees[i], this.zDegrees[i], this.yFlagRotation[i]);
            console.log(this.components[i]);
        }
    };
    
     /**
      * obtains all the components 
      */
    Animation.prototype.getAllComponents = function(){
        this.allComponents = $("[id^=flag]");
        console.log(this.allComponents);
        return this.allComponents;
    };
    var animation = new Animation();
    animation.movement();
});

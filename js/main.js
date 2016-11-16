/**********************************************************
 *
 * ********************************************************
 *
 *@description
 *  Bubble Similator
 *
 *@author
 * Rohit Ratna Sthapit
 *
 *
 ********************************************************/



var BUBBLE_LIMIT = 300;
var RADIUS = 10;
var DIA = 2 * RADIUS;
var DIA_ULTRA = 2.5 * RADIUS;
var CANVAS_HEIGHT = 500;
var CANVAS_WIDTH = 900;
var MOTION_SPEED = 1;
var TIME_LOOP = 50 // Millisecond

var CAR_HEIGHT = 100;
var CAR_WIDTH = 60;

/**
 * Define a Bubble Property
 */
function Bubble() {

    var bubbleid = 0; // Unique ID for Each bubble

    this.width = 0;
    this.height = 0;
    this.x = 0;
    this.y = 0;

    this.radius ; // if I want to change the RADIUS of each bubble
    this.centerX ;
    this.centerY ;
    this.element;


    this.xChanger = getRandom(0, 200) >100 ? MOTION_SPEED : -MOTION_SPEED; // Incresing or Decresing the X value
    this.yChanger = getRandom(0, 200) >100 ? MOTION_SPEED : -MOTION_SPEED; // Increasing or Decreasing the Y value

    this.getid = function() {
        return bubbleid;
    }

    this.init = function() {
        this.element = document.createElement('div');
        this.element.setAttribute('class', 'bubble');
    }

    this.setPosition = function(CX, CY, R) {
        this.centerX = CX;
        this.centerY = CY;
        this.radius = R;
        this.x = CX - R;
        this.y = CY - R;
        this.width = this.height = 2 * R;

    }

    this.draw = function() {
        this.element.style.top = this.y + 'px';
        this.element.style.left = this.x + 'px';
    }
}



/**
 * Movement and Creating Bubbles
 *
 */
function BubbleAnimation() {
    var that = this;

    var bubbles = []; // Collection of all the bubbles in the canvas

    /**
     * Constructor
     * @return {[type]} [description]
     */
    this.init = function() {

        this.container = document.getElementById('container');

        createbubbles();

        // ############## GAME LOOP #########
        setInterval(movebubbles, TIME_LOOP);
    }


    /**
     * Movement of bubbles as per the qudrarant Game loop function
     * @return {[None]} [None]
     */
     var movebubbles = function() {
        for (var i = 0; i < BUBBLE_LIMIT; i++) {
            var bubble = bubbles[i];
            bubble.x += bubble.xChanger;
            bubble.y += bubble.yChanger;


            bubble.draw();
            checkCollision(bubble, i);                                           // Pass Bubble and postion in the array
            checkWallCollision(bubble);
        }
    }


    /**
     * Reverse the direction of motion on wall collision
     * @param  {[Bubble]} bubble [Bubble which motion needs to be verified]
     * @return {[None]}        [None]
     */
    var checkWallCollision = function(bubble) {

        if (bubble.x <= 0) {
            bubble.xChanger = MOTION_SPEED;
        }
        if (bubble.y <= 0) {
            bubble.yChanger = MOTION_SPEED;
        }

        if (bubble.x >= (CANVAS_WIDTH - 2 * RADIUS)) {
            bubble.xChanger = -MOTION_SPEED;
        }
        if (bubble.y >= (CANVAS_HEIGHT - 2 * RADIUS)) {
            bubble.yChanger = -MOTION_SPEED;
        }


        bubble.draw();
    }


    /**
     * Checking Collision between the bubbles during the motion
     * @param  {[bubble]} bubble [Bubble thats motions needs to be checked]
     * @param  {[integer]} position [Position of bubble in bubbles[] array]
     * @return {[None]}          [None]
     */
    var checkCollision = function(bubble, position) {

        for (var i = 0; i < BUBBLE_LIMIT; i++) {

            if (i == position) {
                i++; // Skipping the current bubble in array
            }
            if (i < BUBBLE_LIMIT) // Eliminating the Undefined array
            {
                var diffX = Math.abs(bubble.x - bubbles[i].x);
                var diffY = Math.abs(bubble.y - bubbles[i].y);

                // Changing the direction of bubbles that collide
                if (diffX < DIA && diffY < DIA) {

                    if (diffX < DIA) {
                        if (bubble.x > bubbles[i].x) {
                            bubble.xChanger = MOTION_SPEED;
                            bubbles[i].xChanger = -MOTION_SPEED;
                        } else {
                            bubble.xChanger = -MOTION_SPEED;
                            bubbles[i].xChanger = MOTION_SPEED;
                        }
                    }
                    if (diffY < DIA) {
                        if (bubble.y > bubbles[i].y) {
                            bubble.yChanger = MOTION_SPEED;
                            bubbles[i].yChanger = -MOTION_SPEED;
                        } else {
                            bubble.yChanger = -MOTION_SPEED;
                            bubbles[i].yChanger = MOTION_SPEED;
                        }
                    }


                }
            }
        }
    }


    /**
     * Creates Bubbles that don't overlap
     * @return {[None]}
     */
    var createbubbles = function() {
        for (var i = 0; i < BUBBLE_LIMIT; i++) {

            var bubble = new Bubble();
            bubble.init(); // Initializing Bubble

            do {
                var randomX = getRandom(50, CANVAS_WIDTH);
                var randomY = getRandom(50, CANVAS_HEIGHT);
                bubble.setPosition(randomX, randomY, RADIUS);
            } while (overlap(bubble)); // Interate until no overlap Detected

            this.container.appendChild(bubble.element); // Adding bubble to the container
            bubble.draw();

            bubbles.push(bubble); // Pushing bubble to array
        }
    }


    /**
     * Overlap check if the created bubble is overlapped with any other bubble previously created
     * @return {[type]} [description]
     */
    var overlap = function(bubbleCheck) {
        for (var z = 0; z < bubbles.length; z++) { // Iterate over all the bubbles center
            var bubble = bubbles[z];


            if (collide(bubbleCheck, bubble)) {
                return true;

            }


        }

        return false; //Check each on else return Overlap 0

    }


    /**
     * [Checking the collision of two bubble]
     * @param  {[type]} bubble1 [description]
     * @param  {[type]} bubble2 [description]
     * @return {[Bollean]}         [true | false]
     */
    var collide = function(bubble1, bubble2) {

        var centerXDiff = bubble1.centerX - bubble2.centerX;
        centerXDiff = centerXDiff * centerXDiff;

        var centerYDiff = bubble1.centerY - bubble2.centerY;
        centerYDiff = centerYDiff * centerYDiff;

        var d = Math.sqrt(centerXDiff + centerYDiff);

        if ((2 * RADIUS) > d || d < 0) {
            return true; //Overlap Detected
        } else {
            return false; //Check each on else return Overlap 0
        }

    }
}



/**
 * Generate Random Number
 * @param  {[Integer]} min [description]
 * @param  {[Integer]} max [description]
 * @return {[Random Value]}     [description]
 */
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}



// ############## Javascript Funciton Initializing #####################
new BubbleAnimation().init();

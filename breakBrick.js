/* gotrixx/BreakBrick
 *
 * /game.js - Canvas initialisation, game launcher
 *
 * coded by Gotrixx !
 * started at 17/05/2016
 */

(  function( BreakBrick ) {

    "use strict";

    var BreakBrick;

    BreakBrick = function( oApp ) {

        var canvas = document.getElementById("game"),
            game = this,
            grid = {},
            i = 1,
            gameStarted = false,
            gamePaused = false,

            // Key
            arrowLeft = 37,
            arrowRight = 39,
            enterKey = 13,
            spaceKey = 32,
            keyPressed = false,
            goLeft = false,
            goRight = false,

            // Line
            lineW = 50,
            lineH = 7,
            dxLine = canvas.width / 2 - 50 / 2,
            dxLineMin = 0 + 4,
            dxLineMax = canvas.width - lineW - 5,
            dyLine = 391,
            lineSpeed = 3,

            //ball
            dxBall = canvas.width / 2,
            dyBall = dyLine - lineH,
            ballRadius = 7,
            ballSpeed = 1;

        grid = {
            "1":["white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white"],
            "2":["white", "white", "white", "white", "white", "black", "black", "black", "black", "white", "white", "white", "white", "white"],
            "3":["white", "white", "white", "black", "black", "red", "red", "red", "red", "black", "black", "white", "white", "white"],
            "4":["white", "white", "black", "red", "red", "white", "red", "red", "red", "red", "red", "black", "white", "white"],
            "5":["white", "white", "black", "red", "white", "white", "white", "red", "red", "red", "red", "black", "white", "white"],
            "6":["white", "black", "red", "red", "red", "white", "red", "red", "red", "red", "red", "red", "black", "white"],
            "7":["white", "black", "red", "red", "red", "red", "black", "black", "red", "red", "red", "red", "black", "white"],
            "8":["white", "black", "black", "red", "red", "black", "white", "gray", "black", "red", "red", "black", "black", "white"],
            "9":["white", "black", "white", "black", "black", "black", "gray", "gray", "black", "black", "black", "gray", "black", "white"],
            "10":["white", "white", "black", "white", "white", "white", "black", "black", "gray", "gray", "gray", "black", "white", "white"],
            "11":["white", "white", "black", "gray", "white", "white", "white", "gray", "gray", "gray", "gray", "black", "white", "white"],
            "12":["white", "white", "white", "black", "black",  "gray", "gray", "gray", "gray", "black", "black", "white", "white", "white"],
            "13":["white", "white", "white", "white", "white", "black", "black", "black", "black", "white", "white", "white", "white", "white"],
            "14":["white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white"]
        };

        this.app = oApp;

        this.time = {
            "start": null,
            "current": null
        };

        // Background
        this.background = {
            "frames": {
                "sx": 0,
                "sy": 0,
                "sw": 308,
                "sh": 511,
                "dx": 0,
                "dy": 0,
                "dw": game.app.width,
                "dh": game.app.height
            },
            "draw": function() {
                game._drawSpriteFromFrame( this.frames );
            }
        };

        // Line
        this.line = function() {
            var oContext = game.app.context,
                speed;

            oContext.fillStyle = "#00aeef";

            if ( gamePaused ) {
                speed = 0;
            }else {
                speed = lineSpeed;
            }

            if (keyPressed === arrowLeft && dxLine >= dxLineMin && gameStarted) {
                dxLine -= speed;
            }else if (keyPressed === arrowRight && dxLine <= dxLineMax && gameStarted) {
                dxLine += speed;
            }

            if (dxLine < dxLineMin) {
                dxLine = dxLineMin;
            }
            if (dxLine > dxLineMax) {
                dxLine = dxLineMax;
            }

            oContext.fillRect( dxLine, dyLine, lineW, lineH );
        };

        // ball
        this.ball = function() {
            var oContext = game.app.context,
                speed;

            if ( gamePaused ) {
                speed = 0;
            }else {
                speed = ballSpeed;
            }

            if ( gameStarted ) {
                dyBall -= speed;
            }else {
                dyBall = dyBall;
            }

            oContext.beginPath();
            oContext.fillStyle = "red";
            oContext.arc( dxBall, dyBall, ballRadius, 0, 2 * Math.PI);// on dessine les cercle depuis le centre
            oContext.fill();
        };

        // Blocks
        this.blocks = function() {
            var oContext = game.app.context,
                j,
                dx = 8,
                dy = 8,
                dw = 20,
                dh = 20;

            for( i = 1 ; i <= 14 ; i++ ) {// Il faut réinitialiser le i parce que sinon il ne repasse jamais a 1 (en tout cas ca fait buger)
                for ( j = 0; j <= 13 ; j++ ) {
                    oContext.fillStyle = grid[i][j];
                    oContext.fillRect( dx, dy, dw, dh );
                    dx += 21;
                }
                dx = 8;
                dy += 21;
            }
        };

        this.getKeyPressed = function( oEvent ) {
            // Ici on gère les différents événement clavier.
            // ENTER démarre le jeu
            // ESPACE met le jeu en pause ou le relance
            // les FLECHE GAUCHE et DROITE dirrige la barre dans leur sens
            if ( oEvent.type === "keydown" ) {
                if (oEvent.which === enterKey) {
                    gameStarted = true;
                    gamePaused = false;
                    return keyPressed = 13;
                }else if (oEvent.which === spaceKey){
                    if ( gamePaused ){
                        gamePaused = false;
                    }else if ( !gamePaused ){
                        gamePaused = true;
                    }
                    return keyPressed = 32;
                }else if (oEvent.which === arrowLeft){
                    return keyPressed = 37;
                }else if (oEvent.which === arrowRight){
                    return keyPressed = 39;
                }
            }

            // quand on relache la touche on envois une valeur false
            if ( oEvent.type === "keyup" && oEvent.which != 13 ) {
                return keyPressed = false;
            }

            this.line();
        };
        
        // Utils
        this._drawSpriteFromFrame = function( oFrame ) {
            this.app.context.drawImage(
                this.spriteSheet,
                oFrame.sx,
                oFrame.sy,
                oFrame.sw,
                oFrame.sh,
                oFrame.dx,
                oFrame.dy,
                oFrame.dw,
                oFrame.dh
            )
        };

        this.animate = function() {
            this.time.current = Date.now();
            this.animationRequestID = window.requestAnimationFrame( this.animate.bind( this ) );

            // draw: clear
            this.app.context.clearRect( 0, 0, this.app.width, this.app.height );
            // draw: background
            this.background.draw();
            // draw: line
            this.line();
            // draw: ball
            this.ball();
            // draw: blocks
            this.blocks();
        }

        // Init game
        this.start = function() {
            // declare click & keyup events
            keyPressed = window.addEventListener( "keydown", this.getKeyPressed.bind( this ) );
            keyPressed = window.addEventListener( "keyup", this.getKeyPressed.bind( this ) );
            // reset some variables
            this.time.start = Date.now();
            // launch animation
            this.animate();
        };

        // Load spritesheet
        this.spriteSheet = new Image();
        this.spriteSheet.addEventListener( "load", this.start.bind( this ) );
        this.spriteSheet.src = "./resources/sprite.png";

    };

    // récuperer le keycode
    // document.addEventListener("keydown", function(event) {
    //     console.log(event.which);
    // });

    window.BreakBrick = BreakBrick;

} )();

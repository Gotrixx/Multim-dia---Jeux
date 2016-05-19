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

            // Border
            dxMin = 5,
            dxMax = canvas.width - 5,
            dyMin = 5,
            dyMax = 391,

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
            dxLineMin = dxMin,
            dxLineMax = dxMax - lineW,
            dyLine = dyMax,
            lineSpeed = 3,

            //ball
            ballRadius = 6,
            dxBall = canvas.width / 2,
            dyBall = dyLine - ballRadius,
            ballSpeedX = -2,
            ballSpeedY = -3,
            directionX = 1,
            directionY = 1;

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
                "sw": 309,
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

        // Blocks
        this.blocks = function() {
            var oContext = game.app.context,
                j,
                dxBlocks = 8,
                dyBlocks = 8,
                blocksW = 20,
                blocksH = 20;

            for( i = 1 ; i <= 14 ; i++ ) {// Il faut réinitialiser le i parce que sinon il ne repasse jamais a 1 (en tout cas ca fait buger)
                for ( j = 0; j <= 13 ; j++ ) {
                    oContext.fillStyle = grid[i][j];
                    oContext.fillRect( dxBlocks, dyBlocks, blocksW, blocksH );
                    dxBlocks += 21;
                }
                dxBlocks = 8;
                dyBlocks += 21;
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
                speedX = ballSpeedX,
                speedY = ballSpeedY;

            // Si le jeu est en pause on met la vitesse à 0 sinon on la remet
            if ( gamePaused ) {
                speedX = 0;
                speedY = 0;
            }else {
                speedX = ballSpeedX;
                speedY = ballSpeedY;
            }

            // Gestion des collisions avec les bords du jeu
            // changer la direction plutot que la valeur -> ca bug moins
            if ( dyBall - ballRadius <= dyMin ){
                directionY *= -1;
            }

            if ( dxBall - ballRadius <= dxMin || dxBall + ballRadius >= dxMax ) {
                directionX *= -1;
            }

            // Game over
            if ( dyBall + ballRadius >= dyMax + lineH / 2 ) {
                directionX = 0;
                directionY = 0;
                console.log("You lose !");
                this.restart();
            }

            // Au démarage la balle monte verticalement
            // Départ aléatoire ??
            if ( gameStarted ) {
                dxBall += speedX * directionX;
                dyBall += speedY * directionY;
            }else {
                dxBall = dxBall;
                dyBall = dyBall;
            }

            oContext.beginPath();
            oContext.fillStyle = "red";
            oContext.arc( dxBall, dyBall, ballRadius, 0, 2 * Math.PI);// on dessine les cercle depuis le centre
            oContext.fill();
        };

        this.restart = function() {
            console.log("Bite");
            gameStarted = false;

            //Reset Ball
            ballRadius = 6;
            dxBall = canvas.width / 2;
            dyBall = dyLine - ballRadius;
            ballSpeedX = -2;
            ballSpeedY = -3;
            directionX = 1;
            directionY = 1;

            //Reset line
            dxLine = canvas.width / 2 - 50 / 2;
            lineSpeed = 3;

            keyPressed = window.addEventListener( "keydown", this.getKeyPressed.bind( this ) );
            keyPressed = window.addEventListener( "keyup", this.getKeyPressed.bind( this ) );
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
            // draw: blocks
            this.blocks();
            // draw: line
            this.line();
            // draw: ball
            this.ball();
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
        this.spriteSheet.src = "sprite.png";

    };

    // récuperer le keycode
    // document.addEventListener("keydown", function(event) {
    //     console.log(event.which);
    // });

    window.BreakBrick = BreakBrick;

} )();

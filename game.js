/* gotrixx/BreakBrick
 *
 * /game.js - Canvas initialisation, game launcher
 *
 * coded by Gotrixx !
 * started at 17/05/2016
 */

(  function( BreakBrick ) {

	"use strict";

	var oApp = {
		"canvas": null,
		"context": null,
		"width": null,
		"height": null
	},
	_isCanvasSupported;

	_isCanvasSupported = function( $canvasElt ) {
		return !!$canvasElt.getContext;// ! transforme en booléen ET inverse donc on refait pour ne pas inverser
	};

	oApp.setup = function() {
		this.canvas = document.querySelector( "#game" );

		if ( !_isCanvasSupported( this.canvas ) ) {
			return console.error( "Canvas isn't supported !" );
		}

		this.context = this.canvas.getContext( "2d" );
		this.width = this.canvas.width;
		this.height = this.canvas.height;

		window.game = new BreakBrick( this );
	};

	oApp.setup();

} )( window.BreakBrick );

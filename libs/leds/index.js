const _ = require('lodash');


function Leds( numPixels, port, options ){
	//map
	this._leds = _.map( _.times( numPixels ), index => {
		return [0,0,0];
	} );

	this.leds = _.map( _.times( numPixels ), index => {
		return [0,0,0];
	} );
}

Leds.prototype.getPixel = function( index ){
	return leds[index];
}

Leds.prototype.show = function(){
	var changed = false;
	_.each( this.leds, ( led, index ) => {
		var iled = this._leds[index];
		var changes = _.map( _.times(3), i => {
			return iled[i] != led[i] ? led[i] : null;
		} );

		if( _.filter( changes ).length > 0 ){
			//send the data
			sendData( `${ index }:${ led[0] }:${ led[1] }:${ led[2] },` );
			//reset the reference
			_.each( _.times(3), i => {
				return iled[i] = led[i];
			} );
			//make note
			changed = true;
		}
	} )

	if( changed ){
		sendData(',');
	}
}
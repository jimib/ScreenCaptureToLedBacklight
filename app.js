
const DataStream = require('./libs/datastream');
const SerialPort = require('serialport');
const _ = require('lodash');

const NUM_PIXELS = 144;
const BAUD_RATE = 57600;

const stream = new DataStream({sep:'\n'});
const port = new SerialPort('/dev/tty.usbmodem1411', { autoOpen: true, baudRate:BAUD_RATE });

function runAnimation(){
	var startIndex = 0;
	var index = 0;
	var phase = 0;
	var lum = 40;
	setInterval( function(){
		index = ( (index + 1) % (NUM_PIXELS - startIndex) );
		phase += 0.05;
		//console.log('phase', phase);
		_.each( _.times( 20 ), i => {
			var color = 40;
			var p = i * 0.1;
			LEDS.setPixel( (index + i) % NUM_PIXELS, 
				Math.round( lum * 0.5 * (1 + Math.cos( phase + p )) ), 
				Math.round( lum * 0.5 * (1 + Math.cos( phase + p + 2 )) ), 
				Math.round( lum * 0.5 * (1 + Math.cos( phase + p + 4 )) )
			);
		} );
		LEDS.setPixel( (startIndex + index) % NUM_PIXELS, 0, 0, 0 );
		LEDS.show();
	}, 2 );
}


function Leds( numPixels, options ){
	//map
	this._leds = _.map( _.times( numPixels ), index => {
		return [0,0,0];
	} );

	this.leds = _.map( _.times( numPixels ), index => {
		return [0,0,0];
	} );
}

Leds.prototype.getPixel = function( index ){
	return this.leds[index];
}

Leds.prototype.setPixel = function( index, r, g, b ){
	var led = this.leds[index];
	
	led[0] = r;
	led[1] = g;
	led[2] = b;
}

Leds.prototype.show = function(){
	var changed = false;
	_.each( this.leds, ( led, index ) => {
		var iled = this._leds[index];
		var changes = _.map( _.times(3), i => {
			return iled[i] != led[i] ? led[i] : null;
		} );

		if( _.filter( changes, value => value != null ).length > 0 ){
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

const LEDS = new Leds( NUM_PIXELS );

var _data = '', dataLimit = BAUD_RATE;
function sendData( data ){
	//console.log('sendData', data.length);
	_data += data;
}

var count = 0;
setInterval( () => {
	if( _data.length > 0 ){
		var end = Math.min( _data.length, dataLimit );
		port.write( _data.substr( 0, end ) );
		_data = _data.substr( end );
	}
}, 10 );

_.each( ['open','closed','error','data'], ( eventName ) => {
	port.on( eventName, {
		data : function( data ) {
			//notify that event fired
			stream.push( data.toString() );
		},
		error : function( data ) {
			//do nothing - it will be closed and reopened
		},
		open : function(){
			setTimeout( function(){
				runAnimation();
			}, 2000 );
		}
	}[ eventName ] || function(){
		console.log(`${eventName}`);
	} );
} );

stream.on('data', data => console.log( data ) );


//check the status and auto open
setInterval( () => {
	if( !port.isOpen && !port.isOpening ){
		port.open();
	}
}, 1000 )


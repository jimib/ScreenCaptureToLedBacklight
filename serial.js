const DataStream = require('./libs/datastream');

const SerialPort = require('serialport');
const port = new SerialPort('/dev/tty.usbmodem14331', { autoOpen: true, baudRate:115200 });
const stream = new DataStream({sep:'\n'});
const _ = require('lodash');

const NUM_PIXELS = 144;

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
			console.log('open');
			var startIndex = 0;
			var index = 50;
			setTimeout( function(){
				setInterval( function(){
					index = ( (index + 1) % (NUM_PIXELS - startIndex) );
	
					_.each( _.times( 10 ), i => {
						var color = 40;
						port.write( `${( startIndex + index + i + 1) % NUM_PIXELS}:${color}:${color}:${color},` );
					} );
					port.write( `${(startIndex + index) % NUM_PIXELS}:0:0:0,` );
					
					port.write( `,` );
	
				}, 2 );
			}, 2000 )
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

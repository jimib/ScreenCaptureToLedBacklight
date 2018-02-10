const DataStream = require('./libs/datastream');

const SerialPort = require('serialport');
const port = new SerialPort('/dev/tty.usbmodem14331', { autoOpen: true });
const stream = new DataStream({sep:'\n'});
const _ = require('lodash');

port.open(function (err) {
	if (err) {
		return console.log('Error opening port: ', err.message);
	}
});

_.each( ['open','closed','error','data'], ( eventName ) => {
	port.on( eventName, {
		data: function( data ) {
			//notify that event fired
			stream.push( data.toString() );
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

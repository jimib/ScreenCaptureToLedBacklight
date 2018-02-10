function DataStream( options ){
	options = options || {};

	this.data = "";
	this.sep = options.sep || '\n';
}

const EventEmitter = require('events').EventEmitter;
const util = require('util');
util.inherits( DataStream, EventEmitter );

DataStream.prototype.push = function( data ){
	if( typeof data == 'string' ){
		this.data += data;
	}

	while( true ){
		var index = this.data.indexOf( this.sep );
		if( index > -1 ){
			var idata = this.data.substr( 0, index );
			this.data = this.data.substr( index + 1 );

			this.emit( 'data', idata );
		}else{
			break;
		}
	}
}

module.exports = DataStream;
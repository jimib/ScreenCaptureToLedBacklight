const spawn = require('child_process').spawn;
const pngStreamer = require('png-streamer');
const getPixels = require('get-pixels');
const _ = require('lodash');
const Vibrant = require('node-vibrant');

var ffmpegArgs = [
	'-t', '10', '-f', 'avfoundation', '-i', '"1:0"', '-vf', 'scale=240:-1',
	//'-vf',
	//'fps=' + options.fps,
	'-f',         //<<
	'image2pipe', //<<
	'-vcodec',    //<<
	'png',        //<<
	'"pipe:1"'
];

//ffmpeg -t 10 -f avfoundation -i "1:0" -vf scale=240:-1 -f image2pipe -vcodec png "pipe:1"

const args = '-t 5 -framerate 5 -f avfoundation -i 1:0 -vf scale=240:-1 -r 5 -f image2pipe -vcodec png pipe:1'.split(' ');
//console.log( args );
const ffmpeg = spawn('ffmpeg', args);


var count = 0;
new pngStreamer(ffmpeg, function( err, data ){
	console.log('frame',count++);
	Vibrant.from( data ).getPalette(function(err, palette){
		console.log( palette );
	});
	
	false && getPixels( data, 'image/png', function( err, data ){
		console.log('pixels', data.shape.join(','));
		console.log( data.data.length, getPixelAt( data, 120, 50 ) );

	})
});

setTimeout(() => {
	console.log('done');
}, 10000 );

function getPixelAt( image, x, y ){
	var [w,h,channels] = image.shape;

	var i = (y * w * channels) + (x * channels);
	console.log( i, image.data.length );
	return _.slice(image.data, i, i + channels );
}
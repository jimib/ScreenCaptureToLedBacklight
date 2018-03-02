#Serial controlled LED Animation using Arduino

Refer to this animation loop. In this instance it is controlling 20 pixels at a time, using the phase to turn to them various colours of the rainbow.

This mechanism is slow due to the data limitations of the serial, the more you reduce the changes per frame the faster the code will run.

```
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
```


# Ruugh Prototyping - Screen Capture to Led Backlights

This is a rough working of code for doing screen capture to drive some LEDS. Not finished and code is broken unless you are able to decipher each of the individual bits. This will be tidied up and fully documented once completed.

https://stackoverflow.com/questions/34517234/how-to-pipe-sequence-of-thumbnails-screenshots-from-ffmpeg-to-nodejs-for-further

```
var ffmpegArgs = [
        '-t', 
        options.duration, 
        '-s', 
        options.width + 'x' + options.height, 
        '-f', 
        'x11grab', 
        '-i', 
        ':' + options.display + '+' + options.offsetX + ',' + options.offsetY, 
        '-vf',
        'fps=' + options.fps,
        '-f',         //<<
        'image2pipe', //<<
        '-vcodec',    //<<
        'png',        //<<
        'pipe:1'
    ], 
    ffmpeg = spawn('ffmpeg', ffmpegArgs);

new pngStreamer(ffmpeg, callback);
```
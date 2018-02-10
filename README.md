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
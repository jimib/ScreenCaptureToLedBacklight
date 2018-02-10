ffmpeg -t 10 -f avfoundation -i "1:0" -vf scale=240:-1 -r 5 output%5d.jpg
ffmpeg -t 10 -f avfoundation -i "1:0" -vf scale=240:-1 -f image2pipe -vcodec png "pipe:1"
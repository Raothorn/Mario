for i in {12..23}
do
ffmpeg -i _$i.png -filter:v "hflip" $i.png
done

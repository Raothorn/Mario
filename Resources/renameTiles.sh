for i in {0..11};
do
tileNum=$(($i + $1))
tileName=tile0$tileNum.png;

cp $tileName $i.png

done

#!/bin/bash
echo "entering zipdir.sh"
DIRNAME=$1
echo "DIRNAME is $DIRNAME"
PREFIX="jphmenu-"
echo "PREFIX is $PREFIX"
FUNKY=$PREFIX$DIRNAME
echo "doing ${DIRNAME} with function of ${FUNKY} "
cd ${DIRNAME}
# zip -r function.zip .
zip function.zip index.js
aws lambda update-function-code --function-name ${FUNKY} --zip-file fileb://function.zip > /tmp/${DIRNAME}.out
cd ..

#!/bin/bash

for project_file in `ls plugins/*/src/tsconfig.json`
do
	echo Linting project \"$project_file\"
	tslint -c tslint.json -p $project_file -e **/src/phaser/*.ts
	if [ $? -gt 0 ]
	then
		echo
		echo Aborting loop.
		echo Please, fix the errors of \"$project_file\" to continue.				
		echo

		exit
	else
		echo
		echo Project in excelent shape! :\)
		echo
	fi
done
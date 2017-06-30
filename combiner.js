#! /usr/bin/env node

var fs = require('fs');
var path = require('path');
var csv = require('csvtojson');
var csvWriter = require('csv-write-stream');



//setup -- remove two system arguments from array for cleanliness
var files = process.argv.splice(2); 

// remove files from arguments array if they don't exist in file system.
for (var a = 0; a<files.length;a++){
	var file = files[a];
	var index = files.indexOf(file);
	if (!fs.existsSync(file)){
		files.splice(index, 1);
		console.log("\nFile doesn't exist. Removing from program.\n");
	}
}

//create column headers
var writer = csvWriter({headers: ['email_hash','category','filename']});

files.forEach(function(file){
	//get filename to add to each line
	var nameOfFile = path.basename(file, ".csv");

	var stream = fs.createReadStream(file);

	csv({noheader:false, escape:'\\', quote:'"', toArrayString:true})
		.fromStream(stream)
		.on('csv',(csvRow)=>{
			csvRow[2] = nameOfFile;
			//console.log(csvRow);
			writer.write(csvRow);
			return csvRow;
		})
		.on('done',(error)=>{
			writer.end();
		})
});
//print to specified file
writer.pipe(process.stdout);
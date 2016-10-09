var papa = require('papaparse');
var _ = require('lodash');
var fs = require('fs');
var text = fs.readFileSync('Population.csv', 'utf8');
var fileData = papa.parse(text, {header:true}).data;
var header = fileData.slice(0, 1)[0];

var express = require('express');
var http = require('http');
var app = express();
app.use(express.static('public/.'));
app.get('/', function(req, res){
	res.redirect('visualize.html');
});

app.post('/country', function(req, res){
	var data = [];
	req.on('data', function(chunk){
		data.push(chunk);
	}).on('end', function(){
		var countryName = data.toString().split('=')[1];
		writeData(parseData(data, countryName));
	});
	res.send('');
})
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var ip = process.env.OPENSHIFT_NODEJS_IP || "localhost";
console.log("Starting Server at port:", port);


http.createServer(app).listen(port, ip);


var parseData = function(data, countryName) {
	return fileData.filter(function(each){
		return each['Country Name'] == countryName;
	});
}

var writeData = function(data){
	var writableData = [];
	for(var key in data[0]){
		writableData.push([key.split(' ')[0], data[0][key]]);
	}
	writableData.splice(0, 1);
	fs.writeFileSync('public/countryPopulation.csv', papa.unparse({data:writableData, fields:['year', 'population']}));
}


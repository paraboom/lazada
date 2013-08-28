var express = require('express'),
	http = require('http'),
	url = require('url'),
	app = express();

app.get('/', function(req, res){
	res.sendfile(__dirname + '/index.html');
});

app.get('*.js', function(req, res){
	res.sendfile(__dirname + req.url);
});

app.get('*.png', function(req, res){
	res.sendfile(__dirname + req.url);
});

app.get('*.css', function(req, res){
	res.sendfile(__dirname + req.url);
});

app.get('/proxy', function(req, res){
	var params = url.parse(req.url, true);
	var URL = "http://" + params.query.url;

	var destParams = url.parse(URL);

	var reqOptions = {
		host: destParams.host,
		port: 80,
		path: destParams.pathname,
		method: "GET"
	};

	var innerReq = http.request(reqOptions, function(innerRes){
		var headers = innerRes.headers;
		res.writeHead(200, headers);

		innerRes.on('data', function(chunk) {
            res.write(chunk);
        });

        innerRes.on('end', function() {
            res.end();
        });
	});

	innerReq.on('error', function(e) {
        console.log('An error occured: ' + e.message);
        res.writeHead(503);
        res.write("Error!");
        res.end();
    });
    innerReq.end();
});

app.listen(process.env.PORT || 1234);
var http = require("http"),
	fs = require("fs"),
	static = require("node-static"),
	express = require("express"),
	bodyParser = require("body-parser"),
	request = require("request"),
	url = require("url"),
	urlDataMining = "https://translate.google.ru/translate_a/single?client=t&sl=en&tl=ru&hl=ru&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&dt=at&ie=UTF-8&oe=UTF-8&source=btn&srcrom=1&ssel=0&tsel=0&kc=6&tk=521364|344733&q=",
	MongoClient = require('mongodb').MongoClient,
	assert = require('assert'),
	app = express();

app.use(bodyParser());

app.use("/allwords", function(req, res, next) {
	MongoClient.connect('mongodb://localhost:27017/chat', function(err, db) {
	  if (err) throw err;

	  var collection = db.collection("vocabulary");

	  collection.find().sort({_id: 1}).toArray(function(err, docs) {
	  	if (err) {
	  		console.log("Error occured at operation toArray in getting words from db");
	  		return;
	  	}

	  	res.send(docs);
	  	db.close();
	  })
	});
});

app.use("/search", function(req, res, next) {
	//var word = url.parse(req.url, true).query.word;
	var word = req.body.word;
		request({
			 url: urlDataMining + (word || "brace"),
			 json: true
			}, 
			function(error, response, body) {
				if (!error) {
					var reg = /[a-zA-Z]/g,
						parsedBody = response.body.replace(/,{2,}/g, ",").replace(/\[,/g, "["),
						content = JSON.parse(parsedBody),
						mainWord = content[0][0][0],
						allWords = [];

					if (reg.test(mainWord)) {
						console.log("Error: translating have english characters");
						res.status(404).end();
						return;
					}

					
					if ( content[1] && Array.isArray(content[1]) ) {
						allWords = content[1].reduce(function(cur, next) {
							next[1].forEach(function(v) {
								if (cur.indexOf(v) === -1) {
									cur.push(v);
								}
							});
							return cur;
						}, [mainWord]);
					} else if (mainWord) {
						allWords[0] = mainWord;
					}

					res.send({
						allTranslatedWords: allWords,
						originalWord: word
					});
				} else {
					console.log("Произошла ошибка при получение страницы результатов поиска");
				}
		});
});


app.use("/save", function(req, res, next) {
	var data = req.body;
	/*var wordsArray = [];

	for (var word in data) {
		wordsArray.push({ word: word, translate: data[word] });
	}*/

	MongoClient.connect('mongodb://localhost:27017/chat', function(err, db) {
	  if (err) throw err;

	  var collection = db.collection("vocabulary");

	  collection.insertMany(data, function(err, results) {
	  	if (err) throw err;
	  	console.log(results);
	  	db.close();
	  	res.status(200).end();	
	  });
	});

});

app.use("/getjson", function(req, res, next) {
	console.log(req)
	res.json("OK");
});

app.use("/", function(req, res, next) {
	res.sendFile(__dirname + req.path, function(err) {
		if (err) {
			console.log("Error occured at path: ", req.path);
			console.log(req.path);
		} else {
			console.log("All good");
		}
	});
});


app.listen(3030, function() {
	console.log("Server running on 3030");
});

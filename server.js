var http = require("http");
var fs = require("fs");
var static = require("node-static");
var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var url = require("url");
var urlDataMining = "https://translate.google.ru/translate_a/single?client=t&sl=en&tl=ru&hl=ru&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&dt=at&ie=UTF-8&oe=UTF-8&source=btn&srcrom=1&ssel=0&tsel=0&kc=6&tk=521364|344733&q=";

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var app = express();

app.use(bodyParser());

app.use("/allwords", function(req, res, next) {
	MongoClient.connect('mongodb://localhost:27017/chat', function(err, db) {
	  if (err) throw err;

	  var collection = db.collection("vocabulary");

	  collection.find().sort({_id: 1}).toArray(function(err, docs) {
	  	res.send(docs);
	  	db.close();
	  })
	});
})

app.use("/search", function(req, res, next) {
	//var word = url.parse(req.url, true).query.word;
	var word = req.body.word;
		request({
			 url: urlDataMining + (word || "brace"),
			 json: true
			}, 
			function(error, response, body) {
				if (!error) {
					var parsedBody = response.body.replace(/,{2,}/g, ",").replace(/\[,/g, "[");
					var content = JSON.parse(parsedBody);
					var mainWord = content[0][0][0];
					var allWords = [];

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

					res.send(allWords);
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


function formatingData(key, value) {
	if (typeof value === "string") {
		return value.toLowerCase();
	} else {
		return value;
	}
}
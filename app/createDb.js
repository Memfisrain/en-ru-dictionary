var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/chat';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  if (err) throw err;

  var collection = db.collection("vocabulary");
  collection.remove({}, function(err, affected) {

  	collection.insert({a: ["one", "two"]}, function(err, docs) {
	  	collection.count(function(err, count) {
	  		console.log("count= ", count);
	  	});

	  	collection.find({}).toArray(function(err, results) {
		  	if (err) {
		  		throw err;
		  	}
		  	console.log(results);
		  	db.close();
		  });
	  });

  })

  
});
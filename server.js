var express = require('express')
var app = express()
var mongo = require('mongodb').MongoClient
var validUrl = require('valid-url')
var dbUrl = 'mongodb:' + process.env.IP + '/data'





app.get('/', function(req, res){
  // output base information
  var url = req.get('host')
  var stringy = 'API Basejump: URL Shortener\n\n' +
              'User stories: \n\n' + 
              '1) I can pass a URL as a parameter and I will receive a shortened URL in the JSON response. \n' +
              '2) When I visit that shortened URL, it will redirect me to my original link.\n\n' +
              'Example creation usage:\n\n' +
              '  ' + url + '/new/https://www.google.com\n' +
              '  ' + url + '/new/http://freecodecamp.com/news\n\n' +
              'Example creation output:\n\n' +
              '  { "original": "http://freecodecamp.com/news", "redirect":' + url + '/4 }\n\n' +
              'Usage:\n\n' +
              'https://shurli.herokuapp.com/4\n\n' +
              'Will redirect to:\n\n' +
              'http://freecodecamp.com/news\n'
  
  res.end(stringy)
})


app.get('/:rLink', function(req,res){
  var rLink = req.params.rLink
  var url = req.get('host')
   
  mongo.connect(dbUrl, function(err, db){
    if(err) throw err
      
    var collection = db.collection('sUrls')
    var toFind = {'redirect': parseInt(rLink)}
    collection.find( toFind )
      .toArray(function(err,docs){
        if(err) throw err
          
        if(docs[0]) {
          res.redirect('http://' + docs[0].original)
          db.close()
        } else {
          res.json({"error":"No short url found for given input"})
          res.end()
          db.close()
        }
         
      })
      
   })
  
})


app.get('/new/:newUrl', function(req, res){
  var newUrl = req.params.newUrl
  var url = req.get('host')
      
  if ( validUrl.isUri( 'http://' + newUrl ) === undefined ) {
    // return error
    res.json({'error': 'Invalid Url'})
    res.end()
  } else {
    
    mongo.connect(dbUrl, function(err, db){
      if(err) throw err
      
      var collection = db.collection('sUrls')
      collection.find({'original': newUrl}).toArray(function(err, docs){
        if(err) throw err
        
        if(docs[0]) {
          // return the original record if it already exists
          res.json(  {'original': docs[0].original, 'redirect': url + '/' + docs[0].redirect} )
          res.end()
          db.close()
          
        } else {
          //insert new record and return it
          collection.count({},function(err, count){
            if(err) throw err
            count += 1
            collection.insert({'original': newUrl, 'redirect': count})
            res.json( {'original': newUrl, 'redirect':  url + '/' + count } )
            res.end()
            db.close()
          })
          
        }
        
      })
      
    })
    
  }
  
})



app.listen(process.env.PORT)


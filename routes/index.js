var express = require('express');
var router = express.Router();
var Auth = require('../config/oauth');
var request = require('superagent');
var oauthSignature = require ('oauth-signature');
var n = require('nonce')();
var jsonp = require('superagent-jsonp');
var User = require('../models/user');
var Location = require('../models/location');

/* GET home page. */
module.exports = function(passport) {
    
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/',
            failureRedirect : '/',
            failureFlash: true
        }));

router.post('/api/getUser', function(req, res){
    res.send(req.user);
})

router.post('/api/addAttending', function(req, res){
    var user = req.user;
    var id = req.body.id;
    
    User.findById(user.id, function(err, doc){
        user.addAttending(id);
        Location.findOne({yelpId : id}, function(err, doc){
        if (doc) {
            doc.addAttending();
        }
        else {
            var location = new Location();
            location.yelpId = id;
            location.attending = 1;
            location.save();
        }
        res.json({user: user, id : id, type : 'add'})
    })
    })
});

router.post('/api/removeAttending', function(req, res){
    var user = req.user;
    var id = req.body.id;
    
    User.findById(user.id, function(err, doc){
        user.removeAttending(id);
        Location.findOne({yelpId : id}, function(err, doc){
            doc.removeAttending();
            res.json({user: user, id : id, type : 'remove'})
    })
    })
})

router.post('/api/setLastSearch', function(req, res){
    var userId = req.user._id;
    var search = req.body.search;
    
    User.findById(userId, function(err, doc){
        doc.setLastSearch(search);
        res.send(doc);
    })
})
        
router.post('/api/yelp', function(req, res){
        var locationArray = []; //empty array
        
        var location = req.body.location;
    
        var timestamp = new Date().getTime();
            console.log(timestamp)
        var nonce = n();
            console.log(nonce)
        var method = 'GET';
        var url = 'https://api.yelp.com/v2/search';
        var params = {
            oauth_consumer_key: Auth.yelp.consumer_key,
            oauth_token: Auth.yelp.token,
            oauth_signature_method: "HMAC-SHA1",
            oauth_timestamp: timestamp,
            oauth_nonce: nonce,
            category_filter: 'bars',
            location: location
            };
            
        var consumerSecret = Auth.yelp.consumer_secret; //Consumer Secret
        var tokenSecret = Auth.yelp.token_secret; //Token Secret
        var signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, { encodeSignature: false});
            params['oauth_signature'] = signature;
        
        request
            .get(url)
            .use(jsonp)
            .query(
                    params
                )
            .withCredentials()
            .end(function(err, data){
                if (err) {
                    res.json({error: 'invalid search'})
                }
                else {
                    var result = JSON.parse(data.text);
                    var locations = result.businesses;
                    
                    locations.forEach(function(location){
                        locationArray.push({
                            id: location.id,
                            name: location.name,
                            snippet_text: location.snippet_text,
                            rating_img_url: location.rating_img_url,
                            attending: 0
                        })
                    })
                    
                    var counter = 0;
                    
                    locationArray.forEach(function(location){
                        
                        Location.findOne({yelpId : location.id}, function(err, doc){
                            if (doc) {
                                counter++
                                location.attending = doc.attending;
                            }
                            else {
                                counter++
                            }
                            if (counter === locationArray.length) {
                                res.json({locations: locationArray});
                            }
                        })

                    })

                }
            })
})

return router;
}

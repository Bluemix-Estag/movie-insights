/**
 * MIT License
 *
 * Copyright (c) 2016 Rafael Moris
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

var express		= require('express'),
	app			= express(),
	request		= require('request'),
	cheerio		= require('cheerio'),
	watson      = require('watson-developer-cloud'),
	extend      = require('util')._extend,
	i18n        = require('i18next');


//i18n settings
require('./config/i18n')(app);

//Bootstrap application settings
require('./config/express')(app);

//Create the service wrapper
var personalityInsights = watson.personality_insights({
  version: 'v2',
  username: '<username>',
  password: '<password>'
});


/* API SCRAPING */
var hostOriginUrl = "http://www.allmovie.com";

function jsonOutput(response, object) {
	response.writeHead(200, {"Content-Type": "application/json"});
    
    var content = JSON.stringify(object);
    response.end(content);
}

app.get("/api/loadMovieDetails", function (req, res) {
	var url = req.query.url;
	
	request(url, function (error, response, body) {
	    if (!error && response.statusCode === 200) {
	    	var $ = cheerio.load(body, {
	    	    normalizeWhitespace: true
	    	});
		    
	    	var title = $(".movie-title").text().trim();
	    	var year = $(".release-year").text().trim().match(/\d+/g).join([]);
		    var synopsis = $(".synopsis .text").first().text().trim();
		    
		    var movie = {
		    		"name":title,
		    		"year":year,
		    		"synopsis":synopsis
		    };
		    
		    console.log("### SYNOPSIS ###");
		    console.log(movie);
		    
		    jsonOutput(res, movie);
	    }
	});
});

app.get("/api/loadGenresMovies", function (req, res) {
	var url = req.query.url;
	
	request(url, function (error, response, body) {
	    if (!error && response.statusCode === 200) {
	    	var $ = cheerio.load(body);
		    
		    var movies = {"results":[]};
		    
		    $(".movie-highlights .movie").each(function(){
		    	var html = $(this);
		    	
		    	var title = html.find(".title a").first();
		    	var image = html.find(".img-link div img").first();
		    	
		    	var movie = {
		    			"name": title.text(),
		    			"url": hostOriginUrl + title.attr("href"),
		    			"image": image.attr("data-original")
		    	};
		    	movies.results.push(movie);
			});
		    
		    console.log("### MOVIES ###");
		    console.log(movies);
		    
		    jsonOutput(res, movies);
	    }
	});
});

app.get("/api/loadAllGenres", function (req, res) {
	var url = req.query.url;
	
	request(url, function (error, response, body) {
	    if (!error && response.statusCode === 200) {
			var $ = cheerio.load(body);
		    
		    var genres = {"results":[]};
		    
		    $(".genres a.genre-image").each(function(){
		    	var html = $(this);
		    	
		    	var genre = {
		    			"name": html.attr("alt"),
		    			"url": html.attr("href"),
		    			"image": hostOriginUrl + html.children("img").attr("src")
		    	};
		    	genres.results.push(genre);
			});
		    
		    console.log("### GENRES ###");
		    console.log(genres);
		    
		    jsonOutput(res, genres);
	    }
	});
});


app.get('/', function(req, res) {
  res.render('index', { ct: req._csrfToken });
});

app.post('/api/profile', function(req, res, next) {
  var parameters = extend(req.body, { acceptLanguage : i18n.lng() });

  personalityInsights.profile(parameters, function(err, profile) {
    if (err) {
    	return next(err);
    }else {
    	return res.json(profile);
    }
  });
});

// error-handler settings
require('./config/error-handler')(app);

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);
console.log('listening at:', port);
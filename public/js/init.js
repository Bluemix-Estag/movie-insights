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

$(document).ready(function() {
	var language = 'en'; // language selection
	
	// Jquery variables
	var $containerGenres = $('.container-genres'),
		$loadingGenres = $('.loading-genres'),
		$titleGenres = $('.title-genres'),
		$listGenres = $('.list-genres'),
		$containerMovies = $('.container-movies'),
		$loadingMovies = $('.loading-movies'),
		$titleMovies = $('.title-movies'),
		$listMovies = $('.list-movies'),
		$containerSynopsis = $('.container-synopsis'),
		$contentSynopsis = $('.content-synopsis'),
		$loadingSynopsis = $('.loading-synopsis'),
		$titleSynopsis = $('.title-synopsis'),
		$textSynopsis = $('.text-synopsis');
	
	var $error		= $('.error'),
		$errorMsg	= $('.errorMsg'),
		$traits		= $('.traits'),
		$captcha	= $('.captcha');
	
	$containerGenres.show();
	$loadingGenres.show();
	$titleGenres.hide();
	$listGenres.hide();
	
	$containerMovies.hide();
	$loadingMovies.hide();
	$titleMovies.hide();
	$listMovies.hide();
	
	$containerSynopsis.hide();
	$contentSynopsis.hide();
	$loadingSynopsis.hide();
	$titleSynopsis.hide();
	$textSynopsis.hide();
	
	$error.hide();
	$errorMsg.hide();
	$traits.hide();
	$captcha.hide();
	
	// URLS	  
	var hostOriginUrl = "http://www.allmovie.com";
	var allGenresUrl = "/api/loadAllGenres?url=" + hostOriginUrl + "/genres";
	var genresMoviesPrefixUrl = "/api/loadGenresMovies?url=";
	var movieDetailsPrefixUrl = "/api/loadMovieDetails?url=";
	
	/**
	 * Display an error or a default message
	 * @param  {String} error The error
	 */
	function showError(error) {
		var defaultErrorMsg = 'Error processing the request, please try again later.';
		$error.show();
		$errorMsg.show();
		$errorMsg.text(error || defaultErrorMsg);
	}
	
	/**
	 * Returns a 'flattened' version of the traits tree, to display it as a list
	 * @return array of {id:string, title:boolean, value:string} objects
	 */
	function flatten( /*object*/ tree) {
		var arr = [],
		f = function(t, level) {
	        if (!t) {
	        	return;
        	}
	        if (level > 0 && (!t.children || level !== 2)) {
	        	arr.push({
	        		'id': t.name,
	        		'title': t.children ? true : false,
    				'value': (typeof (t.percentage) !== 'undefined') ? Math.floor(t.percentage * 100) + '%' : '',
					'sampling_error': (typeof (t.sampling_error) !== 'undefined') ? Math.floor(t.sampling_error * 100) + '%' : ''
	        	});
	        }
	        if (t.children && t.id !== 'sbh') {
	        	for (var i = 0; i < t.children.length; i++) {
	        		f(t.children[i], level + 1);
        		}
        	}
        };
	    f(tree, 0);
	    return arr;
	}
	
	/**
	 * Displays the traits received from the
	 * Personality Insights API in a table,
	 * just trait names and values.
	 */
	function showTraits(data) {
		console.log('showTraits()');
	    $traits.show();

	    var traitList = flatten(data.tree),
	    	table = $traits;

	    table.empty();

	    // Header
	    $('#header-template').clone().appendTo(table);

	    // For each trait
	    for (var i = 0; i < traitList.length; i++) {
	      var elem = traitList[i];

	      var Klass = 'row';
	      Klass += (elem.title) ? ' model_title' : ' model_trait';
	      Klass += (elem.value === '') ? ' model_name' : '';

	      if (elem.value !== '') { // Trait child name
	        $('#trait-template').clone()
	          .attr('class', Klass)
	          .find('.tname')
	          .find('span').html(elem.id).end()
	          .end()
	          .find('.tvalue')
	            .find('span').html(elem.value === '' ?  '' : elem.value)
	            .end()
	          .end()
	          .appendTo(table);
	      } else {
	        // Model name
	        $('#model-template').clone()
	          .attr('class', Klass)
	          .find('.col-lg-12')
	          .find('span').html(elem.id).end()
	          .end()
	          .appendTo(table);
	      }
	    }
	  }
	  
	/**
	 * Buscar detalhes do filme selecionado.
	 */
	function loadMovieDetails(url) {
		// check if the captcha is active and the user complete it
	    var recaptcha = grecaptcha.getResponse();

	    // reset the captcha
	    grecaptcha.reset();

	    if (($captcha.css('display') === 'table' && recaptcha === '')) {
	    	return;
	    }
		
	    url = movieDetailsPrefixUrl + url;
	    
	    $containerSynopsis.show();
		$contentSynopsis.hide();
		$loadingSynopsis.show();
		$titleSynopsis.hide();
		$textSynopsis.hide();
		
		$error.hide();
		$errorMsg.hide();
		$traits.hide();
		$captcha.hide();
		
		$("html, body").animate({ scrollTop: $loadingSynopsis.offset().top }, 1000);
		
		$.getJSON(url, function(result){
			$.ajax({
				headers:{
			        'csrf-token': $('meta[name="ct"]').attr('content')
			    },
			    type: 'POST',
			    data: {
			    	recaptcha: recaptcha,
			        text: result.synopsis,
			        language: language
		        },
		        url: '/api/profile',
		        dataType: 'json',
		        success: function(response) {
		        	$titleSynopsis.html(result.name);
					$textSynopsis.html(result.synopsis);
					
					$loadingSynopsis.hide();

			        if (response.error) {
			          showError(response.error);
			        }else {
			        	$contentSynopsis.show();
						$titleSynopsis.show();
						$textSynopsis.show();
						$("html, body").animate({ scrollTop: $containerSynopsis.offset().top }, 1000);
			          
						showTraits(response);
			        }
			      },error: function(xhr) {
			    	  $loadingSynopsis.hide();
			    	  
			    	  var error;
			    	  try {
			    		  error = JSON.parse(xhr.responseText || {});
		    		  }catch(e) {}

				      if (xhr && xhr.status === 429){
				    	  $captcha.css('display','table');
				          $('.errorMsg').css('color','black');
				          error.error = 'Complete the captcha to proceed';
			          }else {
			        	  $('.errorMsg').css('color','red');
		        	  }
				      showError(error ? (error.error || error): '');
			      }
			});
		});
	}
	
	/**
	 * Buscar todos os filmes em destaque do
	 * gênero selecionado.
	 */
	function loadGenresMovies(url) {
		url = genresMoviesPrefixUrl + url;
		
		$containerMovies.show();
		$loadingMovies.show();
		$titleMovies.hide();
		$listMovies.hide();
		
		$containerSynopsis.hide();
		$contentSynopsis.hide();
		$loadingSynopsis.hide();
		$titleSynopsis.hide();
		$textSynopsis.hide();
		
		$error.hide();
		$errorMsg.hide();
		$traits.hide();
		$captcha.hide();
		
		$("html, body").animate({ scrollTop: $loadingMovies.offset().top }, 1000);
		
		var html = '';
		$.getJSON(url, function(result){
			html += '<ul class="row">';
			$.each(result.results, function(index, target) {
				html += '<li class="item-movie col-lg-3 col-md-4 col-xs-12" data-url="' + target.url + '">';
				
				html += '<figure>';
				if (target.image) {
					html += '<img src="' + target.image +  '" />';
				}else {
					html += '<img src="images/placeholder_movie.png" />';
				}
				html += '<figcaption>' + target.name + '</figcaption>';
				html += '</figure>';
				
				html += "</li>";
			});
			html += "</ul>";
			
			$listMovies.html(html);
			
			$(".item-movie").click(function(){
				var url = $(this).attr("data-url");
				loadMovieDetails(url);
			})
			
			$loadingMovies.hide();
			$titleMovies.show();
			$listMovies.show();
			$("html, body").animate({ scrollTop: $titleMovies.offset().top }, 1000);
		});
	}
	
	/**
	 * Buscar todos os gêneros de filmes disponîveis.
	 */
	function loadAllGenres() {
		var html = '';
		$.getJSON(allGenresUrl, function(result){
			html += '<ul class="row">';
			$.each(result.results, function(index, target) {
				html += '<li class="item-genre col-lg-4 col-md-12 col-xs-12" data-url="' + target.url + '">';
				
				html += '<figure>';
				if (target.image) {
					html += '<img src="' + target.image +  '" />';
				}else {
					html += '<img src="images/placeholder_movie.png" />';
				}
				
				html += '<figcaption>' + target.name + '</figcaption>';
				html += '</figure>';
				
				html += "</li>";
			});
			html += "</ul>";
			
			$listGenres.html(html);
			
			$(".item-genre").click(function(){
				var url = $(this).attr("data-url");
				loadGenresMovies(url);
			});
			
			$loadingGenres.hide();
			$titleGenres.show();
			$listGenres.show();
		});
	}
	
	loadAllGenres();
});
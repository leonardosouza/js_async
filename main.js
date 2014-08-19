$(function() {

	var asyncOp = function() {
		var deferred = $.Deferred();

		setTimeout(function() {
			//deferred.resolve('done');
			deferred.reject('error');
		}, 1000);

		return deferred.promise();
	};

	var asyncOpTest = function() {
		asyncOp()
			.done(function(result) { 
				console.log(result);
			})
			.fail(function(error) {
				console.log(error);
			})
	};

	//asyncOpTest.call();


	var asyncSum = function(timeout) {
		var deferred = $.Deferred();

		if(timeout > 3) {
			deferred.reject('larger than 3');
		}

		setTimeout(function() {
			deferred.resolve(timeout);
		}, 1000);

		return deferred.promise();
	}

	var asyncSumTest = function() {
		asyncSum(1)
			.then(function(result) {
				return asyncSum(result + 1);
			})
			.then(function(result) {
				return asyncSum(result + 1);
			})
			.then(function(result) {
				return asyncSum(result + 1);
			})
			.done(function(result) {
				console.log('waited', result, 'times');
			})
			.fail(function(error) {
				console.log(error);
			})
	};

	// asyncSumTest.call();


	var asyncProgress = function() {
		var deferred = $.Deferred();

		var i = 0;
		setInterval(function() {
			i += 1;
			deferred.notify(i);
			if(i == 100) {
				deferred.resolve(i);
			}
		}, 100);

		return deferred.promise();
	};

	var asyncProgressTest = function() {
		asyncProgress()
			.progress(function(progress) {
				$('h1').text(progress + '%');
			})
			.done(function() {
				$('h1').css('color', 'green');
			})

	};

	// asyncProgressTest.call();


	var loadScripts = function() {
		var d1 = $.getScript('/js/dummy1.js');
		var d2 = $.getScript('/js/dummy2.js');
		var d3 = $.getScript('/js/dummy3.js');

		$.when(d1, d2, d3)
			.done(function(dummy1, dummy2, dummy3) {
				console.log('scripts done');
			})
			.fail(function(error) {
				console.log('scripts failed');
			});
	}

	// loadScripts.call();

	var twitter = function(query) {
		return $.get('/twitter-proxy.php?url=' + query);
	};

	var twitterTest = function() {
		$('form').submit(function(e) {
			e.preventDefault();

			$('.btn').attr('disabled', 'disabled');
			$('#results').empty().html('<p>Carregando...</p>');

			var encodedQuery = encodeURIComponent('statuses/user_timeline.json?screen_name='+$('#searchTxt').val()+'&count=200');

			twitter(encodedQuery)
				.then(function(tweets) {
					tweets.forEach(function(tweet) {
						$('#results').append('<p>' + tweet.text + '</p>');
					})
				})
				.done(function() {
					$('#results p:first').remove();
					$('.btn').removeAttr('disabled');
				})
				.fail(function() {
					$('#results').html('<p class="error">Ocorreu um erro</p>')
				})
		})
	};

	twitterTest.call();





});
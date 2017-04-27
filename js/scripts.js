$(function() {
	var url = 'https://restcountries.eu/rest/v1/name/',
		carouselList = $('#carousel ul'),
		carouselLi = carouselList.children(),
		z=0,
		x,
		n,
		respLen;

	$("#search").on('click', searchCountries);

	$('input[type=text]').on('keydown', function(e) {
	    if (e.which == 13) {
	        searchCountries();
	    };
	});

	$('input[type=text]').on('mousedown', function(e) {
		$(this).val('');
	});

	function searchCountries() {
		var countryName = $("#country-name").val();
		if(!countryName.length) {
			countryName = 'Poland';
		};

		$.ajax({
			url: url + countryName,
			method: 'GET',
			success: showCountriesList,
			error: showError
		});
	};

	function showError() {
		carouselList.empty();
		carouselList.css("width", "500px");
		$('.control-right').remove();
		$('.control-left').remove();
		var str = 'Nothing found. Try again.';
			warning = $('<h3>').addClass('warning').text(str);
		carouselList.append(warning);
	}

	//for displaying array rensponse 
	function showTableItems(tableItem) {
		var x = '';

		for (i = 0; i < tableItem.length; i++) {
			if (i == tableItem.length-1) {
				x += tableItem[i];	
			}
			else {
				x += tableItem[i] + ', ';
			}
		}

		return x;
	}

	function showCountriesList(resp) {
		var i=0; //countries counters

		carouselList.empty();
		$('.control-right').remove();
		$('.control-left').remove();
		respLen = resp.length;

		resp.forEach(function(item){
			var country = $('<li>').addClass('country'),
				searchTitle = $('<p>').addClass('search-results'),
				name = $('<h3>').text(item.name),
				countryData = $('<div>').addClass('country-data'),
				capitalRow = $('<div>').addClass('country-data-row').append($('<i>').addClass('fa fa-building')) ,
				capitalTitle = $('<span>').addClass('country-data-title').text('Capital: '),
				capital = $('<span>').text(item.capital),
				currencyRow = $('<div>').addClass('country-data-row').append($('<i>').addClass('fa fa-money')),
				currencyTitle = $('<span>').addClass('country-data-title').text('Currency: '),
				currency = $('<span>').text(showTableItems(item.currencies)),
				languageRow = $('<div>').addClass('country-data-row').append($('<i>').addClass('fa fa-language')),
				languageTitle = $('<span>').addClass('country-data-title').text('Languages: '),
				language = $('<span>').text(showTableItems(item.languages));
			
			i++;

			capitalRow.append(capitalTitle).append(capital);
			currencyRow.append(currencyTitle).append(currency);
			languageRow.append(languageTitle).append(language);

			countryData.append(capitalRow).append(currencyRow).append(languageRow);

			searchTitle.text('Search results: ' + i + ' / ' + resp.length)
			
			country.append(searchTitle)
				.append(name)
				.append(countryData);	

			carouselList.append(country);		
		});

		var listWidth = respLen*500 + 'px';
		carouselList.css("width", listWidth);

		if (respLen > 1) {
			var controlRight = $('<button>').addClass('control control-right').append($('<i>').addClass('fa fa-chevron-right')),
				controlLeft = $('<button>').addClass('control control-left').append($('<i>').addClass('fa fa-chevron-left'));

			$('#carousel').append(controlLeft).append(controlRight);

			$('.control-right').on('click', function() {
					changeNSlidesNext(1);
					z++;
				});

			$('.control-left').on('click', function() {
				z--;
				changeNSlidesPrev(1);
			});

			setControlsAttr();
		};
	};

	//carousel functions

	function changeSlide(x) {
		carouselList.animate({opacity: 0}, 400, function() {
			carouselList.css({marginLeft: x + "px"}).animate({opacity: 1}, 400);
			setControlsAttr();
		});
	}

	function changeNSlidesNext(n) {
		var x = -500 * (n+z) ; 
		changeSlide(x);
	};

	function changeNSlidesPrev(n) {
		var x = -500 * (n+z-1); 
		changeSlide(x);
	};

	function setControlsAttr() {
		if (z == 0) {
			$('.control-left').attr('disabled', true);
			$('.control-right').attr('disabled', false);
		}
		else if (z+1 == respLen) {
			$('.control-right').attr('disabled', true);
			$('.control-left').attr('disabled', false);
		}
		else {
			$('.control-left').attr('disabled', false);
			$('.control-right').attr('disabled', false);
		};
	};
})
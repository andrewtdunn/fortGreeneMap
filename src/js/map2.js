/**
 * represents a Location
 */
var Location = function(data){
	this.icon = data.icon;
	this.position = ko.observable(data.position);
	this.menuLabel = ko.observable(data.menuLabel);
	this.label = ko.observable(data.label);
	this.locationType = ko.observable(data.locationType);
	this.id = ko.observable(data.id);
	this.pageID = ko.observable(data.pageID);
	if (data.businessId != undefined){
		this.businessId = ko.observable(data.businessId);
	}
	this.imageUrl = ko.observable();
	this.rating = ko.observable();
	this.snippet = ko.observable();
	this.snippetImageUrl = ko.observable();
	this.crossStreets = ko.observable();
	this.address = ko.observable();
	this.displayPhone = ko.observable();
	this.reviewer = ko.observable();
	this.numReviews = ko.observable();
	this.url = ko.observable();
	this.extract = ko.observable();
	this.pageThumb = ko.observable();
	this.wikiLink = ko.observable();

};

/**
 * Represents a map model
 */
var MapModel = function(){

	var self = this;

	this.EXTRACT_WORDS_LENGTH = 150;

	this.filterTypes = [ 'show all', 'food', 'school', 'rec' ];

	this.locList = ko.observableArray([]);

	/** puts data object into locList array */
	this.addLocations = function(){
		mapLocations.forEach(function(locItem){
			self.locList.push(new Location(locItem));
		});
	};

	/** removes all elements from locList and repopulates locList */
	this.reset = function(){
		self.locList.removeAll();
		self.addLocations();
		showAllMarkers();
	};

	this.addLocations();

	/** when marker is click, location is found in locList */
	this.setLocationByID=function(id){
		//console.log("finding loc " + id);
		var locs = this.locList();
		for (var i=0; i < locs.length; i++){
			//console.log(locs[i].id());
			if (id == locs[i].id()){
				self.setLoc(locs[i], false);
			}
		}

	};



	this.currentLoc = ko.observable();

	/** used to generate oAuth token */
	this.nonce_generate = function(){
		return (Math.floor(Math.random() * 1e12).toString());
	};

	/** used to generate oAuth token */
	this.native2ascii=function(str) {
		var out = '';
		for (var i = 0; i < str.length; i++) {
			if (str.charCodeAt(i) < 0x80) {
				out += str.charAt(i);
			} else {
				var u = '' + str.charCodeAt(i).toString(16);
				out += '\\u' + (u.length === 2 ? '00' + u : u.length === 3 ? '0' + u : u);
			}
		}
		return out;
	};

	/** counts words in string */
	this.countWords = function(str) {
		return str.split(/\s+/).length;
	};

	/** queries wikipedia url */
	this.getWikipediaInfo = function(clickedLoc){
		//console.log(clickedLoc.label());
		var location = clickedLoc.label();
		var pageID = clickedLoc.pageID();
		var wikiUrl = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&pageids='+ pageID +'&callback=?';
		//console.log(pageID);
		//console.log(wikiUrl);


		$.ajax({
			url: wikiUrl,
			dataType: 'jsonp'

		}).done( function(data){
			var pages = data.query.pages;
			//console.log('pageID:  ' + pageID);
			//console.log(pages);

			var extract = pages[pageID].extract;
			if (self.countWords(extract) > self.EXTRACT_WORDS_LENGTH){
				extract= extract.replace(/\s+/g,' ').split(/(?=\s)/gi).slice(0, self.EXTRACT_WORDS_LENGTH).join('') + ' .....';
			}
			self.currentLoc().extract(extract);
			self.currentLoc().wikiLink('https://en.wikipedia.org/?curid=' + pageID);


		}).fail(function(qHXR, textStatus){
			//console.log('wiki image fail');
			self.errorHandler('wikipedia');

		});

		var wikiImagesUrl  = 'http://en.wikipedia.org/w/api.php?action=query&titles='+ location +'&prop=pageimages&format=json&pithumbsize=100&callback=?';

		$.ajax({
			// ajax settings
			url: wikiImagesUrl,
			dataType: 'jsonp'
		}).done( function(data){
			var pages = data.query.pages;
			for (var page in pages){
				//console.log(pages[page].thumbnail);
				self.currentLoc().pageThumb(pages[page].thumbnail.source);
			}

		}).fail(function(jqHXR, textStatus){
			//console.log('wiki image fail');
			self.errorHandler('wikipedia image');
		});

	};

	/** queries yelp url */
	this.getYelpInfo = function(clickedLoc){

		var CONSUMER_KEY = 'B5S_y-SVAjGX29dG7vpzpA';
		var CONSUMER_SECRET = '6FpVs_YM8LIRUqFqWxzZw7TynrI';
		var TOKEN = 'risEctsNsFtfaLY4PSPGlVzm4Cize-yz';
		var TOKEN_SECRET = '6Xu4jCQ5iLkLj884o0ErpoP853M';

		//console.log('getYelpInfo');
		var self = this;

		var yelpUrl = 'https://api.yelp.com/v2/business/' + clickedLoc.businessId();

		var parameters = {
			oauth_consumer_key: CONSUMER_KEY,
			oauth_token: TOKEN,
			oauth_nonce: this.nonce_generate(),
			oauth_timestamp: Math.floor(Date.now()/1000),
			oauth_signature_method: 'HMAC-SHA1',
			oauth_version: '1.0',
			callback: 'cb'
		};

		var encodedSignature = oauthSignature.generate('GET', yelpUrl, parameters, CONSUMER_SECRET, TOKEN_SECRET);
		parameters.oauth_signature = encodedSignature;

		var starRatings = [
			'\u2606\u2606\u2606\u2606\u2606',
			'\u2605\u2606\u2606\u2606\u2606',
			'\u2605\u2605\u2606\u2606\u2606',
			'\u2605\u2605\u2605\u2606\u2606',
			'\u2605\u2605\u2605\u2605\u2606',
			'\u2605\u2605\u2605\u2605\u2605'

		];


		$.ajax({
			url: yelpUrl,
			data: parameters,
			cache: true,
			dataType: 'jsonp'
		})
		.done(function(data){
			console.dir(data);
			self.currentLoc().imageUrl(data.image_url);
			self.currentLoc().rating(starRatings[Math.floor(data.rating)]);
			self.currentLoc().snippet(data.snippet_text);
			if (data.location.cross_streets){
				self.currentLoc().crossStreets(' b/w ' + data.location.cross_streets);
			}
			self.currentLoc().snippetImageUrl(data.snippet_image_url);
			self.currentLoc().address(data.location.address[0]);
			self.currentLoc().displayPhone(data.display_phone);
			self.currentLoc().reviewer(data.reviews[0].user.name);
			self.currentLoc().numReviews(data.review_count);
			self.currentLoc().url(data.url);
			$('#aside__map').fadeIn();
		}).fail(function(jqHXR, textStatus){
			self.errorHandler('yelp');
		});



	};

	/** set current map location */
	this.setLoc = function(clickedLoc, relocateMap){
		// don't open the same location twice
		if ((typeof self.currentLoc() !== 'undefined') && self.currentLoc().id() === clickedLoc.id()){
			// but if zoomed in and the detail panel is closed, open it
			$('#aside__map').show();
			return;
		}
		relocate = (typeof relocateMap === 'undefined') ? false : true;
		console.log('relocate? ' + relocateMap);
		console.dir(clickedLoc);
		$('#aside__map').hide();
		self.currentLoc(clickedLoc);
		setCurrentMarker(clickedLoc.id(), relocateMap);

		// if restaurant - get yelp reviews
		if (clickedLoc.locationType() === 'food'){
			self.getYelpInfo(clickedLoc);

		}else{
			$('#aside__map').fadeIn();
			self.getWikipediaInfo(clickedLoc);
		}

		$('#nav__map').removeClass('nav__map--open');

	};

	/** filters locLost and type */
	this.filterLocations = function(data,event){
		var target = event.target || event.srcElement;
		var locationType = target.options[target.selectedIndex].value;
		self.reset();
		if (locationType == 'show all'){
			map.setZoom(NORMAL_ZOOM_DISTANCE);
			return;
		}
		self.locList.remove(function(item){
			return item.locationType() != locationType;
		});

		filterMarkers(locationType);
	};

	/** opens and closes nav*/
	this.toggleMenuOpen = function(data, event){
		$('#nav__map').toggleClass('nav__map--open');
		$('#aside__map').fadeOut();
		event.stopPropagation();
	};

	/** raises and lowers map detail */
	this.toggleDetailOpen = function(data, event){
		$('#aside__detail').toggleClass('aside__detail--expanded');
		event.stopPropagation();
	};

	/** publishes api error message */
	this.errorHandler = function(api){
		window.alert(api + ' api is not loading');
	};

	/** links to external yelp page */
	this.showYelpPage = function(data, event){
		console.log('showReviews');
		window.open(data.url(), '_blank');
		event.stopPropagation();
	};

	/** links to external wiki page */
	this.showWikiPage = function(data, event){
		console.log('showReviews');
		window.open(data.wikiLink(), '_blank');
		event.stopPropagation();
	};

};

var mapModel = new MapModel();





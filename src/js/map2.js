var Location = function(data){

    this.icon = ko.observable(data.icon);
    this.position = ko.observable(data.position);
    this.menuLabel = ko.observable(data.menuLabel);
    this.label = ko.observable(data.label);
    this.locationType = ko.observable(data.locationType);
    this.id = ko.observable(data.id);
    //console.log (data.businessId);
    if (data.businessId != undefined){
        this.businessId = ko.observable(data.businessId);
    }
    this.image_url = ko.observable();
    this.rating = ko.observable();
    this.snippet = ko.observable();
    this.snippet_image_url = ko.observable();
    this.cross_streets = ko.observable();
    this.address = ko.observable();
    this.display_phone = ko.observable();
    this.reviewer = ko.observable();
    this.numReviews = ko.observable();
    this.url = ko.observable();
    this.extract = ko.observable();
    this.page_thumb = ko.observable();
    this.wiki_link = ko.observable();
};


var ViewModel = function(){

    var self = this;

    this.locList = ko.observableArray([]);

    this.addLocations = function(){
        mapLocations.forEach(function(locItem){
            self.locList.push(new Location(locItem));
        });
    }

    this.reset = function(){
        self.locList.removeAll();
        self.addLocations();
        showAllMarkers();
    }

    this.addLocations();

    this.setLocationByID=function(id){
        //console.log("finding loc " + id);
        var locs = this.locList()
        for (var i=0; i < locs.length; i++){
            //console.log(locs[i].id());
            if (id == locs[i].id()){
                self.setLoc(locs[i], false);
            }
        }

    }



    this.currentLoc = ko.observable(self.locList()[0]);
    //console.log("- - - - ");
    //console.log(this.currentLoc());

    this.nonce_generate = function(){
        return (Math.floor(Math.random() * 1e12).toString());
    };

    this.native2ascii=function(str) {
        var out = "";
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) < 0x80) {
                out += str.charAt(i);
            } else {
                var u = "" + str.charCodeAt(i).toString(16);
                out += "\\u" + (u.length === 2 ? "00" + u : u.length === 3 ? "0" + u : u);
            }
        }
        return out;
    };

    this.countWords = function(str) {
        return str.split(/\s+/).length;
    };

    this.getWikipediaInfo = function(clickedLoc){
        //console.log(clickedLoc.label());
        var location = clickedLoc.label();
        var wikiUrl = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles="+ location +"&callback=?";


        $.ajax({
            url: wikiUrl,
            dataType: 'jsonp',
            success: function(response){
                //console.log(response);
                var pages = response.query.pages;
                for (var page in pages){
                    //console.log(pages[page].extract);
                    var extract = pages[page].extract;
                    if (self.countWords(extract) > 150){
                        extract= extract.replace(/\s+/g," ").split(/(?=\s)/gi).slice(0, 150).join('') + " ...";
                    }
                    self.currentLoc().extract(extract);
                    //console.log("https://en.wikipedia.org/?curid=" + page);
                    self.currentLoc().wiki_link("https://en.wikipedia.org/?curid=" + page);
                }
            }
        });

        var wikiImagesUrl  = "http://en.wikipedia.org/w/api.php?action=query&titles="+ location +"&prop=pageimages&format=json&pithumbsize=100&callback=?";

        $.ajax({
            url: wikiImagesUrl,
            dataType: 'jsonp',
            success: function(response){
                //console.log(response);
                var pages = response.query.pages;
                for (var page in pages){
                    //console.log(pages[page].thumbnail);
                    self.currentLoc().page_thumb(pages[page].thumbnail.source);
                }
            }
        });

    };


    this.getYelpInfo = function(clickedLoc){

        var CONSUMER_KEY = 'B5S_y-SVAjGX29dG7vpzpA';
        var CONSUMER_SECRET = '6FpVs_YM8LIRUqFqWxzZw7TynrI';
        var TOKEN = 'risEctsNsFtfaLY4PSPGlVzm4Cize-yz';
        var TOKEN_SECRET = '6Xu4jCQ5iLkLj884o0ErpoP853M';

        //console.log('getYelpInfo');
        var self = this;

        var yelpUrl = "https://api.yelp.com/v2/business/" + clickedLoc.businessId();

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

        var settings = {
            url: yelpUrl,
            data: parameters,
            cache: true,
            dataType: 'jsonp',
            success: function(results){
                console.dir(results);
                self.currentLoc().image_url(results.image_url);
                self.currentLoc().rating(starRatings[Math.floor(results.rating)]);
                self.currentLoc().snippet(results.snippet_text);
                if (results.location.cross_streets){
                    self.currentLoc().cross_streets(' b/w ' + results.location.cross_streets);
                }
                self.currentLoc().snippet_image_url(results.snippet_image_url);
                self.currentLoc().address(results.location.address[0]);
                self.currentLoc().display_phone(results.display_phone);
                self.currentLoc().reviewer(results.reviews[0].user.name);
                self.currentLoc().numReviews(results.review_count);
                self.currentLoc().url(results.url);
                $('#over_map_detail').fadeIn();
            },
            error: function(e){
                //console.log(e);
            }

        };

        $.ajax(settings);



    }

    this.setLoc = function(clickedLoc, relocateMap){
        //console.log("relocateMap: " + relocateMap);
        relocate = (typeof relocateMap === 'undefined') ? false : true;
        console.dir(clickedLoc);
        $('#over_map_detail').hide();
        self.currentLoc(clickedLoc);
        //console.log("relocate? : " + relocate );
        setCurrentMarker(clickedLoc.id(), relocateMap);
        //moveMap(clickedLoc.position());

        // if restaurant - get yelp reviews
        //console.log(clickedLoc.locationType());


        if (clickedLoc.locationType() === "food"){
            // get yelp reviews
            //console.log("yelp: " + clickedLoc.businessId());
            self.getYelpInfo(clickedLoc);

        }else{
            $('#over_map_detail').fadeIn();
            self.getWikipediaInfo(clickedLoc);
        }

        // add expandListener
        var detailInner = document.querySelector('#inner_detail');
        var expandDetailButton = document.querySelector('#expandDetailButton');
        var collapseDetailButton = document.querySelector('#collapseDetailButton');
        var over_map = document.querySelector("#over_map");
        expandDetailButton.addEventListener('click', function() {
            //console.log("expand");
            detailInner.classList.add('expanded');
        });
        collapseDetailButton.addEventListener('click', function() {
            //console.log("expand");
            detailInner.classList.remove('expanded');
        });
        over_map.classList.remove('open');

    };

    this.filterRestaurants = function(){
        self.reset();
        self.locList.remove(function(item){
            return item.locationType() != "food";
        });

        filterMarkers("food");
    };

    this.filterSchools = function(){
        self.reset();
        self.locList.remove(function(item){
            return item.locationType() != "school";
        });

        filterMarkers("school");
    };

    this.filterRecreation = function(){
        //console.log("filterRecreation");
        self.reset();
        self.locList.remove(function(item){
            return item.locationType() != "rec";
        });

        filterMarkers("rec");
    };

}

var viewModel = new ViewModel();
ko.applyBindings(viewModel);


var menuButton = document.querySelector('#menuButton');
var main = document.querySelector('main');
var menu = document.querySelector('#over_map');
var collapseDetailButton = document.querySelector('#collapseDetailButton');



menuButton.addEventListener('click', function(e) {
    menu.classList.toggle('open');
    $('#over_map_detail').fadeOut();
    e.stopPropagation();
});

map.addEventListener('click', function() {
    menu.classList.remove('open');
});




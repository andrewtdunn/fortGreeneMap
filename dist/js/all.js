
var map,
    EasingAnimator = function (opt) {
    opt = opt || {};
    this.easingInterval = opt.easingInterval;
    this.duration = opt.duration || 1000;
    this.step = opt.step || 50;
    this.easingFn = opt.easingFn || function easeInOutElastic(t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    };
    this.callBack = opt.callBack || function () {};
};
EasingAnimator.makeFromCallback = function (callBack) {
    return new EasingAnimator({
        callBack: callBack
    });
};
EasingAnimator.prototype.easeProp = function (obj, propDict) {
    propDict = propDict || {};

    var self = this,
        t = 0,
        out_vals = JSON.parse(JSON.stringify(obj));

    clearInterval(self.easingInterval);
    self.easingInterval = setInterval(function () {
        t += self.step;
        if (t >= self.duration) {
            clearInterval(self.easingInterval);
            self.callBack(propDict);
            return;
        }
        var percent = self.easingFn(t, 0, 1, self.duration);
        Object.keys(propDict).forEach(function (key, i) {
            var old_val = obj[key];

            out_vals[key] = old_val - percent * (old_val - propDict[key]);
        });
        self.callBack(out_vals);
    }, self.step);
};

var center = { lat: 40.688885, lng: -73.977042 };

var mapLocations = [{
    id: 1,
    position: { lat: 40.689752, lng: -73.973224 },
    menuLabel: 'Ft. Greene Park',
    label: 'Fort Greene Park',
    icon: 'img/dog.png',
    locationType: 'rec'
}, {
    id: 2,
    position: { lat: 40.692940, lng: -73.972977 },
    menuLabel: 'Lulu & Po',
    label: 'Lulu & Po',
    icon: 'img/lulupo.png',
    locationType: 'food',
    businessId: 'lulu-and-po-brooklyn'
}, {
    id: 3,
    position: { lat: 40.689887, lng: -73.965081 },
    menuLabel: 'Pratt',
    label: 'Pratt Institute',
    icon: 'img/pratt.png',
    locationType: 'school'
}, {
    id: 4,
    position: { lat: 40.683154, lng: -73.976168 },
    menuLabel: 'Barclays Center',
    label: 'Barclays Center',
    icon: 'img/netsLogo.png',
    locationType: 'rec'
}, {
    id: 5,
    position: { lat: 40.686392, lng: -73.974368 },
    menuLabel: 'Cafe Habana',
    label: 'Cafe Habana',
    icon: 'img/habana.png',
    locationType: 'food',
    businessId: 'habana-outpost-brooklyn'
}, {
    id: 6,
    position: { lat: 40.690485, lng: -73.969433 },
    menuLabel: 'Graziella\'s',
    label: 'Graziella\'s',
    icon: 'img/graziellas.png',
    locationType: 'food',
    businessId: 'graziellas-brooklyn-11'
},
/*
{
    id: 7,
    position: {lat:40.689328, lng:-73.972565},
    label: 'Martha',
    icon: 'img/marthabk.png',
    locationType: 'food',
    businessId: 'martha-brooklyn-5'
},
*/
{
    id: 8,
    position: { lat: 40.690100, lng: -73.981686 },
    menuLabel: 'Junior\'s',
    label: 'Junior\'s',
    icon: 'img/juniors1.jpg',
    locationType: 'food',
    businessId: 'juniors-restaurant-brooklyn'
},
/*
{
    id: 9,
    position: {lat:40.689666, lng:-73.971073},
    label: 'Chez Oskar',
    icon: 'img/chezoskar.jpg',
    locationType: 'food',
    businessId: 'chez-oskar-brooklyn'
},
*/
{
    id: 9,
    position: { lat: 40.688645, lng: -73.976391 },
    menuLabel: 'Brooklyn Tech',
    label: 'Brooklyn Technical High School',
    icon: 'img/bths.png',
    locationType: 'school'
}, {
    id: 10,
    position: { lat: 40.686808, lng: -73.977584 },
    menuLabel: 'BAM',
    label: 'Brooklyn Academy of Music',
    icon: 'img/bam.png',
    locationType: 'rec'
}, {
    id: 11,
    position: { lat: 40.688815, lng: -73.969331 },
    menuLabel: 'ICI',
    label: 'ICI',
    icon: 'img/ici.png',
    locationType: 'food',
    businessId: 'ici-french-country-kitchen-brooklyn'
}, {
    id: 12,
    position: { lat: 40.690460, lng: -73.967966 },
    menuLabel: "St. Joseph\'s",
    label: "St. Joseph's College (New York)",
    icon: 'img/sjc.png',
    locationType: 'school'
}];

var mapMarkers = [];

function addAllMarkers() {
    console.log("adding markers");
    for (var i = 0, len = mapLocations.length; i < len; i++) {
        var loc = mapLocations[i];
        console.dir(loc);
        var marker = new google.maps.Marker({
            position: loc.position,
            map: map,
            icon: loc.icon,
            locationType: loc.locationType,
            id: loc.id
        });
        attachClickBehaviour(marker);
        mapMarkers.push(marker);
    };
}

function attachClickBehaviour(marker) {
    marker.addListener('click', function () {
        console.log(marker.id + " clicked");
        var currLoc = viewModel.setLocationByID(marker.id);
        console.log(viewModel);
    });
}

function initMap() {
    console.log('initMap');

    //var center = {lat: 40.688987, lng: -73.971061};

    map = new google.maps.Map(document.getElementById('google_map'), {
        center: center,
        zoom: 16,
        mapTypeId: 'satellite'
    });

    map.markers = [];
    addAllMarkers();
    easingAnimator = EasingAnimator.makeFromCallback(function (latLng) {
        map.setCenter(latLng);
    });
}

function showAllMarkers() {
    centerMap();
    for (var i = 0, len = mapMarkers.length; i < len; i++) {
        mapMarkers[i].setVisible(true);
    }
}

function moveMap(loc) {

    var point = map.getCenter();

    easingAnimator.easeProp({
        lat: point.lat(),
        lng: point.lng()
    }, { lat: loc.lat(), lng: loc.lng() });
}

function centerMap() {
    var point = map.getCenter();

    easingAnimator.easeProp({
        lat: point.lat(),
        lng: point.lng()
    }, center);
}

// iterate through array,
function filterMarkers(locationType) {
    console.log("filterMarkers");
    centerMap();
    for (var i = 0, len = mapMarkers.length; i < len; i++) {
        if (mapMarkers[i].locationType !== locationType) {
            mapMarkers[i].setVisible(false);
        } else {
            mapMarkers[i].setVisible(true);
        }
    }
}

function getCurrentMarker(locID) {
    for (var i = 0, len = mapMarkers.length; i < len; i++) {
        if (mapMarkers[i].id == locID) {
            return mapMarkers[i];
        }
    }
}

function setCurrentMarker(locID, relocate) {
    var currentMarker = getCurrentMarker(locID);
    console.log("relocate? : " + relocate);
    if (relocate) {
        map.setZoom(16);
        moveMap(currentMarker.position);
        setTimeout(function () {
            currentMarker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                currentMarker.setAnimation(null);map.setZoom(18);
            }, 750);
        }, 1500);
    } else {
        currentMarker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            currentMarker.setAnimation(null);
        }, 750);
    }
}
var Location = function (data) {

    this.icon = ko.observable(data.icon);
    this.position = ko.observable(data.position);
    this.menuLabel = ko.observable(data.menuLabel);
    this.label = ko.observable(data.label);
    this.locationType = ko.observable(data.locationType);
    this.id = ko.observable(data.id);
    //console.log (data.businessId);
    if (data.businessId != undefined) {
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

var ViewModel = function () {

    var self = this;

    this.locList = ko.observableArray([]);

    this.addLocations = function () {
        mapLocations.forEach(function (locItem) {
            self.locList.push(new Location(locItem));
        });
    };

    this.reset = function () {
        self.locList.removeAll();
        self.addLocations();
        showAllMarkers();
    };

    this.addLocations();

    this.setLocationByID = function (id) {
        //console.log("finding loc " + id);
        var locs = this.locList();
        for (var i = 0; i < locs.length; i++) {
            //console.log(locs[i].id());
            if (id == locs[i].id()) {
                self.setLoc(locs[i], false);
            }
        }
    };

    this.currentLoc = ko.observable(self.locList()[0]);
    //console.log("- - - - ");
    //console.log(this.currentLoc());

    this.nonce_generate = function () {
        return Math.floor(Math.random() * 1e12).toString();
    };

    this.native2ascii = function (str) {
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

    this.countWords = function (str) {
        return str.split(/\s+/).length;
    };

    this.getWikipediaInfo = function (clickedLoc) {
        //console.log(clickedLoc.label());
        var location = clickedLoc.label();
        var wikiUrl = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=" + location + "&callback=?";

        $.ajax({
            url: wikiUrl,
            dataType: 'jsonp',
            success: function (response) {
                //console.log(response);
                var pages = response.query.pages;
                for (var page in pages) {
                    //console.log(pages[page].extract);
                    var extract = pages[page].extract;
                    if (self.countWords(extract) > 150) {
                        extract = extract.replace(/\s+/g, " ").split(/(?=\s)/gi).slice(0, 150).join('') + " ...";
                    }
                    self.currentLoc().extract(extract);
                    //console.log("https://en.wikipedia.org/?curid=" + page);
                    self.currentLoc().wiki_link("https://en.wikipedia.org/?curid=" + page);
                }
            }
        });

        var wikiImagesUrl = "http://en.wikipedia.org/w/api.php?action=query&titles=" + location + "&prop=pageimages&format=json&pithumbsize=100&callback=?";

        $.ajax({
            url: wikiImagesUrl,
            dataType: 'jsonp',
            success: function (response) {
                //console.log(response);
                var pages = response.query.pages;
                for (var page in pages) {
                    //console.log(pages[page].thumbnail);
                    self.currentLoc().page_thumb(pages[page].thumbnail.source);
                }
            }
        });
    };

    this.getYelpInfo = function (clickedLoc) {

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
            oauth_timestamp: Math.floor(Date.now() / 1000),
            oauth_signature_method: 'HMAC-SHA1',
            oauth_version: '1.0',
            callback: 'cb'
        };

        var encodedSignature = oauthSignature.generate('GET', yelpUrl, parameters, CONSUMER_SECRET, TOKEN_SECRET);
        parameters.oauth_signature = encodedSignature;

        var starRatings = ['\u2606\u2606\u2606\u2606\u2606', '\u2605\u2606\u2606\u2606\u2606', '\u2605\u2605\u2606\u2606\u2606', '\u2605\u2605\u2605\u2606\u2606', '\u2605\u2605\u2605\u2605\u2606', '\u2605\u2605\u2605\u2605\u2605'];

        var settings = {
            url: yelpUrl,
            data: parameters,
            cache: true,
            dataType: 'jsonp',
            success: function (results) {
                console.dir(results);
                self.currentLoc().image_url(results.image_url);
                self.currentLoc().rating(starRatings[Math.floor(results.rating)]);
                self.currentLoc().snippet(results.snippet_text);
                if (results.location.cross_streets) {
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
            error: function (e) {
                //console.log(e);
            }

        };

        $.ajax(settings);
    };

    this.setLoc = function (clickedLoc, relocateMap) {
        //console.log("relocateMap: " + relocateMap);
        relocate = typeof relocateMap === 'undefined' ? false : true;
        console.dir(clickedLoc);
        $('#over_map_detail').hide();
        self.currentLoc(clickedLoc);
        //console.log("relocate? : " + relocate );
        setCurrentMarker(clickedLoc.id(), relocateMap);
        //moveMap(clickedLoc.position());

        // if restaurant - get yelp reviews
        //console.log(clickedLoc.locationType());

        if (clickedLoc.locationType() === "food") {
            // get yelp reviews
            //console.log("yelp: " + clickedLoc.businessId());
            self.getYelpInfo(clickedLoc);
        } else {
            $('#over_map_detail').fadeIn();
            self.getWikipediaInfo(clickedLoc);
        }

        // add expandListener
        var detailInner = document.querySelector('#inner_detail');
        var expandDetailButton = document.querySelector('#expandDetailButton');
        var collapseDetailButton = document.querySelector('#collapseDetailButton');
        var over_map = document.querySelector("#over_map");
        expandDetailButton.addEventListener('click', function () {
            //console.log("expand");
            detailInner.classList.add('expanded');
        });
        collapseDetailButton.addEventListener('click', function () {
            //console.log("expand");
            detailInner.classList.remove('expanded');
        });
        over_map.classList.remove('open');
    };

    this.filterRestaurants = function () {
        self.reset();
        self.locList.remove(function (item) {
            return item.locationType() != "food";
        });

        filterMarkers("food");
    };

    this.filterSchools = function () {
        self.reset();
        self.locList.remove(function (item) {
            return item.locationType() != "school";
        });

        filterMarkers("school");
    };

    this.filterRecreation = function () {
        //console.log("filterRecreation");
        self.reset();
        self.locList.remove(function (item) {
            return item.locationType() != "rec";
        });

        filterMarkers("rec");
    };
};

var viewModel = new ViewModel();
ko.applyBindings(viewModel);

var menuButton = document.querySelector('#menuButton');
var main = document.querySelector('main');
var menu = document.querySelector('#over_map');
var collapseDetailButton = document.querySelector('#collapseDetailButton');

menuButton.addEventListener('click', function (e) {
    menu.classList.toggle('open');
    $('#over_map_detail').fadeOut();
    e.stopPropagation();
});

map.addEventListener('click', function () {
    menu.classList.remove('open');
});
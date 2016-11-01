
var map,
EasingAnimator = function(opt){
        opt = opt || {};
        this.easingInterval = opt.easingInterval;
        this.duration = opt.duration || 1000;
        this.step = opt.step || 50;
        this.easingFn = opt.easingFn  || function easeInOutElastic(t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
            return -c/2 * ((t-=2)*t*t*t - 2) + b;
        };
        this.callBack = opt.callBack || function(){};
    };
EasingAnimator.makeFromCallback = function(callBack){
    return new EasingAnimator({
        callBack: callBack
    });
};
EasingAnimator.prototype.easeProp = function(obj, propDict){
    propDict = propDict || {};

    var self = this,
        t = 0,
        out_vals = JSON.parse(JSON.stringify(obj));

    clearInterval(self.easingInterval);
    self.easingInterval = setInterval(function(){
        t+= self.step;
        if (t >= self.duration) {
            clearInterval(self.easingInterval);
            self.callBack(propDict);
            return;
        }
        var percent = self.easingFn(t, 0, 1, self.duration);
        Object.keys(propDict).forEach(function(key, i) {
            var old_val = obj[key];

            out_vals[key] = old_val - percent*(old_val - propDict[key]);
        });
        self.callBack(out_vals);
    }, self.step);
};

var center = {lat:40.688885, lng:-73.977042};

var mapLocations = [
    {
        id: 1,
        position: {lat: 40.689752, lng: -73.973224},
        menuLabel: 'Ft. Greene Park',
        label: 'Fort Greene Park',
        icon: 'img/dog.png',
        locationType: 'rec'
    },
    {
        id: 2,
        position: {lat:40.692940, lng:-73.972977},
        menuLabel: 'Lulu & Po',
        label: 'Lulu & Po',
        icon: 'img/lulupo.png',
        locationType: 'food',
        businessId: 'lulu-and-po-brooklyn'
    },
    {
        id: 3,
        position: {lat: 40.689887, lng: -73.965081},
        menuLabel: 'Pratt',
        label: 'Pratt Institute',
        icon: 'img/pratt.png',
        locationType: 'school'
    },
    {
        id: 4,
        position: {lat: 40.683154, lng: -73.976168},
        menuLabel: 'Barclays Center',
        label: 'Barclays Center',
        icon: 'img/netsLogo.png',
        locationType: 'rec'
    },
    {
        id: 5,
        position: {lat: 40.686392, lng: -73.974368},
        menuLabel: 'Cafe Habana',
        label: 'Cafe Habana',
        icon: 'img/habana.png',
        locationType: 'food',
        businessId: 'habana-outpost-brooklyn'
    },
    {
        id: 6,
        position:  {lat:40.690485, lng:-73.969433},
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
        position: {lat:40.690100, lng:-73.981686},
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
        position: {lat:40.688645, lng:-73.976391},
        menuLabel: 'Brooklyn Tech',
        label: 'Brooklyn Technical High School',
        icon: 'img/bths.png',
        locationType: 'school'
    },
    {
        id: 10,
        position: {lat: 40.686808, lng: -73.977584},
        menuLabel: 'BAM',
        label: 'Brooklyn Academy of Music',
        icon: 'img/bam.png',
        locationType: 'rec'
    },

    {
        id: 11,
        position: {lat:40.688815, lng:-73.969331},
        menuLabel: 'ICI',
        label: 'ICI',
        icon: 'img/ici.png',
        locationType: 'food',
        businessId: 'ici-french-country-kitchen-brooklyn'
    },

    {
        id: 12,
        position: {lat:40.690460, lng:-73.967966},
        menuLabel: "St. Joseph\'s",
        label: "St. Joseph's College (New York)",
        icon: 'img/sjc.png',
        locationType: 'school'
    },


];

var mapMarkers = [];


function addAllMarkers(){
    console.log("adding markers");
    for (var i = 0, len = mapLocations.length; i < len; i++){
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

function attachClickBehaviour(marker){
    marker.addListener('click', function(){
        console.log(marker.id + " clicked");
        var currLoc = viewModel.setLocationByID(marker.id);
        console.log(viewModel);
    });
}


function initMap(){
    console.log('initMap');

    //var center = {lat: 40.688987, lng: -73.971061};

    map = new google.maps.Map(document.getElementById('google_map'), {
        center: center,
        zoom: 16,
        mapTypeId: 'satellite'
    });

    map.markers = [];
    addAllMarkers();
    easingAnimator = EasingAnimator.makeFromCallback(function(latLng){ map.setCenter(latLng) });


}

function showAllMarkers(){
    centerMap();
    for (var i=0, len = mapMarkers.length; i < len;  i++){
        mapMarkers[i].setVisible(true);
    }

}

function moveMap(loc){

    var point = map.getCenter();

    easingAnimator.easeProp({
        lat: point.lat(),
        lng: point.lng()
    }, {lat: loc.lat(), lng: loc.lng() });

}

function centerMap(){
    var point = map.getCenter();

    easingAnimator.easeProp({
        lat: point.lat(),
        lng: point.lng()
    }, center);
}

// iterate through array,
function filterMarkers(locationType){
    console.log("filterMarkers");
    centerMap();
    for (var i=0, len = mapMarkers.length; i < len;  i++){
        if (mapMarkers[i].locationType !== locationType){
            mapMarkers[i].setVisible(false);
        }
        else
        {
            mapMarkers[i].setVisible(true);
        }
    }
}

function getCurrentMarker(locID){
    for (var i=0, len = mapMarkers.length; i < len;  i++){
        if (mapMarkers[i].id == locID){
            return mapMarkers[i];
        }
    }
}

function setCurrentMarker(locID, relocate){
    var currentMarker = getCurrentMarker(locID);
    console.log("relocate? : " + relocate);
    if (relocate){
        map.setZoom(16);
        moveMap(currentMarker.position);
        setTimeout( function(){
        currentMarker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){currentMarker.setAnimation(null); map.setZoom(18)}, 750);
        }, 1500);
    } else{
        currentMarker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){currentMarker.setAnimation(null); }, 750);
    }


}

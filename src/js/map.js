
var map;
var center = {lat:40.688885, lng:-73.977042};
var ZOOM_IN_DISTANCE  = 20; // 20 is max
var NORMAL_ZOOM_DISTANCE = 16;
var mapLocations;
/**
 * Data object of map locations
 */

var mapMarkers = [];

/** adds all markers to map */
function addAllMarkers(){
	for (var i = 0, len = mapLocations.length; i < len; i++){
		var loc = mapLocations[i];
		var marker = new google.maps.Marker({
			position: loc.position,
			map: map,
			scaledSize: new google.maps.Size(50, 50),
			icon: "https://s3-us-west-2.amazonaws.com/andrewdunn-pictures/thumbs/images/" + loc.icon,
			locationType: loc.locationType,
			id: loc.id
		});
		 attachClickBehaviour(marker);
		 mapMarkers.push(marker);
	}
}

/** attaches click behavior to markers */
function attachClickBehaviour(marker){
	marker.addListener('click', function(event){
		var currLoc = mapModel.setLocationByID(marker.id);
	}, false);
}


/**
 * initializes map, adds click listener and applies knockout bindings
 */
function initMap(){

	//var center = {lat: 40.688987, lng: -73.971061};

	map = new google.maps.Map(document.getElementById('google-map'), {
		center: center,
		zoom: NORMAL_ZOOM_DISTANCE,
		mapTypeId: 'satellite',
		mapTypeControlOptions: {
			mapTypeIds: [google.maps.MapTypeId.ROADMAP,
				google.maps.MapTypeId.HYBRID]
		}
	});

	map.markers = [];
	addAllMarkers();
	easingAnimator = EasingAnimator.makeFromCallback(function(latLng){map.setCenter(latLng);});


	ko.applyBindings(mapModel);

	map.addListener('click', function(){
		$('#aside__map').fadeOut();
		$('#nav__map').removeClass('nav__map--open');
	});

}


/**
 * sets all map markers to visible
 */
function showAllMarkers(){
	centerMap();
	for (var i=0, len = mapMarkers.length; i < len;  i++){
		mapMarkers[i].setVisible(true);
	}

}

/**
 * 	moves map to lat, lng with easing animator
 */

function moveMap(loc){

	var point = map.getCenter();

	easingAnimator.easeProp({
		lat: point.lat(),
		lng: point.lng()
	}, {lat: loc.lat(), lng: loc.lng() });

}

/**
 * centers map, hides aside and zoons in
 */
function centerMap(){
	var point = map.getCenter();

	$('#aside__detail').hide();
	easingAnimator.easeProp({
		lat: point.lat(),
		lng: point.lng()
	}, center);
	map.setZoom(NORMAL_ZOOM_DISTANCE);
}

/**
 * filters marker visibility by location type
 */
function filterMarkers(locationType){
	centerMap();
	for (var i=0, len = mapMarkers.length; i < len;  i++){
		var marker = mapMarkers[i];
		marker.setVisible(marker.locationType === locationType);
	}
}

/**
 * gets marker by id
 */
function getCurrentMarker(locID){
	for (var i=0, len = mapMarkers.length; i < len;  i++){
		if (mapMarkers[i].id == locID){
			return mapMarkers[i];
		}
	}
}

/**
 * moves to current marker if relocate and adjusts zoom
 */
function setCurrentMarker(locID, fromMenu){
	var currentMarker = getCurrentMarker(locID);
	var locationZoom = function(){
		currentMarker.setAnimation(null);
		if (map.getZoom() != ZOOM_IN_DISTANCE){
			setTimeout(function(){
				map.setZoom(ZOOM_IN_DISTANCE);
			});

		}
	};
	// should be based on zoom level rather than click source

	// if source is menu and zoomed in
	if (fromMenu){
		// zoom out if needed
		map.setZoom(NORMAL_ZOOM_DISTANCE);
		// move to new position
		setTimeout( function(){
			moveMap(currentMarker.position);
		}, 500);
		//bounce icon then zoom in
		setTimeout( function(){
			currentMarker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(locationZoom, 700);
		},  1500);
	} else{
		if (map.getZoom() == ZOOM_IN_DISTANCE){
			currentMarker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(locationZoom, 700);
		}
		else{
			moveMap(currentMarker.position);
			//bounce icon then zoom in
			setTimeout( function(){
				currentMarker.setAnimation(google.maps.Animation.BOUNCE);
				setTimeout(locationZoom, 700);
			}, 1500);

		}

	}


}

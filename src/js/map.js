
var map;
var center = {lat:40.688885, lng:-73.977042};
var ZOOM_IN_DISTANCE  = 24;
var NORMAL_ZOOM_DISTANCE = 16;

var mapLocations = [
	{
		id: 1,
		position: {lat: 40.689752, lng: -73.973224},
		menuLabel: 'Ft. Greene Park',
		label: 'Fort Greene Park',
		icon: 'img/dog.png',
		locationType: 'rec',
		pageID: 629083
	},
	{
		id: 2,
		position: {lat: 40.693037, lng: -73.973006},
		menuLabel: 'Lulu & Po',
		label: 'Lulu & Po',
		icon: 'img/lulupo.png',
		locationType: 'food',
		businessId: 'lulu-and-po-brooklyn'
	},
	{
		id: 3,
		position: {lat: 40.691107, lng: -73.963735},
		menuLabel: 'Pratt',
		label: 'Pratt Institute',
		icon: 'img/pratt.png',
		locationType: 'school',
		pageID: 778086
	},
	{
		id: 4,
		position: {lat: 40.683154, lng: -73.976168},
		menuLabel: 'Barclays Center',
		label: 'Barclays Center',
		icon: 'img/barclays.png',
		locationType: 'rec',
		pageID: 1658814
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
		locationType: 'school',
		pageID: 378883
	},
	{
		id: 10,
		position: {lat: 40.686808, lng: -73.977584},
		menuLabel: 'BAM',
		label: 'Brooklyn Academy of Music',
		icon: 'img/bam.png',
		locationType: 'rec',
		pageID: 215190
	},

	{
		id: 11,
		position: {lat:40.689272, lng:-73.969326},
		menuLabel: 'Maison May',
		label: 'Maison May Dekalb',
		icon: 'img/mm.png',
		locationType: 'food',
		businessId: 'maison-may-dekalb-brooklyn-2'
	},

	{
		id: 12,
		position: {lat:40.690460, lng:-73.967966},
		menuLabel: 'St. Joseph\'s',
		label: 'St. Joseph\'s College (New York)',
		icon: 'img/sjc.png',
		locationType: 'school',
		pageID: 910252
	},

	{
		id: 13,
		position: {lat:40.693773, lng:-73.964390},
		menuLabel: 'Castro\'s',
		label: 'Castro\'s Restaurant',
		icon: 'img/castros.png',
		locationType: 'food',
		businessId:'castros-restaurant-brooklyn'
	}


];

var mapMarkers = [];


function addAllMarkers(){
	console.log('adding markers');
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
		console.log(marker.id + ' clicked');
		var currLoc = mapModel.setLocationByID(marker.id);
	});
}


function initMap(){
	console.log('initMap');

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
		console.log('map click');
		$('#aside__map').fadeOut();
		document.querySelector('#nav__map').classList.remove('open');
	});

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

	$('#over-map-detail').hide();
	easingAnimator.easeProp({
		lat: point.lat(),
		lng: point.lng()
	}, center);
	map.setZoom(NORMAL_ZOOM_DISTANCE);
}

// iterate through array,
function filterMarkers(locationType){
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
	console.log('relocate? : ' + relocate);
	var locationZoom = function(){
		currentMarker.setAnimation(null);
		if (map.getZoom() != ZOOM_IN_DISTANCE){
			setTimeout(function(){
				map.setZoom(ZOOM_IN_DISTANCE);
			});

		}
	};
	if (relocate){
		// zoom out if needed
		map.setZoom(NORMAL_ZOOM_DISTANCE);
		// move to new position
		setTimeout( function(){
			moveMap(currentMarker.position);
		}, 500);
		//bounce icon then zoom in
		setTimeout( function(){
			currentMarker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(locationZoom, 750);
		}, 1500);
	} else{
		if (map.getZoom() != ZOOM_IN_DISTANCE){
			// move to new position
			moveMap(currentMarker.position);
		}
		// bounce icon and zoom in
		currentMarker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(locationZoom, 750);
	}


}

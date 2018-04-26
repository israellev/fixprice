/* todos list: @israellev
עיגול כחול למיקום שלי
1. transfer to hebrew
2. add https secure
3. add aoutomatic word complation in search
4. responsive design for mobile
5. add from another stores of fix price
6. get data online from websites
7. hire domain with good name
8. generate app for android
9. add google adds
10. publish it!
*/


//callback from src google maps
function initMap() {
    window.geo = {
            map: new google.maps.Map(document.getElementById('map'), {
                zoom: 9,
                center: {
                    lat: 32.1,
                    lng: 35.1
                }
            }),
            infowindow: new google.maps.InfoWindow,
            geocoder: new google.maps.Geocoder
        }
        // add click to find button - for async
    document.getElementById('find').addEventListener('click', function() {
        findnear();
    });
    // add the enter press for find button
    $("#findAddress").keyup((event) => {
        if (event.keyCode === 13) {
            $("#find").click();
        }
    });
    // if you adenefid my location show it
    myLocation();
}

// find stores near my address
function findnear() {
    let address = document.getElementById('findAddress').value;
    changeMap(address)
        .subscribe(obj => {
            window.geo.map =
                new google.maps.Map(document.getElementById('map'), {
                    zoom: 10,
                    center: obj.geoPoint
                })
            getMap(obj.geoPoint, 'my location');
            let parseGeoPoint = changeGeo(obj.geoPoint);
            showStores(parseGeoPoint);
        });
}

// show my location on map
function myLocation() {
    let infowindow = window.geo.infowindow;
    let map = window.geo.map;
    let geoPoint;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                // to google format 
                geoPoint = changeGeo(position.coords);
                // get address from geoPoing
                getMap(geoPoint, 'המיקום שלך  ', true);
                showStores(position.coords);
                console.log(geoPoint);
            },
            // fake location - until https
            err => {
                // console.log('position denied in http connect');
                geoPoint = {
                    lat: 31.7793569,
                    lng: 35.215865099999974
                }
                getMap(geoPoint, 'המיקום שלך  ', true);
                geoPoint = changeGeo(geoPoint)
                showStores(geoPoint);
                map.setZoom(15);
            }
        );
    } else {
        geoPoint = {
            lat: 32.085299899999995,
            lng: 34.781767599999995
        }

        getMap(geoPoint, 'המיקום שלך  ', true);
        geoPoint = changeGeo(geoPoint)
        showStores(geoPoint);
        map.setZoom(15);
    }
}

//for use - transfer format geo google or parse
function changeGeo(geo) {
    if (geo.lat === undefined) {
        return geoPoint = {
            lat: geo.latitude,
            lng: geo.longitude
        }
    } else {
        return geoPoint = {
            latitude: geo.lat,
            longitude: geo.lng
        }
    }
}

//for use - show near stores on templet
function showStores(geoPoint) {
    $('#div').text('');
    let stores = Parse.Object.extend("cofix_stores");
    let query = new Parse.Query(stores);
    query.near("geoPoint", geoPoint);
    query.limit(10);
    query.find()
        .then(results => {
            $('#div').append(`<div id="allLists" class="card"></div>`);
            for (var i = 0; i < results.length; i++) {
                let hours = results[i].attributes.opening_hours.toString();
                hours = hours.replace('\n', '<br/>');
                hours = hours.replace('שישי', '- שישי');
                hours = hours.replace('מוצ"ש', '<br/>מוצ"ש');
                hours = hours.replace('שבת כ', '- שבת כ');
                $('#allLists').append(`
                        <div id="list" class="card-block">
                            <div id="imgList">
                                <img id="img" src="${results[i].attributes.linkPictureStore}"/>
                            </div>
                            <div id="textList1">
                                ${results[i].attributes.address}<br/>
                                ${results[i].attributes.place_description}                              
                            </div>
                            <div id="textList2">
                                ${hours}<br/>
                                navigate with: 
                                <a href="${results[i].attributes.goToGoogleMap}">GoogleMaps</a> - 
                                <a href="${results[i].attributes.goToWaze}">Waze</a>                                
                                <hr/>
                            </div>
                        </div>
                        `);
                // every store - show on map
                let geoPoint = changeGeo(results[i].attributes.geoPoint)
                getMap(geoPoint);
            }
        })
        .catch(err => $('#div').text(err));
}

//for use - show on the map
function getMap(geoPoint, text) {
    let infowindow = window.geo.infowindow;
    let map = window.geo.map;
    let marker = new google.maps.Marker({
        position: new google.maps.LatLng(geoPoint.lat, geoPoint.lng),
        map: map
    });
    map.setZoom(15);

    // add content and set center - only for my location or search 
    if (text) {
        map.setCenter(geoPoint);
        infowindow.setContent(text);
        infowindow.open(map, marker);
        console.log(geoPoint);
    } else {
        // IFEE working for full times marker
        (function(map, marker) {
            return function() {
                infowindow.open(map, marker);
            }
        })(map, marker)
    }
}

//for use - transfer address to geoPoint 
function changeMap(location) {
    return obs.create(ob => {
        geocoder = window.geo.geocoder;
        geocoder.geocode({
            'address': location
        }, function(res, status) {
            if (status === 'OK') {
                if (res[0]) {
                    let obj = {
                        geoPoint: {
                            lat: res[0].geometry.location.lat(),
                            lng: res[0].geometry.location.lng()
                        },
                        formatted_address: res[0].formatted_address
                    };
                    ob.next(obj);
                } else {
                    window.alert('No res found');
                };
            } else {
                window.alert('Geocoder failed due to: ' + status);
            };
        });
    });
}
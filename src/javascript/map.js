// import { SFtoLA, SFcord } from './app'

import City from './city.js'
import Route from './route.js'

const SF = new City(-122.414, 37.776, "SF")
// console.log(SFcord);
// LA
const LA = new City(-118.2437, 34.0522, "LA")

const Reno = new City(-119.8138, 39.5296, "Reno")


export const SFtoLA = new Route(SF, LA)
export const LAtoReno = new Route(LA, Reno)



mapboxgl.accessToken = 'pk.eyJ1Ijoic3RlcGhlbmxpMzA1IiwiYSI6ImNqbncyaWR0ZzFsc2MzcW1rNWczbnVqeDYifQ.afmueMPaXRJ1f4XXcG0IgA';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-122.271111, 37.804363],
    zoom: 5
});


//createRoute(SF, LA, Reno) returns [SFtoLA, LAtoReno]
function createRoute(cities){

  //rsult arr
  //for loop to itterate through cities - 1
  // nested loop for second city
  //new city1
  //new city2
  //new route =
  //push newroute

  let result = []
  for (let i = 0; i < cities.length - 1; i++) {
    let city1 = cities[i]
    let city2 = cities[i + 1]
    let newRoute = new Route(city1, city2)
    result.push(newRoute)
  }
  return result
}

// let cities = [SF, LA, Reno]
// console.log(createRoute(cities));

function drawRoute(route){
  map.addSource( `${route.getID()}-line`, {
    "type":"geojson",
    "data": route.route()
  }),


  map.addLayer({
      "id": `${route.getID()}-line`,
      "source": `${route.getID()}-line`,
      "type": "line",
      "paint": {
          "line-width": 2,
          "line-color": "#FDB927"
      }
  });


}

function drawAirplane(planeData){
  map.addSource( 'plane', {
    "type": "geojson",
    "data": planeData
  });

  map.addLayer({
    "id": 'plane',
    "source": 'plane',
    "type": "symbol",
    "layout": {
      "icon-image": "airport-15",
      "icon-rotate": ["get", "bearing"],
      "icon-rotation-alignment": "map",
      "icon-allow-overlap": true,
      "icon-ignore-placement": true
    }
  });
}


// const steps = 250
const steps = 200

// route.route().features[0].geometry.coordinates = route.arc()
function annimateAirplane(planeObject, fullArc, counter = 0){

  planeObject.features[0].geometry.coordinates = fullArc[counter];
  map.getSource('plane').setData(planeObject);


  planeObject.features[0].properties.bearing = turf.bearing(
      turf.point(fullArc[counter >= steps ? counter - 1 : counter]),
      turf.point(fullArc[counter >= steps ? counter : counter + 1])
  );

  if (counter < fullArc.length){
    requestAnimationFrame(() => annimateAirplane(planeObject, fullArc, counter + 1))
  }
}

map.on('click', function(){
  let cities = [Reno, LA]
  let routes = createRoute(cities)
  let planeObject =
    {
      "type": "FeatureCollection",
      "features": [{
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point"
        }
      }]
    };

  // let routes = [SFtoLA, LAtoReno]

  let fullArc = []
  for (var i = 0; i < routes.length; i++) {
    drawRoute(routes[i])
    fullArc.push(...routes[i].arc(steps))
  }
  planeObject.features[0].geometry.coordinates = routes[0].origin.pos
  drawAirplane(planeObject)
  annimateAirplane(planeObject, fullArc);

})


export default map

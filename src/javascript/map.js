// import { SFtoLA, SFcord } from './app'

import City from './city.js'
import Route from './route.js'


// Atlantic
const BOS = new City(-71.0589, 42.3601, "BOS")
const BKN = new City(-73.9442, 40.6782, "BKN")
const NYC = new City(-74.0060, 40.7128, "NYC")
const PHI = new City(-75.1652, 39.9526, "PHI")
const TOR = new City(-79.3832, 43.6532, "TOR")

// Central
const CHI = new City(-87.6298, 41.8781, "CHI")
const CLE = new City(-81.6944, 41.4993, "CLE")
const DET = new City(-83.0458, 42.3314, "DET")
const IND = new City(-86.1581, 39.7684, "IND")
const MIL = new City(-87.9065, 43.0389, "MIL")

// Southeast
const ATL = new City(-84.3880, 33.7490, "ATL")
const CHA = new City(-80.8431, 35.2271, "CHA")
const MIA = new City(-80.1918, 25.7617, "MIA")
const ORL = new City(-81.3792, 28.5383, "ORL")
const WAS = new City(-77.0369, 38.9072, "WAS")

//Northwest
const DEN = new City(-104.9903, 39.7392, "DEN")
const MIN = new City(-93.2650, 44.9778, "MIN")
const OKC = new City(-97.5164, 35.4676, "OKC")
const POR = new City(-122.6587, 45.5122, "POR")
const UTA = new City(-111.8910, 40.7608, "UTA")

// Pacific
const OAK = new City(-122.414, 37.776, "OAK")
const LA = new City(-118.2437, 34.0522, "LA")
const PHX = new City(-112.0740, 33.4484, "PHX")
const SAC = new City(-121.4944, 38.5816, "SAC")


//Southwest
const DAL = new City(-96.7970, 32.7767, "DAL")
const HOU = new City(-95.3698, 29.7604, "HOU")
const MEM = new City(-90.0490, 35.1495, "MEM")
const NOP = new City(-90.0715, 29.9511, "NOP")
const SAS = new City(-98.4936, 29.4241, "SAS")

const center = new City(-98.5795, 39.8283, "center" )
mapboxgl.accessToken = 'pk.eyJ1Ijoic3RlcGhlbmxpMzA1IiwiYSI6ImNqbncyaWR0ZzFsc2MzcW1rNWczbnVqeDYifQ.afmueMPaXRJ1f4XXcG0IgA';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: center.pos,
    zoom: 4
});

function createRoute(cities){
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
  // put in a list of cities in this array
  let cities = [OAK,LA, PHX, HOU, DAL, OKC, MIA, MEM, ORL, CHA, BOS, NYC, TOR, CLE, MIN, UTA, POR, OAK]
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

// import { SFtoLA, SFcord } from './app'

import City from './city.js'
import Route from './route.js'
// import { data } from '../API/api.js'

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
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: center.pos,
    zoom: 4
});

class Map {
  constructor(){
    this.steps = 100
    this.flying = this.flying.bind(this)
    this.createRoute = this.createRoute.bind(this)
    this.drawRoute = this.drawRoute.bind(this)
    this.drawAirplane = this.drawAirplane.bind(this)
    this.annimateAirplane = this.annimateAirplane.bind(this)


  }

 createRoute(cities){
  let result = []
  for (let i = 0; i < cities.length - 1; i++) {
    let city1 = cities[i]
    let city2 = cities[i + 1]
    let newRoute = new Route(city1, city2)
    result.push(newRoute)
  }
  return result
}

 drawRoute(route){

  map.addSource( `${route.getID()}`, {
    "type":"geojson",
    "data": route.route()
  }),
  console.log(route),

  map.addLayer({
      "id": `${route.getID()}`,
      "source": `${route.getID()}`,
      "type": "line",
      "paint": {
          "line-width": 2,
          "line-color": "#FDB927"
      }
  });
}

 drawAirplane(planeData, origin){
  map.addSource( 'plane', {
    "type": "geojson",
    "data": planeData
  });

  map.addLayer({
    "id": origin,
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

 annimateAirplane(planeObject, fullArc, counter = 0){

  planeObject.features[0].geometry.coordinates = fullArc[counter];
  map.getSource('plane').setData(planeObject);


  planeObject.features[0].properties.bearing = turf.bearing(
      turf.point(fullArc[counter >= this.steps ? counter - 1 : counter]),
      turf.point(fullArc[counter >= this.steps ? counter : counter + 1])
  );

  if (counter < fullArc.length){
    requestAnimationFrame(() => this.annimateAirplane(planeObject, fullArc, counter + 1))
  }
}

 flying(cities){
  // put in a list of cities in this array
  // let cities = [OAK,LA,PHX,OAK]
  // let origin_city = cities[0].pos
  // debugger
  console.log(cities);
  let origin_city = cities[0].name
  let routes = this.createRoute(cities)
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
    this.drawRoute(routes[i])
    fullArc.push(...routes[i].arc(this.steps))
  }
  planeObject.features[0].geometry.coordinates = routes[0].origin.pos
  this.drawAirplane(planeObject, origin_city)
  this.annimateAirplane(planeObject, fullArc);
}

 removeLayer(){


   const cities = [OAK,LA, PHX]

   map.removeLayer('OAK')
   for (var i = 0; i < cities.length - 1; i++) {
     map.removeLayer(`${cities[i].name}${cities[i + 1].name}`)
     map.removeSource(`${cities[i].name}${cities[i + 1].name}`)
     // debugger
   }
   setTimeout(map.removeSource('plane'), 0)



   map.removeLayer('BOS')
   map.removeLayer('BOSBKN')
   map.removeLayer('BKNNYC')

   map.removeSource('BOSBKN')
   map.removeSource('BKNNYC')


   // const lacities = [BOS, BKN, NYC]


   debugger

 }
}
const mapclass = new Map()


const remove = document.getElementById('Remove')
remove.addEventListener('click', () => mapclass.removeLayer())

const cities = [OAK,LA, PHX]
const flyOAK = document.getElementById('OAK')
flyOAK.addEventListener('click', () => mapclass.flying(cities))

const lacities = [BOS, BKN, NYC]
const flyLAL = document.getElementById('LAL')
flyLAL.addEventListener('click', () => mapclass.flying(lacities))

export default map

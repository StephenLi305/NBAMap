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
const OAK = new City(-122.2030, 37.7503, "OAK")
const LA = new City(-118.2437, 34.0522, "LA")
const PHX = new City(-112.0740, 33.4484, "PHX")
const SAC = new City(-121.4944, 38.5816, "SAC")


//Southwest
const DAL = new City(-96.7970, 32.7767, "DAL")
const HOU = new City(-95.3698, 29.7604, "HOU")
const MEM = new City(-90.0490, 35.1495, "MEM")
const NOP = new City(-90.0715, 29.9511, "NOP")
const SAS = new City(-98.4936, 29.4241, "SAS")

const route1 = [OAK, UTA, DEN, OAK]
const route2 = [OAK, NYC, BKN, CHI, OAK]
const route3 = [OAK, LA, OAK]
const route4 = [OAK, HOU, DAL, SAS, OAK]
const route5 = [OAK, TOR, DET, ATL, CLE, MIL, OAK]
const route6 = [OAK, SAC, OAK]
const route7 = [OAK, UTA, OAK]
const route8 = [OAK, POR, PHX, OAK]
const route9 = [OAK, DAL, DEN, OAK]
const route10 = [OAK, LA, WAS, BOS, IND, OAK]
const route11 = [OAK, PHX, OAK]
const route12 = [OAK, POR, OAK]
const route13 = [OAK, CHA, MIA, ORL, PHI, OAK]
const route14 = [OAK, HOU, OKC, SAS, MIN, OAK]
const route15 = [OAK, MEM, MIN, OAK]
const route16 = [OAK, LA, OAK]
const route17 = [OAK, NOP, MEM, OAK]
const routes = [route1, route2, route3, route4, route5, route6, route7, route8, route9, route10, route11, route12, route13, route14, route15, route16, route17]


const center = new City(-98.5795, 39.8283, "center" )

mapboxgl.accessToken = 'pk.eyJ1Ijoic3RlcGhlbmxpMzA1IiwiYSI6ImNqbncyaWR0ZzFsc2MzcW1rNWczbnVqeDYifQ.afmueMPaXRJ1f4XXcG0IgA';
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: center.pos,
    zoom: 3.25
});

class Map {
  constructor(){
    this.steps = 100
    this.grounded = true
    this.currentPlane = null

    this.flying = this.flying.bind(this)
    this.createRoute = this.createRoute.bind(this)
    this.drawRoute = this.drawRoute.bind(this)
    this.drawAirplane = this.drawAirplane.bind(this)
    this.annimateAirplane = this.annimateAirplane.bind(this)
    this.removeLayer = this.removeLayer.bind(this)
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
  // console.log("draw", route),

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
  // console.log(fullArc)
  if (counter < fullArc.length){
    this.currentPlane = requestAnimationFrame(() => this.annimateAirplane(planeObject, fullArc, counter + 1))
  }
}

 flying(cities){
   console.log(cities)
  if (this.grounded){
    this.grounded = false
    let origin_city = cities[0].name
    let routes = this.createRoute(cities)
    // console.log(routes)
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
    // debugger
    for (var i = 0; i < routes.length; i++) {
      this.drawRoute(routes[i])
      fullArc.push(...routes[i].arc(this.steps))
    }
    planeObject.features[0].geometry.coordinates = routes[0].origin.pos

    this.drawAirplane(planeObject, origin_city)
    this.annimateAirplane(planeObject, fullArc);
  } else {
    this.removeLayer()
    cancelAnimationFrame(this.currentPlane)
    this.currentPlane = null
    this.grounded = true
    this.flying(cities)
  }
}

 removeLayer(){
   map.removeLayer('OAK')

   for (let route of routes){     
     for (var i = 0; i < route.length - 1; i++) {
       map.removeLayer(`${route[i].name}${route[i + 1].name}`) 
       if (map.getStyle().sources[`${route[i].name + route[i + 1].name}`]) {map.removeSource(`${route[i].name}${route[i + 1].name}`)}
     }
   }
   setTimeout(map.removeSource('plane'),0)
 }
}


const mapclass = new Map()


// adding the actions with the buttons
for(let i = 1; i < 18 ;i++){
  let route = routes[i - 1]; 
  document.getElementById("OAK" + i).addEventListener('click', () => mapclass.flying(route))
}

export default map

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
    this.grounded = true

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
  // console.log(new Date());
}

 flying(cities){

  if (this.grounded){
    this.grounded = false
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
    // setTimeout()
  } else {
    this.removeLayer()
    this.grounded = true
    this.flying(cities)
  }
}

 removeLayer(){
   // set to clear every route, will refactor in future
   const route1 = [OAK,UTA, DEN, OAK]
   map.removeLayer('OAK')
   for (var i = 0; i < route1.length - 1; i++) {
     // if (map.getStyle().layers[`${route1[i].name + route1[i + 1].name}`]) {map.removeLayer(`${route1[i].name}${route1[i + 1].name}`)}
     map.removeLayer(`${route1[i].name}${route1[i + 1].name}`) // refactor in future to get rid of minor errors
     if (map.getStyle().sources[`${route1[i].name + route1[i + 1].name}`]) {map.removeSource(`${route1[i].name}${route1[i + 1].name}`)}
   }

   const route2 = [OAK, NYC, BKN, CHI, OAK]
   for (var i = 0; i < route2.length - 1; i++) {
     map.removeLayer(`${route2[i].name}${route2[i + 1].name}`)
     if (map.getStyle().sources[`${route2[i].name + route2[i + 1].name}`]) {map.removeSource(`${route2[i].name}${route2[i + 1].name}`)}
   }

   const route4 = [OAK, HOU, DAL, SAS, OAK]
   for (var i = 0; i < route4.length - 1; i++) {
     map.removeLayer(`${route4[i].name}${route4[i + 1].name}`)
     if (map.getStyle().sources[`${route4[i].name + route4[i + 1].name}`]) {map.removeSource(`${route4[i].name}${route4[i + 1].name}`)}
   }

   const route5 = [OAK, TOR, DET, ATL, CLE, MIL, OAK]
   for (var i = 0; i < route5.length - 1; i++) {
     map.removeLayer(`${route5[i].name}${route5[i + 1].name}`)
     if (map.getStyle().sources[`${route5[i].name + route5[i + 1].name}`]) {map.removeSource(`${route5[i].name}${route5[i + 1].name}`)}
   }

   const route6 = [OAK, SAC, OAK]
   for (var i = 0; i < route6.length - 1; i++) {
     map.removeLayer(`${route6[i].name}${route6[i + 1].name}`)
     if (map.getStyle().sources[`${route6[i].name + route6[i + 1].name}`]) {map.removeSource(`${route6[i].name}${route6[i + 1].name}`)}
   }

   const route7 = [OAK, UTA, OAK]
   for (var i = 0; i < route7.length - 1; i++) {
     map.removeLayer(`${route7[i].name}${route7[i + 1].name}`)
     if (map.getStyle().sources[`${route7[i].name + route7[i + 1].name}`]) {map.removeSource(`${route7[i].name}${route7[i + 1].name}`)}
   }

   const route8 = [OAK, POR, PHX, OAK]
   for (var i = 0; i < route8.length - 1; i++) {
     map.removeLayer(`${route8[i].name}${route8[i + 1].name}`)
     if (map.getStyle().sources[`${route8[i].name + route8[i + 1].name}`]) {map.removeSource(`${route8[i].name}${route8[i + 1].name}`)}
   }

   const route9 = [OAK, DAL, DEN, OAK]
   for (var i = 0; i < route9.length - 1; i++) {
     map.removeLayer(`${route9[i].name}${route9[i + 1].name}`)
     if (map.getStyle().sources[`${route9[i].name + route9[i + 1].name}`]) {map.removeSource(`${route9[i].name}${route9[i + 1].name}`)}
   }

   const route10 = [OAK, LA, WAS, BOS, IND, OAK]
   for (var i = 0; i < route10.length - 1; i++) {
     map.removeLayer(`${route10[i].name}${route10[i + 1].name}`)
     if (map.getStyle().sources[`${route10[i].name + route10[i + 1].name}`]) {map.removeSource(`${route10[i].name}${route10[i + 1].name}`)}
   }

   const route11 = [OAK, PHX, OAK]
   for (var i = 0; i < route11.length - 1; i++) {
     map.removeLayer(`${route11[i].name}${route11[i + 1].name}`)
     if (map.getStyle().sources[`${route11[i].name + route11[i + 1].name}`]) {map.removeSource(`${route11[i].name}${route11[i + 1].name}`)}
   }

   const route12 = [OAK, POR, OAK]
   for (var i = 0; i < route12.length - 1; i++) {
     map.removeLayer(`${route12[i].name}${route12[i + 1].name}`)
     if (map.getStyle().sources[`${route12[i].name + route12[i + 1].name}`]) {map.removeSource(`${route12[i].name}${route12[i + 1].name}`)}
   }

   const route13 = [OAK, CHA, MIA, ORL, PHI, OAK]
   for (var i = 0; i < route13.length - 1; i++) {
     map.removeLayer(`${route13[i].name}${route13[i + 1].name}`)
     if (map.getStyle().sources[`${route13[i].name + route13[i + 1].name}`]) {map.removeSource(`${route13[i].name}${route13[i + 1].name}`)}
   }

   const route14 = [OAK, HOU, OKC, SAS, MIN, OAK]
   for (var i = 0; i < route14.length - 1; i++) {
     map.removeLayer(`${route14[i].name}${route14[i + 1].name}`)
     if (map.getStyle().sources[`${route14[i].name + route14[i + 1].name}`]) {map.removeSource(`${route14[i].name}${route14[i + 1].name}`)}
   }

   const route15 = [OAK, MEM, MIN, OAK]
   for (var i = 0; i < route15.length - 1; i++) {
     map.removeLayer(`${route15[i].name}${route15[i + 1].name}`)
     if (map.getStyle().sources[`${route15[i].name + route15[i + 1].name}`]) {map.removeSource(`${route15[i].name}${route15[i + 1].name}`)}
   }

   const route16 = [OAK, LA, OAK]
   for (var i = 0; i < route16.length - 1; i++) {
     map.removeLayer(`${route16[i].name}${route16[i + 1].name}`)
     if (map.getStyle().sources[`${route16[i].name + route16[i + 1].name}`]) {map.removeSource(`${route16[i].name}${route16[i + 1].name}`)}
   }
   const route17 = [OAK, NOP, MEM, OAK]
   for (var i = 0; i < route17.length - 1; i++) {
     map.removeLayer(`${route17[i].name}${route17[i + 1].name}`)
     if (map.getStyle().sources[`${route17[i].name + route17[i + 1].name}`]) {map.removeSource(`${route17[i].name}${route17[i + 1].name}`)}
   }

   setTimeout(map.removeSource('plane'),0)
 }
}
const mapclass = new Map()

//First Road Trip
const route1 = [OAK,UTA, DEN, OAK]
const fly1 = document.getElementById('OAK1')
fly1.addEventListener('click', () => mapclass.flying(route1))

//Second Road Trip
const route2 = [OAK, NYC, BKN, CHI, OAK]
const fly2 = document.getElementById('OAK2')
fly2.addEventListener('click', () => mapclass.flying(route2))

//Third Road Trip
const route3 = [OAK, LA, OAK]
const fly3 = document.getElementById('OAK3')
fly3.addEventListener('click', () => mapclass.flying(route3))

//Fourth Road Trip
const route4 = [OAK, HOU, DAL, SAS, OAK]
const fly4 = document.getElementById('OAK4')
fly4.addEventListener('click', () => mapclass.flying(route4))

//Fifth Road Trip
const route5 = [OAK, TOR, DET, ATL, CLE, MIL, OAK]
const fly5 = document.getElementById('OAK5')
fly5.addEventListener('click', () => mapclass.flying(route5))

//Sixth Road Trip
const route6 = [OAK, SAC, OAK]
const fly6 = document.getElementById('OAK6')
fly6.addEventListener('click', () => mapclass.flying(route6))

//Seventh Road Trip
const route7 = [OAK, UTA, OAK]
const fly7 = document.getElementById('OAK7')
fly7.addEventListener('click', () => mapclass.flying(route7))

//Eighth Road Trip
const route8 = [OAK, POR, PHX, OAK]
const fly8 = document.getElementById('OAK8')
fly8.addEventListener('click', () => mapclass.flying(route8))

//Ninth Road Trip
const route9 = [OAK, DAL, DEN, OAK]
const fly9 = document.getElementById('OAK9')
fly9.addEventListener('click', () => mapclass.flying(route9))

//Tenth Road Trip
const route10 = [OAK, LA, WAS, BOS, IND, OAK]
const fly10 = document.getElementById('OAK10')
fly10.addEventListener('click', () => mapclass.flying(route10))

//Eleventh Road Trip
const route11 = [OAK, PHX, OAK]
const fly11 = document.getElementById('OAK11')
fly11.addEventListener('click', () => mapclass.flying(route11))

//Twelveth Road Trip
const route12 = [OAK, POR, OAK]
const fly12 = document.getElementById('OAK12')
fly12.addEventListener('click', () => mapclass.flying(route12))

//Thirteenth Road Trip
const route13 = [OAK, CHA, MIA, ORL, PHI, OAK]
const fly13 = document.getElementById('OAK13')
fly13.addEventListener('click', () => mapclass.flying(route13))

//Fourteeth Road Trip
const route14 = [OAK, HOU, OKC, SAS, MIN, OAK]
const fly14 = document.getElementById('OAK14')
fly14.addEventListener('click', () => mapclass.flying(route14))

//Fifteen Road Trip
const route15 = [OAK, MEM, MIN, OAK]
const fly15 = document.getElementById('OAK15')
fly15.addEventListener('click', () => mapclass.flying(route15))

//Sixteen Road Trip
const route16 = [OAK, LA, OAK]
const fly16 = document.getElementById('OAK16')
fly16.addEventListener('click', () => mapclass.flying(route16))

//Seventeenth Road Trip
const route17 = [OAK, NOP, MEM, OAK]
const fly17 = document.getElementById('OAK17')
fly17.addEventListener('click', () => mapclass.flying(route17))








export default map

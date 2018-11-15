class Route {
  constructor(origin, destination){
    this.origin = origin
    this.destination = destination
    this.originPoint = this.originPoint.bind(this)
    this.destinationPoint = this.destinationPoint.bind(this)
    this.distance = this.distance.bind(this)
    this.route = this.route.bind(this)
    this.id = `${origin.name}${destination.name}`
  }

  getID(){
    return this.id
  }

  route() {
    return ({
      "type": "FeatureCollection",
      "features": [{
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": [
            this.origin.pos,
            this.destination.pos
          ]
        }
      }]
    })
  };

  originPoint() {
    // debugger
    return ({
      "type": "FeatureCollection",
      "features": [{
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": this.origin.pos
        }
      }]
    })
  };

  destinationPoint() {
    return ({
      "type": "FeatureCollection",
      "features": [{
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": this.destination.pos
        }
      }]
    })
  };


distance(){
  // const line = turf.lineString([this.origin, this.destination])
  // debugger
  // line =
  return turf.distance(this.originPoint().features[0], this.destinationPoint().features[0], 'kilometers');

}



arc(steps = 25){
  const arc = [];
  const lineLength = this.distance(this.origin.pos,this.destination.pos)
  for (var i = 0; i < lineLength; i += lineLength / steps ) {
    // debugger
    const segment = turf.along(this.route(this.origin.pos, this.destination.pos).features[0], i, 'kilometers')
    arc.push(segment.geometry.coordinates)
  }
  return arc
  }

}

export default Route

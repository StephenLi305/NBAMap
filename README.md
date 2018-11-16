# NBA Map

Live Link(www.google.com)

#### Background and Overview

The motivation behind NBA Maps is my curiosity in the algorithm behind how a professional sports league comes out with an algorithm to create a schedule for a season. I also have an interest in their travels and how each team travels over the 7 months season across the country.

There's 30 teams in the league.       
Each team plays 82 games.      
That's 2460 games to account for.

This application will have a timeline for which ever team you select, and have a short timeline and timer to show the route a team takes, including the time frame where they start, their roadtrips, and going from mid October to mid May.

This application currently has a simulation of the Golden State Warriors' 2018-2019 NBA schedule and each roadtrip they will take throughout the season. The beauty behind this is to show how many potential stops they make on a roadtrip before going back home. This timelines them from October to April

#### Functionality and Features
* Renders Interactive MapBox
* Animation of team traveling from city to city based on time
* GeoJSON
* Sports API gathering NBA season schedule

### Screenshot
Below is a screenshot of what it would look like visually.

![](https://i.imgur.com/6vf90xG.png)

### Design

```
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
 } else {
   this.removeLayer()
   this.grounded = true
   this.flying(cities)
 }
}
```
The design I originally had to was create a individual function that will have the airplane fly from cityA to cityB, and then cityB to cityC, all as individual functionality. I ended up changing the design to have a smoother transition by gathering all the routes, (CityA, CityB, and CityC) and create one full arc that the airplane will go through all at one. The other feature I added was if you have an annimation of one route and you want to see another one, clicking a different route will cancel the current route and start the newly clicked one.

#### Future Features
Include other NBA teams and have more options.
Include other professional teams like the MLB, NHL, and NFL.
Include a NCAA schedule
Show dates of current flight, and track previous years.

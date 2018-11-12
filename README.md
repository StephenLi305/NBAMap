# NBA Map


#### Background and Overview

The motivation behind NBA Maps is my curiosity in the algorithm behind how a professional sports league comes out with an algorithm to create a schedule for a season. I also have an interest in their travels and how each team travels over the 8 months season across the country.

There's 30 teams in the league.       
Each team plays 82 games.      
That's 2460 games to account for.

This application will have a timeline for which ever team you select, and have a short timeline and timer to show the route a team takes, including the time frame where they start, their roadtrips, and going from mid October to mid May.

#### Functionality and Features
* Renders Interactive MapBox
* Sports API gathering NBA season schedule
* Animation of team travling from city to city based on time
* GeoJSON

### Screenshot
Below is a screenshot of what it would look like visually.

![](https://imgur.com/QFD05vs.png)

### Design

```
function flying(){
  // put in a list of cities in this array
  let cities = [OAK,LA, PHX, HOU, DAL, OKC, MIA, PHI, MEM, ORL, CHA, BOS, NYC, TOR, CLE, MIN, UTA, POR, OAK]
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

}

flyOAK.addEventListener('click', () => flying())
```
The design I originally had to was create a individual function that will have the airplane fly from cityA to cityB, and then cityB to cityC, all as individual functionality. I ended up changing the design to have a smoother transition by gathering all the routes, (CityA, CityB, and CityC) and create one full arc that the airplane will go through all at one.

There's one airplane with many routes connected together.

Currently, everything is still under construction and I have yet to finish grabbing API endpoints or adding the timeline.

#### Future Features
Include other professional sport teams and college teams

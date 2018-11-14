const MySportsFeeds = require("mysportsfeeds-node");

const msf = new MySportsFeeds("1.2", true, null);

msf.authenticate("648016bb-4f97-4bd1-86f7-28d711", "go_password_go");




export const data = msf.getData('nba', '2016-2017-regular', 'player_gamelogs', 'json', {player: 'stephen-curry'});

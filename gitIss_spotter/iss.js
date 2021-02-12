const request = require('request');

fetchMyIP = (callback) => {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) return callback(error, null);
    
    if (response.statusCode !== 200) {
    callback(Error(`Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`), null);
    return;
    }
    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};
        

fetchCoordsByIP = (ip, callback) => {
  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
    if (error) {
    callback(error, null);
    return; 
  }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }
        
    const { latitude, longitude } = JSON.parse(body);
        
    callback(null, { latitude, longitude });
  });
};


fetchISSFlyOverTimes = (coords, callback) => {

  const url =`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;

  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
  
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }

    const passes = JSON.parse(body).response;

    callback(null, passes);
  });
};



nextISSTimesForMyLocation = (callback) => {

  fetchMyIP((error, ip) => {
    if (error) {
    return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, nextPasses);

      });
    });
  });
};


module.exports = { nextISSTimesForMyLocation };
var Service = require('node-windows').Service;
//var EventLogger = require ('node-windows').EventLogger;

// Create a new service object
var winService = new Service({
  name:'czlife',
  description: 'czlife.',
  script: require('path').join(__dirname,'app.js'),
  //script: 'C:\\tsms_node\\38383\\server.js',
  maxRestarts: 20,
  wait: 5,
  grow: 0.5
});

// Create a new eventLogger object
//var logger = new EventLogger('TSMS API');


// Listen for the "install" event, which indicates the
// process is available as a service.
winService.on('install',function(){
  winService.start();
});

// Just in case this file is run twice.
winService.on('alreadyinstalled',function(){
  console.log('This service is already installed.');
});

// Listen for the "start" event and let us know when the
// process has actually started working.
winService.on('start',function(){
  console.log(winService.name+' started!\nVisit localhost:8080 to see it in action');
});

// Install the script as a service.
winService.install();
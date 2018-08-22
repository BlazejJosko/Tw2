//oAuth oauth:cfbmuc4giaotbwpvwvv3mbu309o3ay
//might want to checkout play-sound module
//https://www.npmjs.com/package/play-sound
/**   To-Do:
 * 
 *  -Add Interface/Design
 *  -Add Timeout per Person for scare command
 *  -Improve Code
 *  -Add Fail Message Response
 * 
 **/
//FileSystem
const fs = require('fs');
//Sound player
const player = require('play-sound')();
//Twitter API Node.js Module
const tmi = require('tmi.js')



//Variables for Interface implementation
var botName = "theblazej";
var joinMessage = "☜(ﾟヮﾟ☜) Hi, It's me (☞ﾟヮﾟ)☞";
var channel = "theblazej";
var timeout = 0;
var reduceTimeoutBool = false;


// Valid commands start with:
let commandPrefix = '!'
// Define configuration options:
let opts = {
  identity: {
    username: botName,
    password: 'oauth:' + 'cfbmuc4giaotbwpvwvv3mbu309o3ay'
  },
  channels: [
    channel
  ]
}
/**
 * 
 *  CUSTOM COMMANDS
 * 
 */
// These are the commands the bot knows (defined below):
let knownCommands = { scare }

// Function called when the "scare" command is issued:
function scare (target, context, params) {
  if(timeout <= 0){
    if (!params.length){
      const msg = `Scare Sound sofort abgespielt`
      sendMessage(target, context, msg)
      playScare(params);
      //code zum Abspielen der Sound-Datei
    } else if(params >= 0 && params <= 500){
      const msg = `Scare Sound wird in ${params} Sekunden abgespielt`
      sendMessage(target, context, msg)
      playScare(params);
    } else{
      console.log(`* Can't scare... parameter of Scare has to be inbetween 1-500`)
    }
    timeout = 500;
    reduceTimeoutBool = true;
  } else {
    const msg = `Sorry too soon. This command can be executed in ${delay} seconds`;
    sendMessage(target, context, msg);
  }
}

/**
 * 
 *  CUSTOM FUNCTIONS
 * 
 */
//playScareSound function
function playScare(delay){
  //Vielleicht Auslagerung Nötig bei zu vielen Datein
  var max = 0;
  var min = 1;
  // ließt die Anzahl der Datein im Ordner
  fs.readdir(__dirname + "/sound", (err, files) => {
    files.forEach(file => {
      max ++;
    })
  })

  if(delay === undefined) delay = 0;

  setTimeout(()=>{
    player.play(`./sound/${Math.floor(Math.random() * (max - min + 1)) + min}.mp3`, (err) => {
      if(err) console.log("Could not play Sound: " + err);
    });
  }, delay * 1000);
}

//Dealy Function
setInterval(() => {
if(reduceTimeoutBool == true) timeout--;
if(delay == 0) reduceTimeoutBool = false;
},1000)



/**
 * 
 * HELPER FUNCTION
 * 
 */
// Helper function to send the correct type of message:
function sendMessage (target, context, message) {
  if (context['message-type'] === 'whisper') {
    client.whisper(target, message)
  } else {
    client.say(target, message)
  }
}


// Create a client with our options:
let client = new tmi.client(opts)

/**
 * 
 *  REGISTER EVENT HANDLERS
 * 
 */
// Register our event handlers (defined below):
client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)
client.on('disconnected', onDisconnectedHandler)

// Connect to Twitch:
client.connect()

/**
 * 
 *  EVENT HANDLERS
 * 
 */
// Called every time a message comes in:
function onMessageHandler (target, context, msg, self) {
  if (self) { return } // Ignore messages from the bot

  // This isn't a command since it has no prefix:
  if (msg.substr(0, 1) !== commandPrefix) {
    console.log(`[${target} (${context['message-type']})] ${context.username}: ${msg}`)
    return
  }

  // Split the message into individual words:
  const parse = msg.slice(1).split(' ')
  // The command name is the first (0th) one:
  const commandName = parse[0]
  // The rest (if any) are the parameters:
  const params = parse.splice(1)

  // If the command is known, let's execute it:
  if (commandName in knownCommands) {
    // Retrieve the function by its name:
    const command = knownCommands[commandName]
    // Then call the command with parameters:
    command(target, context, params)
    console.log(`* Executed ${commandName} command for ${context.username}`)
  } else {
    console.log(`* Unknown command ${commandName} from ${context.username}`)
  }
}

// Called every time the bot connects to Twitch chat:
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`)
  client.say(botName, joinMessage);
}
// Called every time the bot disconnects from Twitch:
function onDisconnectedHandler (reason) {
  console.log(`Disconnected: ${reason}`)
  process.exit(1)
}

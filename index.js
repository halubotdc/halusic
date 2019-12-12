const dotenv = require('dotenv');
const config = require('./config.json');
const Discord = require('discord.js');
const fs = require('fs');
const Queue = require('./extras/queue.js')

const client = new Discord.Client();
client.commands = new Discord.Collection();

let music = new Queue();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

dotenv.load();

for (const file of commandFiles){
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log(`Mikasa Bot Online`);
    console.log(`Logged in as ${client.user.tag}!`);
  });


client.on('message', async msg => {

  //separate the command into prefix|command|args...
  if (msg.author.bot) return;
  if (msg.content.indexOf(config.prefix) !== 0) return;
  const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName)

  try{
    console.log("Command sent: " + commandName)
    command.execute(msg, args, music)
  } catch (error){
    msg.channel.send(`Command $${commandName} not found. Need help? Use $help.`)
    console.log(error)
  }

});

client.login(process.env.TOKEN)

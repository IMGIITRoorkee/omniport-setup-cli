#!/usr/bin/env node
const chalk = require('chalk')
//const clear = require('clear')
const figlet = require('figlet')
const yargs = require("yargs")
const cp = require('child_process')
const inquirer = require("inquirer")
const D = require("./development.js")
const P = require("./production.js")
const start = require('./start.js')
const log = console.log
const arg = process.argv
const options = yargs
.usage('Usage: $0 <command> [options]')
.command('start', 'Setup Omniport services and start the servers ')
.command('setup', 'Setup Omniport Docker')
.alias('h', 'help')
.alias('v', 'version')
.argv

log(
  chalk.keyword('blue').bold(
    figlet.textSync('Omniport', { font:'Colossal', horizontalLayout: 'fitted' })
  )
)
if(arg[2]==undefined){
  log('Omniport is a portal for educational institutes, designed from the ground up to be extensible, customizable, performant and powerful. Omniport also comes with a powerful collection of apps and is simple enough for you to be able to write your own.\nSee \'omniport --help\' for using this tool.')
}
else if(arg[2]=='setup'&& arg[3]==undefined){
  //log('setup') 
  inquirer
    .prompt([
      {
        name: "choice",
        type: "list",
        message: "Let\'s get you started with Omniport. Make sure you\n \u2022 Are in the folder where you want to clone/ have cloned Omniport-Docker Repository\n \u2022 Have Docker and Docker-Compose installed\n \u2022 Docker Daemon is running\n You can use Ctrl+C to exit anytime. Choose what fits you the best:",
        choices: ["Development Setup", "Production Setup"],
      },
    ])
    .then((answer) => {
      if(answer.choice == "Development Setup"){
        D.SetUp()
      }
      else{
        P.SetUp()
      }
    })
}
else if(arg[2]=='start' && arg[3]==undefined){
  start.Backend().then( (port) => {
    start.Frontend(port)
  })
}
else{
  cp.spawn('omniport', ['-h'], { stdio: 'inherit'})
}
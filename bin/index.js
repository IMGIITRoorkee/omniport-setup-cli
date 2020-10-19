#!/usr/bin/env node
const chalk = require('chalk')
//const clear = require('clear')
const figlet = require('figlet')
const yargs = require("yargs")
const inquirer = require("inquirer")
const D = require("./development.js")
const P = require("./production.js")
const log = console.log
const options = yargs
.usage('Usage: $0 <command> [options]')
.command('start', 'Setup Omniport services and start the servers ')
.help('h')
.alias('h', 'help')
.alias('v', 'version')
.argv

log(
  chalk.keyword('blue').bold(
    figlet.textSync('Omniport', { horizontalLayout: 'fitted' })
  )
)

inquirer
  .prompt([
    {
      name: "choice",
      type: "list",
      message: "Let\'s get you started with Omniport. Make sure you have Docker and Docker-Compose installed and daemon is running. Choose what fits you the best:",
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
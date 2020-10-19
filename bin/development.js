const log = console.log
const fs = require('fs')
const cp = require('child_process')
const inquirer = require("inquirer")
const chalk = require('chalk')
module.exports = {
    SetUp: async () => {
        let cloneYN = await inquirer
            .prompt([{
                name: "cloneornot",
                type: "confirm",
                message: "Do you want to clone Omniport Frontend and Backend Repository:",
            }])

        let Nfolder = cloneYN.cloneornot;
        let answer;
        if(!Nfolder){
            answer = await inquirer
            .prompt([{
                name: "cloneHere",
                type: "input",
                message: "Enter the path of Omniport-Docker folder:",
            }])
        }
        while(Nfolder){
            answer = await inquirer
            .prompt([{
                name: "cloneHere",
                type: "input",
                message: "Where would you like to clone Omniport-Docker Repository:",
            }])
            Nfolder = await !fs.existsSync(answer.cloneHere)
            if(Nfolder){
                log('Enter a folder path.')
                continue
            }
            try{
                cp.execSync("git clone https://github.com/IMGIITRoorkee/omniport-docker.git", {cwd: answer.cloneHere})
                cp.spawnSync('./scripts/clone/everything.sh', [], {cwd: answer.cloneHere+'/omniport-docker/', stdio: 'inherit'})         
            }catch{
                log(chalk.keyword('red')('Check your Internet Connection or permissions of the folder'))
                Nfolder = true
            }
        }

        log('Building images for Omniport.')
        let build = await inquirer
            .prompt([{
                name: 'ifbuild',
                type: 'confirm',
                message: 'Build Omniport-django images?'
            }])
        if(build.ifbuild){
            cp.spawnSync('./scripts/build/django.sh', [], {cwd: answer.cloneHere+'/omniport-docker/', stdio: 'inherit'})
        }
        build = await inquirer
            .prompt([{
                name: 'ifbuild',
                type: 'confirm',
                message: 'Build Omniport-react images?'
            }])
        if(build.ifbuild){
            cp.spawnSync('./scripts/build/react.sh', [], {cwd: answer.cloneHere+'/omniport-docker/', stdio: 'inherit'})
        }
        /*build = await inquirer
            .prompt([{
                name: 'ifbuild',
                type: 'confirm',
                message: 'Build Omniport-nginx images?'
            }])
        if(build.ifbuild){
            cp.spawnSync('./scripts/build/nginx.sh', [], {cwd: answer.cloneHere+'/omniport-docker/', stdio: 'inherit'})
        }
        build = await inquirer
            .prompt([{
                name: 'ifbuild',
                type: 'confirm',
                message: 'Build Omniport-memchaced images?'
            }])
        if(build.ifbuild){
            cp.spawnSync('./scripts/build/memcached.sh', [], {cwd: answer.cloneHere+'/omniport-docker/', stdio: 'inherit'})
        }*/
        build = await inquirer
            .prompt([{
                name: 'ifbuild',
                type: 'confirm',
                message: 'Build Omniport-rabbitmq images?'
            }])
        if(build.ifbuild){
            cp.spawnSync('./scripts/build/rabbitmq.sh', [], {cwd: answer.cloneHere+'/omniport-docker/', stdio: 'inherit'})
        }
        build = await inquirer
            .prompt([{
                name: 'ifbuild',
                type: 'confirm',
                message: 'Build Omniport-postgres images?'
            }])
        if(build.ifbuild){
            cp.spawnSync('./scripts/build/postgres.sh', [], {cwd: answer.cloneHere+'/omniport-docker/', stdio: 'inherit'})
        }
        build = await inquirer
            .prompt([{
                name: 'ifbuild',
                type: 'confirm',
                message: 'Build Omniport-redis images?'
            }])
        if(build.ifbuild){
            cp.spawnSync('./scripts/build/redis.sh', [], {cwd: answer.cloneHere+'/omniport-docker/', stdio: 'inherit'})
        }
        build = await inquirer
            .prompt([{
                name: 'ifbuild',
                type: 'confirm',
                message: 'Set up Omniport services?'
            }])
        if(build.ifbuild){
            cp.spawnSync('./scripts/start/development.sh', [], {cwd: answer.cloneHere+'/omniport-docker/', stdio: 'inherit'})
            log(chalk.keyword('orange')('Congrats!'),'Omniport is all set and ready to roll.')
        }
        log('Refer to official docs to learn more about Omniport. https://omniport.readthedocs.io/')
    }
}
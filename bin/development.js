const log = console.log
const fs = require('fs')
const yaml = require('js-yaml')
const cp = require('child_process')
const inquirer = require("inquirer")
const chalk = require('chalk')
const dotenv = require('dotenv')
const backendConfig = require('./backendConfig.js')
const backendSiteConfig = require('./backendSiteConfig.js')
module.exports = {
    SetUp: async () => {
        let opt = {
            shell: true, 
            cwd: './omniport-docker/', 
            stdio: 'inherit',
        }
        let CloneError = true;
        while (CloneError) {
            let cloneYN = await inquirer
                .prompt([{
                    name: "cloneornot",
                    type: "confirm",
                    message: "Do you want to clone Omniport Frontend and Backend Repository:",
                }])

            CloneError = cloneYN.cloneornot;
            if(CloneError){ 
                try{
                    cp.execSync("git clone https://github.com/IMGIITRoorkee/omniport-docker.git")
                    cp.spawnSync('./scripts/clone/everything.sh', [], opt)         
                    CloneError = false
                }catch{
                    log(chalk.keyword('red')('Check your Internet Connection or permissions of the folder'))
                }
            }
            
            try{
                cp.execSync('cd ./omniport-docker/')
            }catch{
                CloneError = true
                log(chalk.keyword('red')('You need to first clone Omniport-Docker Repository'))
            }

            if(!CloneError){
                log('Building images for Omniport...')
                let base
                let build = await inquirer
                    .prompt([{
                        name: 'ifbuild',
                        type: 'confirm',
                        message: 'Build Omniport-django images?'
                    }])
                if(build.ifbuild){
                    cp.spawnSync('./scripts/build/django.sh', [], opt)
                }
                build = await inquirer
                    .prompt([{
                        name: 'ifbuild',
                        type: 'confirm',
                        message: 'Build Omniport-react images?'
                    }])
                if(build.ifbuild){
                    cp.spawnSync('./scripts/build/react.sh', [], opt)
                }
                build = await inquirer
                    .prompt([{
                        name: 'ifbuild',
                        type: 'confirm',
                        message: 'Build Omniport-nginx images?'
                    }])
                if(build.ifbuild){
                    cp.spawnSync('./scripts/build/nginx.sh', [], opt)
                }
                build = await inquirer
                    .prompt([{
                        name: 'ifbuild',
                        type: 'confirm',
                        message: 'Build Omniport-memchaced images?'
                    }])
                if(build.ifbuild){
                    cp.spawnSync('./scripts/build/memcached.sh', [], opt)
                }
                build = await inquirer
                    .prompt([{
                        name: 'ifbuild',
                        type: 'confirm',
                        message: 'Build Omniport-rabbitmq images?'
                    }])
                if(build.ifbuild){
                    let doc = yaml.safeLoad(fs.readFileSync('./omniport-docker/docker-compose.yml'))
                    if(fs.existsSync('./omniport-docker/codebase/omniport-backend/configuration/base.yml')){
                        base = yaml.safeLoad(fs.readFileSync('./omniport-docker/codebase/omniport-backend/configuration/base.yml'))
                    }
                    else{
                        base = yaml.safeLoad(fs.readFileSync('./omniport-docker/codebase/omniport-backend/configuration/base_stencil.yml'))
                    }
                    cp.spawnSync('./scripts/build/rabbitmq.sh', [], opt)
                    let msgenv = dotenv.config({path: './omniport-docker/rabbitmq/message_broker.env'})
                    fs.writeFileSync('./omniport-docker/docker-compose.yml', yaml.safeDump(doc), (err) => {
                        if (err) {
                            log(chalk.keyword('red')('Some error ocurred.'))
                        }
                    })
                    base.services.messageBroker.host = 'message-broker'
                    base.services.messageBroker.port = 5672
                    base.services.messageBroker.password = msgenv.parsed.RABBITMQ_DEFAULT_PASS
                    base.services.messageBroker.user = msgenv.parsed.RABBITMQ_DEFAULT_USER
                    fs.writeFileSync('./omniport-docker/codebase/omniport-backend/configuration/base.yml', yaml.safeDump(base), (err)=>{
                        if (err) {
                            log(chalk.keyword('red')('Some error ocurred.'))
                        }
                    })
                }
                build = await inquirer
                    .prompt([{
                        name: 'ifbuild',
                        type: 'confirm',
                        message: 'Build Omniport-postgres images?'
                    }])
                if(build.ifbuild){
                    let doc = yaml.safeLoad(fs.readFileSync('./omniport-docker/docker-compose.yml'))
                    if(fs.existsSync('./omniport-docker/codebase/omniport-backend/configuration/base.yml')){
                        base = yaml.safeLoad(fs.readFileSync('./omniport-docker/codebase/omniport-backend/configuration/base.yml'))
                    }
                    else{
                        base = yaml.safeLoad(fs.readFileSync('./omniport-docker/codebase/omniport-backend/configuration/base_stencil.yml'))
                    }
                    cp.spawnSync('./scripts/build/postgres.sh', [], opt)
                    let dbenv = dotenv.config({path: './omniport-docker/postgres/database.env'})
                    fs.writeFileSync('./omniport-docker/docker-compose.yml', yaml.safeDump(doc), (err) => {
                        if (err) {
                            log(chalk.keyword('red')('Some error ocurred.'))
                        }
                    })
                    base.services.database.host = 'database'
                    base.services.database.port = 5432
                    base.services.database.password = dbenv.parsed.POSTGRES_PASSWORD
                    base.services.database.user = dbenv.parsed.POSTGRES_USER
                    base.services.database.name = dbenv.parsed.POSTGRES_DB
                    fs.writeFileSync('./omniport-docker/codebase/omniport-backend/configuration/base.yml', yaml.safeDump(base), (err)=>{
                        if (err) {
                            log(chalk.keyword('red')('Some error ocurred.'))
                        }
                    })
                }
                build = await inquirer
                    .prompt([{
                        name: 'ifbuild',
                        type: 'confirm',
                        message: 'Build Omniport-Backend configuration file?'
                    }])
                if(build.ifbuild){
                    await backendConfig.buildBackendConfig()               
                }
                build = await inquirer
                    .prompt([{
                        name: 'ifbuild',
                        type: 'confirm',
                        message: 'Build Omniport-Backend site configuration file?'
                    }])
                if(build.ifbuild){
                   await backendSiteConfig.buildSiteBackendConfig()               
                }
                build = await inquirer
                    .prompt([{
                        name: 'ifbuild',
                        type: 'confirm',
                        message: 'Build Omniport-redis images?'
                    }])
                if(build.ifbuild){
                    cp.spawnSync('./scripts/build/redis.sh', [], opt)
                }
                build = await inquirer
                    .prompt([{
                        name: 'ifbuild',
                        type: 'confirm',
                        message: 'Delete all omniport docker volumes?'
                    }])
                if(build.ifbuild){
                    cp.execSync('docker-compose down', { cwd: './omniport-docker/',stdio: 'inherit'})
                    cp.execSync('docker volume rm $(docker volume ls -q | grep "omniport-docker")')
                }
                build = await inquirer
                    .prompt([{
                        name: 'ifbuild',
                        type: 'confirm',
                        message: 'Set up Omniport services?'
                    }])
                if(build.ifbuild){
                    try{
                        
                        cp.execSync('./scripts/start/development.sh', { cwd: './omniport-docker/',stdio: 'inherit'})
                        log(chalk.keyword('orange')('Congrats!'),'Omniport is all set and ready to roll.')
                    }catch{
                        log(chalk.keyword('red')('Omniport is not fully Setup.'))
                    }
                }
                log('Refer to official docs to learn more about Omniport. https://omniport.readthedocs.io/')
            }
        }
    }
}
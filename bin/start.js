const log = console.log
const cp = require('child_process')
const chalk = require('chalk')
const inquirer = require("inquirer")

module.exports = {
    Backend: async () => {
        let backend = await inquirer
            .prompt([{
                name: 'start',
                type: 'confirm',
                message: 'Start Back-end Server?'
            }])
        if(backend.start){
            let opt = {
                shell: true, 
                cwd: './omniport-docker/codebase/omniport-backend/', 
                stdio: 'inherit',
            }
            let backPort = 60000
            let startBack = true
            
            while(startBack && backPort<=60031){
                try{
                    var temp = cp.execSync('sudo lsof -i:'+backPort)
                    backPort++
                }
                catch{
                    startBack = false
                }
            }
        
            if(startBack){
                log(chalk.keyword('red')('There was some error assigning the port.'))
                return -1
            }
            else{
                cp.execSync('gnome-terminal --tab -- bash -c "./scripts/start/django.sh -p '+backPort+'; exec bash"', opt)
                await sleep(10000)
                log(chalk.keyword('red')('Wait till the backend server is up and running in the adjacent terminal tab.'))
                let migrate = await inquirer
                    .prompt([{
                        name: "migrateornot",
                        type: "confirm",
                        message: "Do you want to make migrations?",
                    }])
                if(migrate.migrateornot){
                    cp.spawnSync('docker exec '+backPort+' bash -c \'python manage.py makemigrations; python manage.py migrate; exec bash\'', [],  opt)
                }
                let create = await inquirer
                    .prompt([{
                        name: "user",
                        type: "confirm",
                        message: "Do you want to create django superuser?",
                    }])
                if(create.user){
                    log('Create Super-User using the command "python manage.py createsuperuser"')
                    cp.spawnSync('docker exec -ti 60002 sh', [], opt)
                }
                return backPort
            }
        }
        else{
            return 0
        }
    },
    
    Frontend: async (port) => {
        let frontend = await inquirer
            .prompt([{
                name: 'start',
                type: 'confirm',
                message: 'Start Front-end Server?'
            }])
        if(frontend.start){
            if(port==-1){
                log(chalk.keyword('red')('Unable to start front-end server.'))
                return
            }
            let opt = {
                shell: true, 
                cwd: './omniport-docker/codebase/omniport-frontend/', 
                stdio: 'inherit',
            }
            cp.spawnSync('sudo yarn install', { shell: true, cwd: './omniport-docker/codebase/omniport-frontend/omniport', stdio: 'inherit'})
            cp.spawnSync('sudo chmod -R 777 node_modules/', { shell: true, cwd: './omniport-docker/codebase/omniport-frontend/omniport', stdio: 'inherit'})
            log('Starting Front-end server in the adjacent tab.')
            cp.execSync('gnome-terminal --tab -- bash -c "./scripts/start/react.sh -d '+port+'; exec bash"', opt)
        }
    },
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

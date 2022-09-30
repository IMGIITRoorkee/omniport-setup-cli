const log = console.log
const cp = require('child_process')
const chalk = require('chalk')
const inquirer = require("inquirer")
let backPort = 60000

module.exports = {
    Backend: async (basepath) => {
        let backend = await inquirer
            .prompt([{
                name: 'start',
                type: 'confirm',
                message: 'Start Back-end Server?'
            }])
        if (backend.start) {
            let startBack = true
            cp.execSync(`cd ${basepath}`)
            let opt = {
                shell: true,
                cwd: basepath + '/codebase/omniport-backend/',
                stdio: 'inherit',
            }

            let port = await inquirer
                .prompt([{
                    name: "num",
                    type: "input",
                    message: "Enter port number (try default values):",
                }])
            if (port.num != "") {
                backPort = port.num
                startBack = false
            }
            else {
                while (startBack && backPort <= 60031) {
                    try {
                        var temp = cp.execSync('sudo lsof -i:' + backPort)
                        backPort++
                    }
                    catch {
                        startBack = false
                    }
                }
            }
            if (startBack) {
                log(chalk.keyword('red')('There was some error assigning the port.'))
                return -1
            }
            else {
                cp.execSync('tmux ls| grep "backend" || tmux new-session -d -s backend " ./scripts/start/django.sh -p ' + backPort + '; exec bash"', opt)
                log(chalk.keyword('red')('Wait till the backend server is up and running in background...'))
                await sleep(10000)
                log('Backend server running on port :', chalk.keyword('blue')(backPort))
                let migrate = await inquirer
                    .prompt([{
                        name: "migrateornot",
                        type: "confirm",
                        message: "Do you want to make migrations?",
                    }])
                if (migrate.migrateornot) {
                    let appmigrate = await inquirer
                        .prompt([{
                            name: "appornot",
                            type: "input",
                            message: "Enter app name (run across full project):",
                        }])
                    if (appmigrate.appornot != "") {
                        let appopt = {
                            shell: true,
                            cwd: basepath+'/codebase/omniport-backend/omniport/apps/' + appmigrate.appornot + '/',
                            stdio: 'inherit',
                        }
                        cp.spawnSync('docker exec ' + backPort + ' bash -c \'python manage.py makemigrations; python manage.py migrate; exec bash\'', [], appopt)
                    } else {
                        cp.spawnSync('docker exec ' + backPort + ' bash -c \'python manage.py makemigrations; python manage.py migrate; exec bash\'', [], opt)
                    }
                }
                let create = await inquirer
                    .prompt([{
                        name: "user",
                        type: "confirm",
                        message: "Do you want to create django superuser?",
                    }])
                if (create.user) {
                    cp.spawnSync('docker exec -ti ' + backPort + ' bash -c \' python manage.py createsuperuser;\'', [], opt)
                }
                return backPort
            }
        }
        else {
            return 0
        }
    },

    Frontend: async () => {
        let frontend = await inquirer
            .prompt([{
                name: 'start',
                type: 'confirm',
                message: 'Start Front-end Server?'
            }])
        if (frontend.start) {

            let opt = {
                shell: true,
                cwd: basepath + '/codebase/omniport-frontend/',
                stdio: 'inherit',
            }

            let package = await inquirer
                .prompt([{
                    name: 'install',
                    type: 'confirm',
                    message: 'Install packages for frontend?'
                }])
            if (package.install) {
                cp.spawnSync('sudo yarn install', { shell: true, cwd: basepath + '/codebase/omniport-frontend/omniport', stdio: 'inherit' })
                cp.spawnSync('sudo chmod -R 777 node_modules/', { shell: true, cwd: basepath + '/codebase/omniport-frontend/omniport', stdio: 'inherit' })
            }
            if (backPort == -1) {
                log(chalk.keyword('red')('Unable to start front-end server.'))
                return
            }
            frontPort = +backPort + 1000
            log('Starting Front-end server in background...')
            cp.execSync('tmux ls| grep "frontend" || tmux new-session -d -s frontend "./scripts/start/react.sh -d ' + backPort + '; exec bash"', opt)
            log('Frontend server running on port :', chalk.keyword('blue')(frontPort))
        }
    },
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

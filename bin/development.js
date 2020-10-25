const log = console.log
const fs = require('fs')
const yaml = require('js-yaml')
const cp = require('child_process')
const inquirer = require("inquirer")
const chalk = require('chalk')
const dotenv = require('dotenv')
module.exports = {
    SetUp: async () => {
        let opt = {
            shell: true, 
            cwd: './omniport-docker/', 
            stdio: 'inherit'
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
                let doc = yaml.safeLoad(fs.readFileSync('./omniport-docker/docker-compose.yml'))
                let base = yaml.safeLoad(fs.readFileSync('./omniport-docker/codebase/omniport-backend/configuration/base_stencil.yml'))
                log('Building images for Omniport...')
                let build = await inquirer
                    .prompt([{
                        name: 'ifbuild',
                        type: 'confirm',
                        message: 'Build Omniport-django images?'
                    }])
                if(build.ifbuild){
                    cp.spawnSync('./scripts/build/django.sh', [],opt)
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
                    cp.spawnSync('./scripts/build/rabbitmq.sh', [], opt)
                    let msgenv = dotenv.config({path: './omniport-docker/rabbitmq/message_broker.env'})
                    doc.services['message-broker'].user = msgenv.parsed.RABBITMQ_DEFAULT_USER
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
                    cp.spawnSync('./scripts/build/postgres.sh', [], opt)
                    let dbenv = dotenv.config({path: './omniport-docker/postgres/database.env'})
                    doc.services.database.user = dbenv.parsed.POSTGRES_USER
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
                    let ask
                    log('Simply skip by pressing Enter if you agree with the given default.')
                    base.branding.institute.acronym = 'IIT-R'
                    ask = await inquirer
                            .prompt([
                                {
                                name: "ans",
                                type: "input",
                                message: "The acronym that institute goes by:(IIT-R)",
                                },
                            ])
                    if(ask.ans != ""){
                        base.branding.institute.acronym = ask.ans
                    }
                    base.branding.institute.name = 'Indian Institute of Technology Roorkee'
                    ask = await inquirer
                            .prompt([
                                {
                                name: "ans",
                                type: "input",
                                message: "The name of the institute:(Indian Institute of Technology Roorkee)",
                                },
                            ])
                    if(ask.ans != ""){
                        base.branding.institute.name = ask.ans
                    }
                    base.branding.institute.homePage = 'https://iitr.ac.in/'
                    ask = await inquirer
                            .prompt([
                                {
                                name: "ans",
                                type: "input",
                                message: "The URL to the home page of the institute:(https://iitr.ac.in/)",
                                },
                            ])
                    if(ask.ans != ""){
                        base.branding.institute.homePage = ask.ans
                    }
                    base.branding.maintainers.acronym = 'IMG'
                    ask = await inquirer
                            .prompt([
                                {
                                name: "ans",
                                type: "input",
                                message: "The acronym that maintainers go by:(IMG)",
                                },
                            ])
                    if(ask.ans != ""){
                        base.branding.maintainers.acronym = ask.ans
                    }
                    base.branding.maintainers.name = 'Information Management Group'
                    ask = await inquirer
                            .prompt([
                                {
                                name: "ans",
                                type: "input",
                                message: "The name of the maintainers:(Information Management Group)",
                                },
                            ])
                    if(ask.ans != ""){
                        base.branding.maintainers.homePage = ask.ans
                    }
                    base.branding.maintainers.name = 'Information Management Group'
                    ask = await inquirer
                            .prompt([
                                {
                                name: "ans",
                                type: "input",
                                message: "The name of the maintainers:(Information Management Group)",
                                },
                            ])
                    if(ask.ans != ""){
                        base.branding.maintainers.name = ask.ans
                    }
                    base.branding.maintainers.homePage = 'https://channeli.in/img/'
                    ask = await inquirer
                            .prompt([
                                {
                                name: "ans",
                                type: "input",
                                message: "The URL to the home page of the maintainers:(https://channeli.in/img/)",
                                },
                            ])
                    if(ask.ans != ""){
                        base.branding.maintainers.homePage = ask.ans
                    }
                    base.i18n.languageCode = 'en-gb'
                    ask = await inquirer
                            .prompt([
                                {
                                name: "ans",
                                type: "input",
                                message: "The language code of the portal:(en-gb)",
                                },
                            ])
                    if(ask.ans != ""){
                        base.i18n.languageCode = ask.ans
                    }
                    base.i18n.timeZone = 'Asia/Kolkata'
                    ask = await inquirer
                            .prompt([
                                {
                                name: "ans",
                                type: "input",
                                message: "The time zone of the portal:(Asia/Kolkata)",
                                },
                            ])
                    if(ask.ans != ""){
                        base.i18n.timeZone = ask.ans
                    }
                    base.secrets.secretKey = '2)@2klj=@a(*o9kyt7u^!g4jbqrqo3$ju^o_g6n*lh-d$$#zdy'
                    ask = await inquirer
                            .prompt([
                                {
                                name: "ans",
                                type: "input",
                                message: "Fifty random characters for secret key:(use default)",
                                },
                            ])
                    if(ask.ans != ""){
                        base.secrets.secretKey = ask.ans
                    }
                    base.emails.emailBackend = 'django.core.mail.backends.smtp.EmailBackend'
                    ask = await inquirer
                            .prompt([
                                {
                                name: "ans",
                                type: "input",
                                message: "The backend used for sending emails:(django.core.mail.backends.smtp.EmailBackend)",
                                },
                            ])
                    if(ask.ans != ""){
                        base.emails.emailBackend = ask.ans
                    }
                    base.emails.emailHost = 'smtp.example.com'
                    ask = await inquirer
                            .prompt([
                                {
                                name: "ans",
                                type: "input",
                                message: "The email service provider used:(smtp.example.com)",
                                },
                            ])
                    if(ask.ans != ""){
                        base.emails.emailHost = ask.ans
                    }
                    ask = await inquirer
                            .prompt([
                                {
                                name: "ans",
                                type: "confirm",
                                message: "Whether an email should be encrypted via TLS or not:(Yes suggested)",
                                },
                            ])
                    base.emails.emailUseTls = ask.ans
                    base.emails.emailHostUser = 'no-reply@omniport.com'
                    ask = await inquirer
                            .prompt([
                                {
                                name: "ans",
                                type: "input",
                                message: "The email address from which all emails will be sent:(no-reply@omniport.com)",
                                },
                            ])
                    if(ask.ans != ""){
                        base.emails.emailHostUser = ask.ans
                    }
                    base.emails.emailHostPassword = 'img@password'
                    ask = await inquirer
                            .prompt([
                                {
                                name: "ans",
                                type: "password",
                                message: "The password of the host's email account:(img@password)",
                                },
                            ])
                    if(ask.ans != ""){
                        base.emails.emailHostPassword = ask.ans
                    }
                    ask = await inquirer
                            .prompt([{
                                name: 'ans',
                                type: 'confirm',
                                message: 'Set Omniport services ports?'
                            }])
                    if(ask.ans){
                        base.ipAddressRings = [{name: 'administrator', patterns: ['.*'] }]
                        base.ipAddressRings.push({name: 'administrators', patterns: ['.*'] })
                        base.ipAddressRings.push({name: 'self', patterns: ['^172\\.18\\.0\\.1$'] })
                        base.ipAddressRings.push({name: 'specifics', patterns: ['^172\\.25\\.55\\.101$', '^172\\.25\\.55\\.219$'] })
                        base.ipAddressRings.push({name: 'maintainers', patterns: ['^172\\.25\\.55\\.\\d{1}$'] })
                        base.ipAddressRings.push({name: 'intranet', patterns: ['.*'] })
                        base.ipAddressRings.push({name: 'internet', patterns: ['.*'] })
                        base.emails.emailPort = 587
                        base.services.channelLayer.host = 'channel-layer'
                        base.services.channelLayer.port = 6379
                        base.services.sessionStore.host = 'session-store'
                        base.services.sessionStore.port = 6379
                        base.services.communicationStore.host = 'communication-store'
                        base.services.communicationStore.port = 6379
                        base.services.verificationStore.host = 'verification-store'
                        base.services.verificationStore.port = 6379
                        base.services.notificationStore.host = 'notification-store'
                        base.services.notificationStore.port = 6379
                        base.services.cache.host = 'cache'
                        base.services.cache.port = 11211
                    }
                    fs.writeFileSync('./omniport-docker/codebase/omniport-backend/configuration/base.yml', yaml.dump(base, skipInvalid=true), (err)=>{
                        if (err) {
                            log(chalk.keyword('red')('Some error ocurred.'))
                        }
                    })
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
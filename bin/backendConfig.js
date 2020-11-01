const log = console.log
const fs = require('fs')
const yaml = require('js-yaml')
const cp = require('child_process')
const inquirer = require("inquirer")
const chalk = require('chalk')

module.exports = {
    buildBackendConfig: async () => {
        let base
        if(fs.existsSync('./omniport-docker/codebase/omniport-backend/configuration/base.yml')){
            base = yaml.safeLoad(fs.readFileSync('./omniport-docker/codebase/omniport-backend/configuration/base.yml'))
        }
        else{
            base = yaml.safeLoad(fs.readFileSync('./omniport-docker/codebase/omniport-backend/configuration/base_stencil.yml'))
        }
        let ask
        log('Simply skip by pressing Enter if you agree with the given default.')
        base.branding.institute.acronym = 'IIT-R'
        ask = await inquirer
                .prompt([
                    {
                    name: "ans",
                    type: "input",
                    message: " The acronym that institute goes by:(IIT-R)",
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
                    message: " The name of the institute:(Indian Institute of Technology Roorkee)",
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
                    message: " The URL to the home page of the institute:(https://iitr.ac.in/)",
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
                    message: " The acronym that maintainers go by:(IMG)",
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
                    message: " The name of the maintainers:(Information Management Group)",
                    },
                ])
        if(ask.ans != ""){
            base.branding.maintainers.homePage = ask.ans
        }
        base.branding.maintainers.homePage = 'https://channeli.in/img/'
        ask = await inquirer
                .prompt([
                    {
                    name: "ans",
                    type: "input",
                    message: " The URL to the home page of the maintainers:(https://channeli.in/img/)",
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
                    message: " The language code of the portal:(en-gb)",
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
                    message: " The time zone of the portal:(Asia/Kolkata)",
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
                    message: " Fifty random characters for secret key:(use default)",
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
                    message: " The backend used for sending emails:(django.core.mail.backends.smtp.EmailBackend)",
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
                    message: " The email service provider used:(smtp.example.com)",
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
                    message: " Whether an email should be encrypted via TLS or not:(Yes suggested)",
                    },
                ])
        base.emails.emailUseTls = ask.ans
        base.emails.emailHostUser = 'no-reply@omniport.com'
        ask = await inquirer
                .prompt([
                    {
                    name: "ans",
                    type: "input",
                    message: " The email address from which all emails will be sent:(no-reply@omniport.com)",
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
                    message: " The password of the host's email account:(img@password)",
                    },
                ])
        if(ask.ans != ""){
            base.emails.emailHostPassword = ask.ans
        }
        ask = await inquirer
                .prompt([{
                    name: 'ans',
                    type: 'confirm',
                    message: ' Set Omniport services ports?'
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
}
const log = console.log
const fs = require('fs')
const yaml = require('js-yaml')
const inquirer = require("inquirer")
const chalk = require('chalk')

module.exports = {
    buildSiteBackendConfig: async() =>{
        let site = yaml.safeLoad(fs.readFileSync('./omniport-docker/codebase/omniport-backend/configuration/sites/site_stencil.yml'))
        site.site.id = 0
        ask = await inquirer
                .prompt([
                    {
                    name: "ans",
                    type: "input",
                    message: " The id of the site:(0)",
                    },
                ])
        if(ask.ans != ""){
            site.site.id = ask.ans
        }

        site.site.nomenclature.name = 'development'
        ask = await inquirer
                .prompt([
                    {
                    name: "ans",
                    type: "input",
                    message: " A code name for the site:(development)",
                    },
                ])
        if(ask.ans != ""){
            site.site.nomenclature.name = ask.ans
        }

        site.site.nomenclature.verboseName = 'Omniport Dev'
        ask = await inquirer
                .prompt([
                    {
                    name: "ans",
                    type: "input",
                    message: " A verbose punctuated name for the site:(Omniport Dev)",
                    },
                ])
        if(ask.ans != ""){
            site.site.nomenclature.verboseName = ask.ans
        }

        site.site.debug = true
        ask = await inquirer
                .prompt([
                    {
                    name: "ans",
                    type: "confirm",
                    message: " Boolean that decides whether the site is in production or development:(yes for development)",
                    },
                ])
        if(ask.ans != ""){
            site.site.debug = ask.ans
        }

        site.site.description = 'Development site for Omniport'
        ask = await inquirer
                .prompt([
                    {
                    name: "ans",
                    type: "input",
                    message: " String that describes the site:(Development site for Omniport)",
                    },
                ])
        if(ask.ans != ""){
            site.site.description = ask.ans
        }
        site.allowances.hosts = ['localhost']
        site.allowances.apps = '__all__'
        site.allowances.ipAddressRings = ['self', 'specifics', 'administrators', 'administrator', 'maintainers', 'intranet', 'internet']

        fs.writeFileSync('./omniport-docker/codebase/omniport-backend/configuration/sites/site_'+ site.site.id +'.yml', yaml.dump(site, skipInvalid=true), (err)=>{
            if (err) {
                log(chalk.keyword('red')('Some error ocurred.'))
            }
        })
    }
}
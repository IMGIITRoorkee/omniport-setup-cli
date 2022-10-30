const log = console.log
const chalk = require('chalk')
const cp = require('child_process')

module.exports = {
    Backend: async (basepath) => {
        try {
            cp.execSync("ps -ef | grep '/omniport/manage.py runserver' | grep -v grep | awk '{ print $2; }' | xargs kill -${2:-'TERM'} 2> /dev/null", { cwd: basepath, stdio: 'inherit' })
            cp.execSync("tmux kill-session -t backend", { cwd: basepath, stdio: 'inherit' })
            log('Backend server stopped successfully')
        } 
        catch (error) {
            log(chalk.keyword('red')('No backend server running!'))
        }    
    },

    Frontend: async () => {
        try {
            cp.execSync("ps -ef | grep '/omniport/node_modules/' | grep -v grep | awk '{ print $2; }' | xargs kill -${2:-'TERM'} 2> /dev/null", { cwd: basepath, stdio: 'inherit' })
            cp.execSync("tmux kill-session -t frontend", { cwd: basepath, stdio: 'inherit' })
            log('Frontend server stopped successfully')
        } 
        catch (error) {
            log(chalk.keyword('red')('No frontend server running!'))
        }
    },
}

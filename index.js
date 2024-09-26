const { Client } = require("discord.js-selfbot-v11"),
    client = new Client()

const config = require('./config')
const colors = require("coloureds-dev");
const setcolor = require("gradient-string");
client.cachedUsers = []

async function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

client.on('error', e => console.log(e))
client.on('warn', w => console.log(w))
process.on('uncaughtException', (e) => console.log(e))
process.on('unhandledRejection', (e) => console.log(e))

async function run() {
    console.clear()
    console.log(`${colors.yellow('DEBUG')} | ${colors.magenta('Starting...')}`);

    client.on('ready', async() => {
        console.log(`                                                                                               
                       ▀████▄     ▄███▀                                         ▀███▀▀▀██▄ ▀████▀████▀   ▀███▀
                         ████    ████                                             ██    ▀██▄ ██   ▀██     ▄█  
                         █ ██   ▄█ ██ ▀██▀   ▀██▀███▄███  ▄██▀██▄▀████████▄       ██     ▀██ ██    ██▄   ▄█   
                         █  ██  █▀ ██   ██   ▄█   ██▀ ▀▀ ██▀   ▀██ ██    ██       ██      ██ ██     ██▄  █▀   
                         █  ██▄█▀  ██    ██ ▄█    ██     ██     ██ ██    ██       ██     ▄██ ██     ▀██ █▀    
                         █  ▀██▀   ██     ███     ██     ██▄   ▄██ ██    ██       ██    ▄██▀ ██      ▄██▄     
                       ▄███▄ ▀▀  ▄████▄   ▄█    ▄████▄    ▀█████▀▄████  ████▄   ▄████████▀ ▄████▄     ██      
                                        ▄█                                                                    
                                      ██▀                                                                     
                                                                                                        
        > ${client.user.tag}`.brightCyan)

        while (true) { 
            for (const guild of await client.guilds.array()) {
                let members = guild.members.filter((x) => x.id !== client.user.id).map(m => m)

                if (!members) {
                    console.log(`No members loaded in ${colors.bold(guild.name)}. Waiting 4s to reload cache, and checking the next server.`.red)
                    await sleep(4000)
                }

                console.log(`Sending message to ${guild.members.size} members on server ${guild.name}`.blue);

                for (const member of members.values()) {

                    const already = client.cachedUsers.includes(member.id)
                    if (already) {
                        console.log(`[SKIP] ${member.user.tag} has been skiped - The message has already sended.`.yellow);
                        continue;
                    }

                    const response = await member.send(config.message).catch((err) => {
                        if (err.code == 500 || err.message == "Request to use token, but token was unavailable to the client") {
                            console.log(`The token of account ${client.user.tag} has died - Change! x.x`.brightRed);
                            return process.exit();
                        }
                        return null;
                    })

                    if (!response) continue

                    console.log(`Message sended to user ${colors.bold.green(member.user.tag)} of server ${colors.bold.green(guild.name)}.`)

                    client.cachedUsers.push(member.id)
                    await sleep(config.cooldown * 1000)
                }
            }
        }
    })

    client.login(config.token)
}

run()
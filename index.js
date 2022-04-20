require('dotenv').config()

const { Client, Intents, MessageEmbed } = require('discord.js');

const fs = require('fs')

const client = new Client(
    { intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] }
);

function check(id, member, guild){
    fs.readFile('Information/whitelist.txt', "utf8", function (err, data){
        let whitelist = data.split(":");
        let pass = false
        for (let i = 0; i < whitelist.length; i++) {
            if (whitelist[i] == id) {
                pass = true
            }
        }
        if (pass == false){
            member.send({
                embeds: [{
                  title: 'ERROR',
                  description: 'You currently are not whitelisted in **' + guild.name + '**  server, So you have been kicked. To be whitelisted, please contact the owner of the server.',
                  timestamp: new Date(),
                  footer: {
                      text: 'Server Moderator, Created by User Unavailable#6924'
                  },
                  fields: [
                    {
                        name: 'Server Owner',
                        value: 'User Unavailable#6924',
                        inline: true,
                    },
                    {
                        name: 'Server Owner Id',
                        value: '572570660417830912',
                        inline: true,
                    },
                ],
                }]
              })
              .catch(() => console.log("CANNOT DM USER"));
            setTimeout(function(){ 
                member.kick()
             }, 1000);
        }else{
            
        }
    })
}

function kick(memberid, msg){
    client.users.fetch(memberid, false).then((member) => {
        member.send({
            embeds: [{
            title: 'ERROR',
            description: 'You have been removed from the whitelist in **' + msg.guild.name + '**, So you have been kicked. To be re-whitelisted, please contact the owner of the server.',
            timestamp: new Date(),
            footer: {
                text: 'Server Moderator, Created by User Unavailable#6924'
            },
            fields: [
                {
                    name: 'Server Owner',
                    value: 'User Unavailable#6924',
                    inline: true,
                },
                {
                    name: 'Server Owner Id',
                    value: '572570660417830912',
                    inline: true,
                },
            ],
        }]
      })
      .catch(() => console.log("CANNOT DM USER"));
      setTimeout(function(){ 
        msg.guild.members.cache.get(memberid).kick()
     }, 1000);
    });
}

function remove(msgparts, msg){
    fs.readFile('Information/whitelist.txt', "utf8", function (err, data){
        let whitelist = data.split(":");
    for (let i = 0; i < whitelist.length; i++) {
        if (whitelist[i] == msgparts[1]) {
            whitelist.splice(i,1)
        }
    }
    let remain = ""
    for (let i = 0; i < whitelist.length; i++) {
        remain = remain + whitelist[i] + ':'
    }
    fs.writeFileSync("Information/whitelist.txt", remain)
    msg.channel.send({
        embeds: [{
          title: 'Removed',
          description: '<@' + msgparts[1] + '> Has been removed from the blacklist.',
          timestamp: new Date(),
          footer: {
              text: 'Server Moderator, Created by User Unavailable#6924'
          },
          fields: [
            {
                name: 'ACTION',
                value: 'Remove From Whitelist',
                inline: true,
            },
            {
                name: 'User Removed',
                value: '<@' + msgparts[1] + '>',
                inline: true,
            },
        ],
        }]
      })
      .catch(() => console.log("CANNOT DM USER"));
    })
    kick(msgparts[1], msg)
}

function add(msgparts, msg){
    fs.readFile('Information/whitelist.txt', "utf8", function (err, data){
    fs.writeFileSync("Information/whitelist.txt", data + msgparts[1] + ':')
    msg.channel.send({
        embeds: [{
          title: 'Whitelisted',
          description: '<@' + msgparts[1] + '> Has been added to the whitelist.',
          timestamp: new Date(),
          footer: {
              text: 'Server Moderator, Created by User Unavailable#6924'
          },
          fields: [
            {
                name: 'ACTION',
                value: 'User Added To Whitelist.',
                inline: true,
            },
            {
                name: 'User Added',
                value: '<@' + msgparts[1] + '>',
                inline: true,
            },
        ],
        }]
      })
      .catch(() => console.log("CANNOT DM USER"));
    })
}

client.on('ready', function(e){
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('guildMemberAdd', member => {
    check(member.id, member, member.guild)
});

client.on("message", msg => {
    let msgparts = msg.content.split(' ')
    if (msg.author.id == '572570660417830912'){
        if (msgparts[0] === '!check') {
            msg.reply("pong");
          }else if(msgparts[0] === '!whitelist') {
              add(msgparts,msg)
          }else if(msgparts[0] === '!blacklist') {
              remove(msgparts,msg)
          }
    }
  })

client.login("")
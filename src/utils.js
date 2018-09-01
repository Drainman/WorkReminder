/**************************************************/
/***************** CLASS : UTILS ******************/
/**************************************************/
const Discord = require('discord.js');
const PATH_HELP_FILE = './command.txt';
fs = require('fs')


class Utils {
    
    /**
     * @desc Valid the date's format - DD/MM/AAAA
     * @param String dateFormat The date to test
     */
    static date_validator(dateFormat)
    {
        var matchDate = dateFormat.match('^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$');
        if(matchDate != null)
        {
            var matchSplit = dateFormat.split('/');
            if(matchSplit[0] <= 31 && matchSplit[1] <= 12)
                return true;
            else
                return false;
        }
        return false;
    }

    /**
     * @desc Build a date with the format DD/MM/AAAA
     * @param String date_str The date to convert
     * @return Date ~ Date convert in object Date.
     */
    static build_date(date_str)
    {
        var dateSplit = date_str.split('/');
        return new Date(dateSplit[2],dateSplit[1]-1,dateSplit[0]);
        
    }
    
    
    /**
     * @desc Display a log message.
     * @param String type Type of message (INFO, ERROR, WARNING ...)
     * @param String str Message corpse
     */
    static logMsg(type,str)
    {
        console.log("["+type+"] - "+str)
    }
    
    
    /**
     * @desc Find the role according the id passed and message content.
     * @param Message msg Origin Message
     * @param String roleId Id role to finds
     * @return ~ Role if it is find, else false
     */
    static getRoleById(msg,roleId)
    {
        if(msg.mentions != undefined)
            if(msg.mentions.roles != undefined)
                if(msg.mentions.roles.has(roleId))
                    return msg.mentions.roles.get(roleId);
        
        return false;
    }
    
    /**
     * @desc Build & send en message according HomeWork passed
     * @param User user the user who call this function
     * @param Array hwToRemind Contains as key the id of homework and value, the homework
     * @param Client client the Discord Client
     */
    static remind(user,hwToRemind,client)
    {
        var embedFields = [];
        for (var id in hwToRemind){
        //id -> key
            if(hwToRemind.hasOwnProperty(id))
            {
                var hwname = hwToRemind[id].name +"- ["+id+"]";
                var hwvalue = ":alarm_clock: - "+ hwToRemind[id].dateLim.toDateString();
                embedFields[embedFields.length] = { name : hwname, value : hwvalue};
            }
                
        }
        
        
        var myEmbed =   {embed: {
            color: 0x596CBA,
            author: {
              name: user.username,
              icon_url: user.avatarURL
            },
            title: "Dead Lines Incoming ! ",
            description: "Are you bored ? Cause you have some work to do ! :smiling_imp:",
            fields: embedFields,
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: "© DromueBot"
            }
          }
        };
        
        user.send(myEmbed)
    }
    
    /**
     * @desc Build & send en message according HomeWork passed
     * @param Role role the role used to call this function
     * @param Array hwToRemind Contains as key the id of homework and value, the homework
     * @param Client client the Discord Client
     */
    static remindRole(role,hwToRemind,client)
    {       
        var embedFields = [];
        for (var id in hwToRemind){
        //id -> key
            if(hwToRemind.hasOwnProperty(id))
            {
                var hwname = hwToRemind[id].name +"- ["+id+"]";
                var hwvalue = ":alarm_clock: - "+ hwToRemind[id].dateLim.toDateString();
                embedFields[embedFields.length] = { name : hwname, value : hwvalue};
            }
                
        }
        
        
        var myEmbed =   {embed: {
            color: 0x596CBA,
            author: {
              name: client.username,
              icon_url: client.avatarURL
            },
            title: "Dead Lines Incoming ! ",
            description: "Hey "+ role.toString() +"!\nAre you bored ? Cause you have some work to do ! :smiling_imp:",
            fields: embedFields,
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: "© DromueBot"
            }
          }
        };
        
        var defaultChan = this.findDefaultChan(role.guild)
        defaultChan.send(myEmbed)
        
    }
    
    /**
     * @desc Find a default channel of a Guild.
     * @param Guild guild the guild we look for a default chan.
     */
    static findDefaultChan(guild)
    {
        // get "original" default channel
          if(guild.channels.has(guild.id))
            return guild.channels.get(guild.id)
        
          // Check for a "general" channel, which is often default chat
          if(guild.channels.exists("name", "general"))
            return guild.channels.find("name", "general");
          // Now we get into the heavy stuff: first channel in order where the bot can speak
          // hold on to your hats!
          return guild.channels
           .filter(c => c.type === "text" &&
             c.permissionsFor(guild.client.user).has("SEND_MESSAGES"))
           .sort((a, b) => a.position - b.position ||
             Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber())
           .first();
    }
    
    /**
     * @desc Notice the user and close application
     * @param Message msg Origine msg (contain author)
     * @param Client client Discord client
     */
    static closeApplication(msg,client)
    {
        var myEmbed =   {
            embed: {
                color: 0xFF0090,
                author: {name: client.username,icon_url: client.avatarURL},
                title: "[FATAL SUCCESS]",
                description: "The BOT don't gonna give your work anymore :sob:",
                image : {url : "https://zippy.gfycat.com/SpecificTameAustralianfurseal.gif"},
                timestamp: new Date(),
                footer: {icon_url: client.user.avatarURL,text: "© DromueBot"}
            }
        };            
        msg.reply(myEmbed);
        client.destroy();
        this.logMsg("INFO","[STOP] - Application stoping.") 
        //Short wait before close application and be shure the user has been notice
        setTimeout(function() {process.exit(0)},1500);
    }
    
    
    /**
     * @desc This function is call when a user try to close the application but don't have permission
     * @param Message msg Origine msg (contain author)
     * @param Client client Discord client
     */
    static noCloseApplication(msg,client)
    {
        var myEmbed =   {
            embed: {
                color: 0xFF0090,
                author: {name: client.username,icon_url: client.avatarURL},
                title: "[FATAL ERROR] - Universe will be destroy !",
                description: "Ah ! You have believed that ! :smiling_imp: \nYou're so cute...",
                image : {"url": "https://image-cdn.neatoshop.com/styleimg/43563/none/charcoal/default/300604-19;1458871576i.jpg"},
                timestamp: new Date(),
                footer: {icon_url: client.user.avatarURL,text: "© DromueBot"}
              }
            };            
            msg.reply(myEmbed);
    }
    
    
    /**
     * @desc Send the bot's manual to the author of the message
     * @param Message msg Origine msg (contains author)
     * @param Client client Discord client
     */
    static sendHelp(msg,client)
    {
        fs.readFile(PATH_HELP_FILE, 'utf8', function (err,data) {
            if (err) {return console.log(err);}
            msg.reply('```'+data+'```');
            });
    }
    
}


exports.Utils = Utils;


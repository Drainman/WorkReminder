/**************************************************/
/************ CLASS : MSGINTERPRETER **************/
/**************************************************/

/******* INCLUDES *******/
var Homework = require('./homework.js').Homework;
var Utils = require('./utils.js').Utils;
var Schedule = require('./Schedule.js').Schedule;
var PersonalSchedule = require('./PersonalSchedule.js').PersonalSchedule;
var GroupSchedule = require('./GroupSchedule.js').GroupSchedule;
const Discord = require('discord.js');

//CLASS MsgInterpreter
class MsgInterpreter {
    
    /**
     * @desc Constructor
     * @param Client client discord
     */
    constructor(client)
    {
        this.client = client;
        this.allSchedule = [];
    }
    
    
    /**
     * @desc Interpret a command and execute according functions.
     * COMMAND TYPE
     * ---------------- PERSONAL COMMAND ----------------
     * - !add_hw [name] ~ DD/MM/AAAA ~ [PRIORITY] -> Add a homework.
     * - !set_description [ID] ~ [DESC] -> Add a description for homework [ID]
     * - !consult_hw [OPTIONAL_ID] -> Consult my homework.
     * - !del_hw [ID] -> Delete a homework.
     * 
     * ------------------ ROLE COMMAND ------------------
     * - !add_hw_g [ROLE] ~ [name] ~ DD/MM/AAAA ~  [PRIORITY] -> Add a homework for the groupe [GROUP].
     * - !set_description [ROLE] ~ [ID] ~ [DESC] -> Add a description for homework [ID]
     * - !consult_hw_g [ROLE] ~ [OPTIONAL ID] -> Consult group homework.
     * - !del_hw_g [ROLE] ~ [ID] -> Delete a group homework.
     * 
     * ---------------------- NOTES ----------------------
     * [ROLE] is an object Role of Discord API (reprensent by @example )
     * 
     * @param Message msg The msg to interpret.
     * @return boolean ~ True if a command has been execute, else false.
     */
    interpretCommand(msg){}    
    
    /**
     * @desc Add a schedule in the schedule list of the Interpreter.
     * @param groupOrUser A User or Role object to Discord.
     * @param schedule contains all homeworks for the group or User give with
     * key -> idUserOrGroupe ; value -> a schedule
     * 
     */
    addSchedule(groupOrUser,schedule){this.allSchedule[groupOrUser] = schedule;}
    
    /**
     * @desc Build an feedBack for the author of the message according the type and other parameters.
     * @param Message msg The message we must feed back
     * @param String type Can be "error","warning" or "info" (default)
     * @param String fbTitle Title of the FeedBack
     * @param String fbdescription Description of the FeedBack
     * @param String fbtext Main text of the FeedBack
     * @return boolean false if type = "error" else true
     */
    embebMediumMessage(msg,type,fbTitle,fbdescription,fbtext)
    {
            if(type == "error")
                var myColor =0xD45C00;
            else if(type == "warning")
                var myColor = 0x62AE00
            else
                var myColor = 0x596CBA;
            
            var myEmbed =  {embed: {
                        color: myColor ,
                        title: fbTitle,
                        description: fbdescription,
                        fields: [{
                            name: "Details",
                            value: fbtext
                          }
                        ],
                        timestamp: new Date(),
                        footer: {
                          icon_url: this.client.user.avatarURL,
                          text: "© DromueBot"
                        }
                      }
                    };
                    
            msg.reply(myEmbed);
            if(type == "error")
                return false;
            else
                return true;
    }
    
    
    /**
     * @desc Build an feedBack for the author of the message according the type and other parameters.
     * @param Message msg The message we must feed back
     * @param String type Can be "error","warning" or "info" (default)
     * @param String fbTitle Title of the FeedBack
     * @param String fbdescription Description of the FeedBack
     * @return boolean false if type = "error" else true
     */
    embebSmallMessage(msg,type,fbTitle,fbdescription)
    {
            if(type == "error")
                var myColor =0xD45C00;
            else if(type == "warning")
                var myColor = 0x62AE00
            else
                var myColor = 0x596CBA;
            
            var myEmbed =  {embed: {
                        color: myColor ,
                        title: fbTitle,
                        description: fbdescription,
                        timestamp: new Date(),
                        footer: {
                          icon_url: this.client.user.avatarURL,
                          text: "© DromueBot"
                        }
                      }
                    };
            msg.reply(myEmbed);
            if(type == "error")
                return false;
            else
                return true;
    }
    
    

}


//EXPORT CLASS
exports.MsgInterpreter = MsgInterpreter;


/*
// Create a reaction collector
const filter = (reaction, user) => reaction.emoji.name === '👌' && user.id === 'someID'
message.awaitReactions(filter, { time: 15000 })
  .then(collected => console.log(`Collected ${collected.size} reactions`))
  .catch(console.error);
*/

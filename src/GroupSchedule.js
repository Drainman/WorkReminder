/**************************************************/
/*********** CLASS : PersonalSchedule *************/
/**************************************************/

//Inheritance Class 
var Schedule = require('./Schedule.js').Schedule;

//CLASS GroupSchedule
class GroupSchedule extends Schedule {

    /**
     * @desc GroupSchedule Class Constructor.
     */
    constructor(group) 
    {
        super();
        this.group = group;
    }
    
    /**
     * @desc Build an embeded message containing all homeworks
     * @param Client client Discord Client
     * @param Message msg Message who called this functions
     * @return Embed The embed message ready to send.
     */
    getEmbedHomeWorkList(client,msg)
    {
        var myEmbed =   {embed: {
           color: 0x596CBA,
           author: {
              name:client.user.username,
              icon_url: client.user.avatarURL
            },
            title: "HomeWorks for "+ this.group.name +"." ,
            description: "Here we are homeworks for role <@&" + this.group.id +"> :scream:",
            fields: [
              {
                name: ":sob: - HomeWork List",
                value: this.buildStringHomeWorks()
              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: "© DromueBot"
            }
          }
        };
        return myEmbed;
    }

}

//EXPORT CLASS
exports.GroupSchedule = GroupSchedule;


/**************************************************/
/****************** REQUIREMENTS ******************/
/**************************************************/
var Homework = require('./homework.js').Homework;
var Utils = require('./utils.js').Utils;
var MsgInterpreter = require('./MsgInterpreter.js').MsgInterpreter;
var MsgInterpreter = require('./MsgInterpreter.js').MsgInterpreter;
var MsgInterpreterPersonal = require('./MsgInterpreterPersonal.js').MsgInterpreterPersonal;
var MsgInterpreterGroup = require('./MsgInterpreterGroup.js').MsgInterpreterGroup;
var Schedule = require('./Schedule.js').Schedule;
var PersonalSchedule = require('./PersonalSchedule.js').PersonalSchedule;
var GroupSchedule = require('./GroupSchedule.js').GroupSchedule;
var scheduleCron = require('node-schedule');
const Discord = require('discord.js');

/**************************************************/
/********************** MAIN **********************/
/**************************************************/

//IMPORTANT VARS
var commandListPersonel = ['!add_hw','!consult_hw','!del_hw','!set_description']
var commandListGroup = ['!add_hw_g','!del_hw_g','!consult_hw_g',"!set_description_g","!set_hw_default_chan"]
var allGroupSchedule = []
var allPersonalSchedule = []
var cronStr = "0 21 * * *"

//DEFS
const client = new Discord.Client();
var interpreterGroup  = new MsgInterpreterGroup(client);
var interpreterPersonal = new MsgInterpreterPersonal(client);


/**************************************************/
/***************** DISCORD CLIENT *****************/
/**************************************************/


client.on('ready', () => {
  Utils.logMsg("INFO",`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    
    var splitC = msg.content.split(' ')
    
    //Command refere to personnal request
    if(commandListPersonel.includes(splitC[0]))
        interpreterPersonal.interpretCommand(msg)
    
    //Command refere to role request
    else if(commandListGroup.includes(splitC[0]))
        interpreterGroup.interpretCommand(msg)
    
    //HELP
    else if (msg.content === '!help_hw') 
        Utils.sendHelp(msg,client)
    
    //STOP
    else if(msg.content === '!stop_hw')
    {
        if(msg.author.id != "234757425708793857") //234757425708793857
            Utils.noCloseApplication(msg,client)
        else
            Utils.closeApplication(msg,client) 
    }
  
  
});



/**************************************************/
/*************** APPLICATION START ****************/
/**************************************************/
Utils.logMsg("INFO","[START] - Application start.")
client.login('MjYwNzYwNjQ5NTA2ODgxNTM2.Dfftxw.r2MJ47YDjc_sJEBLtJiTJtR2bdc');




/**************************************************/
/****************** DAILY EVENT  ******************/
/**************************************************/

//PERSONNAL SCHEDULE
var dailyEventReminderPersonnal = scheduleCron.scheduleJob(cronStr, function(dateEvent){
    
    Utils.logMsg("INFO","[PERS] - Daily event running.")
    var dateRef = new Date(dateEvent.getUTCFullYear(),dateEvent.getMonth(),dateEvent.getDate());
    Utils.logMsg("INFO","Reference date : "+dateRef)
    
    var personnalSch = interpreterPersonal.allSchedule;
    //For all Schedule
    for (var user in personnalSch){
        //user -> key
        if(personnalSch.hasOwnProperty(user)) 
        {
            var hwToRemind = personnalSch[user].getHomeWorkByReminder(dateRef);
            if(hwToRemind.length > 0)
                Utils.remind(personnalSch[user].user,hwToRemind,client)   
        }
    }
    
});


//ROLE SCHEDULE
var dailyEventReminderRole = scheduleCron.scheduleJob(cronStr, function(dateEvent){
    
    Utils.logMsg("INFO","[ROLE] - Daily event running.")
    var dateRef = new Date(dateEvent.getUTCFullYear(),dateEvent.getMonth(),dateEvent.getDate());
    Utils.logMsg("INFO","Reference date : "+dateRef)
    
    var roleSch = interpreterGroup.allSchedule;
    //For all Schedule
    for (var group in roleSch){
        //user -> key
        if(roleSch.hasOwnProperty(group)) 
        {
            //console.log(group)
            var hwToRemind = roleSch[group].getHomeWorkByReminder(dateRef);
            if(hwToRemind.length > 0)
                Utils.remindRole(roleSch[group].group,hwToRemind,client)
        }
    }
    
});
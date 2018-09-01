/**************************************************/
/******** CLASS : MSGINTERPRETERPERSONAL **********/
/**************************************************/
var Homework = require('./homework.js').Homework;
var Utils = require('./utils.js').Utils;
var Schedule = require('./Schedule.js').Schedule;
var PersonalSchedule = require('./PersonalSchedule.js').PersonalSchedule;
var GroupSchedule = require('./GroupSchedule.js').GroupSchedule;
var MsgInterpreter = require('./MsgInterpreter.js').MsgInterpreter;
const Discord = require('discord.js');


class MsgInterpreterPersonal extends MsgInterpreter {
    
    constructor(client)
    {
        super(client);
        this.commandList = ['!add_hw','!consult_hw','!del_hw','!set_description'];
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
     * @param Message msg The message to interpret.
     * @return boolean ~ True if a command has been execute, else false.
     */
    interpretCommand(msg)
    {
        Utils.logMsg("INFO",'Personnal Command submit -> '+msg.content)
        
        var command = msg.content;
        var splitC = command.split(' ');
        var commandList = this.commandList;
        
        if(commandList.includes(splitC[0]))
        {
            
            /*********************************/
            /************ !add_hw ************/
            /*********************************/
            if(splitC[0] === '!add_hw')
            {
                //DELETE COMMAND TAG
                var parameters = msg.content.replace('!add_hw ','');
                
                //get each parameters
                var splitNameOther = parameters.split("~");
                var name = '';
                var date_str = '';
                var prio = '';
                
                //VERIF IF ALL PARAM ARE DEFINED
                if(splitNameOther[0] == undefined || splitNameOther[1] == undefined || splitNameOther[2] == undefined || splitNameOther.length > 3)
                    return this.embebMediumMessage(msg,"error","Syntax Error", ":warning: Invalid Command Syntax.","The command must be : ```!add_hw [NAME] ~ DD/MM/AAAA ~ [PRIORITY]``` \n"); 
                
                //IT's OK
                else
                {
                    name = splitNameOther[0];
                    date_str = splitNameOther[1].replace(/\s/g, '');
                    prio = splitNameOther[2].replace(/\s/g, '');
                } 
                
                
                
                //VERIF DATE
                if(Utils.date_validator(date_str))
                {
                    
                    //USER DON'T HAVE A SCHEDULE --> We create it
                    if(this.allSchedule[msg.author.id] == undefined)
                        this.allSchedule[msg.author.id] = new PersonalSchedule(msg.author);
                    
                     
                     var temp_Hw = new Homework(name,Utils.build_date(date_str),prio); //Object HomeWork
                     this.allSchedule[msg.author.id].add_homework(temp_Hw); //Add in the list
                     
                     //FEED BACK USER
                     msg.reply(this.allSchedule[msg.author.id].homeWorkList[this.allSchedule[msg.author.id].homeWorkList.length-1].getEmedReminder(this.client,msg.author,true,null));
                     return true;
                }
                
                //DATE INVALID
                else
                    return this.embebMediumMessage(msg,"error","Syntax Error", ":warning: Invalid Date given.","The Date must be : **DD**/**MM**/**AAAA** \n");
                
            }//end !add_hw
            
                        
            /*********************************/
            /********** !consult_hw **********/
            /*********************************/
            else if(splitC[0] === '!consult_hw')
            {
                
                //No homework
                if(this.allSchedule[msg.author.id] == undefined || this.allSchedule[msg.author.id].homeWorkList.length < 1 )
                    return this.embebMediumMessage(msg,"warning","No homework saved", "You don't have any homework currently.","You can add a homework with the command : \n ```!add_hw [NAME] ~ DD/MM/AAAA ~ [PRIORITY]```");
                               
                
                //No ID details
                else if(splitC.length == 1)
                    msg.reply(this.allSchedule[msg.author.id].getEmbedHomeWorkList(this.client,msg));
               
                //
                else
                {
                    if(splitC[1] >= this.allSchedule[msg.author.id].homeWorkList.length || this.allSchedule[msg.author.id].homeWorkList[splitC[1]] == undefined )
                         return this.embebSmallMessage(msg,"error","Invalid ID", "You try to access an inexistant homework.");
                         
                    else
                        msg.reply(this.allSchedule[msg.author.id].homeWorkList[splitC[1]].getEmedReminder(this.client,msg.author,false,null));
                }
                    
                return true;                
            }//end !consult_hw
            
            
            /*********************************/
            /******* !set_description ********/
            /*********************************/           
            else if(splitC[0] === '!set_description')
            {
                var parameters = msg.content.replace('!set_description ','');    
                var splitParameters = parameters.split("~");
                var id_edit = "";var desc = "";
     
                //SYNTAX VERIF
                if(splitParameters[0] == undefined || splitParameters[1] == undefined || splitParameters.length > 2)
                    return this.embebMediumMessage(msg,"error","Syntax Error", ":warning: Invalid Syntax command.","The command must be : \n ```!set_description [ID] ~ [DESC]```");
                
                
                else
                {
                    id_edit = splitParameters[0].replace(/\s/g, '');
                    desc = splitParameters[1];
                }
                    
                
                //COHERENCE VERIF
                if(this.allSchedule[msg.author.id] == undefined || this.allSchedule[msg.author.id].homeWorkList.length < 1 )
                    return this.embebMediumMessage(msg,"warning","No homework saved", "You don't have any homework currently.","You can add a homework with the command : \n ```!add_hw [NAME] ~ DD/MM/AAAA ~ [PRIORITY]```");

                
                //INVALID ID
                else if(id_edit >= this.allSchedule[msg.author.id].homeWorkList.length)
                    return this.embebSmallMessage(msg,"warning","Invalid ID", "You try to access an inexistant homework.");
                    
                
                
                //EVERYTHING IS FINE
                else
                {                    
                    this.allSchedule[msg.author.id].homeWorkList[id_edit].setDescription(desc);
                    return this.embebSmallMessage(msg,"info","HomeWork update !", "Oh, thank's more work for me. :expressionless:");
                }
                

            }//end !set_description
            
        
            /*********************************/
            /************ !del_hw ************/
            /*********************************/           
            else if(splitC[0] === '!del_hw')
            {
                var id_del = splitC[1];
                
                if(this.allSchedule[msg.author.id] == undefined || this.allSchedule[msg.author.id].homeWorkList.length < 1 )
                    return this.embebMediumMessage(msg,"warning","No homework saved", "You don't have any homework currently.","You can add a homework with the command : \n ```!add_hw [NAME] ~ DD/MM/AAAA ~ [PRIORITY]```");
                
                //INVALID ID
                else if(id_del >= this.allSchedule[msg.author.id].homeWorkList.length)
                    return this.embebSmallMessage(msg,"warning","Invalid ID", "You try to delete an inexistant homework.");
                    
                
                //EVERYTHING IS FINE
                else
                {
                    this.allSchedule[msg.author.id].homeWorkList.splice(id_del,0);
                    return this.embebSmallMessage(msg,"info","HomeWork deleted !", "Naaaah, it's doesn't matter anyway. :rolling_eyes:");
                }
                   
                     
            }//end !del_hw
            
        
        }
        
        //The command is not an interpretable command
        else
            return false;
        
    }

}


exports.MsgInterpreterPersonal = MsgInterpreterPersonal;

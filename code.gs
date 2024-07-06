class Config{
  constructor(){

    var config= SpreadsheetApp.getActiveSpreadsheet().getSheetByName("config")

    this.SESSION_LENGTH= config.getRange(1,3).getValue(); 
    this.WEEKLY_TARGET= config.getRange(2,3).getValue(); //number of sessions per week
    this.SHEET_NAME= config.getRange(3,3).getValue(); ; //the sheet to run the script on
  }

}

const CONFIG= new Config(); 


//positions of rows and columns 
const DAY_RECORD_START_ROW= 2; 

const DAY_RECORD_START_COL= 1; 
const DAY_RECORD_NUM_COL= 4; 
const DAY_RECORD_DATE_COL=1; 
const DAY_RECORD_LAST_TIME=2; //NOTE: this column MUST be formatted to Plain Text
const DAY_RECORD_DURATION=3; 
const SESSION_STATUS_POS = [2,6]; 
const WEEK_COLS=[1,8]; //index starts at 1. 1 corresponds to the 1 on the Day side and 8 to that on the week side
const SESSION_STATUS_COLS=[9,10];  //index starts at 1. "Total" and "Remaining" columns on the week side 


var records= SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME); 
var day_data= records.getRange(DAY_RECORD_START_ROW, DAY_RECORD_START_COL, (records.getLastRow()-DAY_RECORD_START_ROW+1), DAY_RECORD_NUM_COL).getValues(); 


function getCurrentTime() {
  const currentDate = new Date();
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function calculateSessionBetweenDates(date1, date2) {
  var timeDiff = Math.abs(date2 - date1); // Absolute difference in milliseconds
  var sessionDiff = (timeDiff / (1000 * 60* CONFIG.SESSION_LENGTH)); // Convert milliseconds to minutes then session
  var sessionDiff= Math.round(sessionDiff*10)/10; //round to 1dp 
  return sessionDiff;
}

function update_one_week(week, session_amount){//update one week's stat given one day's data 
  var week_names= records.getRange(DAY_RECORD_START_ROW, WEEK_COLS[1], (records.getLastRow()-DAY_RECORD_START_ROW+1), 1).getValues(); 
  var target_row=-1; 
    for (var row in week_names){
        if (week== week_names[row][0]){
          target_row= row; 
        }
    }
    if (target_row==-1){
      SpreadsheetApp.getActive().toast("Week is not listed", "Error");
      return; 
    }
    var row_index= parseInt(target_row)+2;
    var original_total= parseFloat(records.getRange(row_index, SESSION_STATUS_COLS[0]).getValue()); 
      if (isNaN(original_total)) {
        original_total = 0;
      }
    var new_total= original_total+session_amount; 
    records.getRange(row_index,SESSION_STATUS_COLS[0]).setValue(new_total);

    var original_remain= parseFloat(records.getRange(row_index, SESSION_STATUS_COLS[1]).getValue()); 
      if (isNaN(original_remain)) {
        original_remain = CONFIG.WEEKLY_TARGET;
      }
    var new_remain= original_remain-session_amount; 
    if (new_remain<0) {
        new_remain = 0;
      }
    records.getRange(row_index,SESSION_STATUS_COLS[1]).setValue(new_remain);


}



class FocusSession{
  constructor(){
  ; 
  }

  get_status(){
    return (records.getRange(SESSION_STATUS_POS[0],SESSION_STATUS_POS[1]).getValue()=="ON"); 
  }; 


  _displayPrompt() { //return bool. True: continue to stop session. False: cancel the stopping
  var ui = SpreadsheetApp.getUi();
  var result = ui.prompt("Your focus session is too SHORT. Just click OK and return to focus :) If you must, type \"I have a good reason.\" and click OK to proceed :(");
  
  //Get the button that the user pressed.
  var button = result.getSelectedButton();
  
  if ((button === ui.Button.OK) & result.getResponseText()=="I have a good reason."){
    return true;
  } else {
    return false; 
  }
    
}

  _trigger(){
    var today= new Date();
    var target_row=-1; 
    for (var row in day_data){
        if ((today.getDate()== day_data[row][DAY_RECORD_DATE_COL].getDate())&&(today.getMonth()==day_data[row][DAY_RECORD_DATE_COL].getMonth())){
          //SpreadsheetApp.getActive().toast(day_data[row][3], "Title", 2);
          target_row= row; 
        }
    }
    if (target_row==-1){
      SpreadsheetApp.getActive().toast("Date is not listed", "Error");
      return; 
    }

    //console.log(parseInt(target_row)+2); 

    if (!this.get_status()){
      records.getRange(parseInt(target_row)+2, DAY_RECORD_LAST_TIME+1).setValue(getCurrentTime());
      //both row and column +1 as indexing starts with 1. row +1 additionally to account for header row  
      records.getRange(SESSION_STATUS_POS[0],SESSION_STATUS_POS[1]).setValue("ON"); 
      return; 
    }
    if (this.get_status()){
      var now= new Date();
      const [hours, minutes] = String(day_data[target_row][DAY_RECORD_LAST_TIME]).split(':');

      var last_start = new Date(now.getFullYear(),day_data[target_row][DAY_RECORD_DATE_COL].getMonth(), day_data[target_row][DAY_RECORD_DATE_COL].getDate(),  parseInt(hours), parseInt(minutes)); 
      //console.log(parseInt(hours)); 
      var session_length= calculateSessionBetweenDates(now, last_start); //how many sessions 
      if (isNaN(session_length)) {
        session_length = 0;
      }
      if (session_length<1){
        var terminate_sess= this._displayPrompt();
        if (!terminate_sess){
          return; 
        }
      }

      //update the duration column
      var original_duration= parseFloat(day_data[target_row][DAY_RECORD_DURATION]); 
      if (isNaN(original_duration)) {
        original_duration = 0;
      }
      //console.log(last_start); 
      //console.log(session_length); 
      records.getRange(parseInt(target_row)+2, DAY_RECORD_DURATION+1).setValue(original_duration+session_length);
      records.getRange(SESSION_STATUS_POS[0],SESSION_STATUS_POS[1]).setValue("OFF"); 
      update_one_week(records.getRange(parseInt(target_row)+2, WEEK_COLS[0]).getValue(), session_length);
    }
    
  
  }
}


s = new FocusSession(); 

const onOpen = () => {
 
  SpreadsheetApp.getUi()
    .createMenu('Time')
    .addItem("Trigger", "trigger")
    .addToUi();

  records.getRange(DAY_RECORD_START_ROW, DAY_RECORD_LAST_TIME+1, (records.getLastRow()-DAY_RECORD_START_ROW+1)).setNumberFormat('@STRING@'); //PATCH: format the Last time column to string 
  
};

function trigger(){
  s._trigger(); 
  
}




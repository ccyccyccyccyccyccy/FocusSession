# FocusSession
a simple Google Sheet Apps Script to log focus sessions

## Key features/ distinctions from commonplace pomorodo apps
- In the case that the user works beyond the specified session length, they are not interrupted by focus-breaking alarms. 
- They are, however, still discouraged from ending a session early. 
- Easily cross platform as long as run on a browser. 
- It only runs during the logging i.e. start and end of the session, with minimal power consumption. It is not necessary to have the Sheet opened during the session. 
- Like any regular pomorodo apps, it records the number of sessions on a daily and weekly basis. (A week here is user-defined. In principle it can be regarded as any group of days.)

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)

## Installation

IMPORTANT: the script should be run in a web browser

Go to the link: https://docs.google.com/spreadsheets/d/1q8CxKEbHPaCJmUCxmFEkyYJvoPgsValv507PN1Fxvms/edit?usp=sharing and make a copy of the Google Sheet. On your copy, on the top bar click Extensions  > Apps Script. Give the necessary permissions to run the script. 

==Modify the script==

In the script, change the variables under #CHANGEME. If you ever wish to change the layout of the Google sheet, you may change the values under //positions of rows and columns. It is not encouraged. 

==Modify the sheet==

In "record1", 
- modify the Date column. Note that the script will have no effect on dates that are not the current day the script is run. i.e. running the script on 6 July, 2024 will not cause changes to rows of other days.
- modify the "Week" columns (columns A and H). Naturally, any values that appears in column A must appear in column H. 
- As mentioned, the script will only have effect on the day it is run. Therefore changing the values of past days will have no effect on anywhere else, presently or in the future. 

## Usage

In "record1", 
The cell in the middle (F2) indicates the status of the session. "ON" means the user is in the middle of a focus session and "OFF" otherwise. 

There is basically only one button. Look for Time in the top bar> Trigger. Triggering either starts or ends a session. Play around a bit to see what it does. 

Users may change to another sheet upon filling up one sheet. In that case, see the sheet "new_record_template", the bare minimum for starting another sheet. It is recommended to copy and paste the cells from the old sheet then modify it rather than filling in from scratch to avoid data type misrepresentations, which this script is quite prone to. After that, users should modify the script, specifically the variable SHEET_NAME. 


## Contributing
This project may not be regularly or reliably maintained and you are very welcome to help me by raising issues and pull requests. Comments are welome as well. 

## Disclaimer
This script has not been thoroughly tested. Please understand that anyone using it are doing so at their own risk. 

# FocusSession
a simple Google Sheet Apps Script to log focus sessions based on the Pomorodo method

## Key features/ distinctions from commonplace Pomorodo apps
- In the case that the user works beyond the specified session length, they are not interrupted by focus-breaking alarms. 
- They are, however, still discouraged from ending a session early. 
- Easily cross platform as long as run on a browser. 
- It only runs during the logging i.e. start and end of the session, with minimal power consumption. It is not necessary to have the Sheet opened during the session. 
- Like any regular Pomorodo apps, it records the number of sessions on a daily and weekly basis. (A week here is user-defined. In principle it can be regarded as any group of days.)

## Table of Contents
- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)

## Installation

Requirement: the script should be run in a web browser

Go to the link: https://docs.google.com/spreadsheets/d/1q8CxKEbHPaCJmUCxmFEkyYJvoPgsValv507PN1Fxvms/edit?usp=sharing and make a copy of the Google Sheet. On the copy, on the top bar click Time  > Trigger. Give the necessary permissions to run the script. 

## Setup

==Modify the sheets==

In "config", 
- modify the various user-defined parameters. Refresh the webpage to apply changes. 

In "record1", 
- modify the "Date" column. Note that the script will have no effect on dates that are not the day the script is run. i.e. running the script on 6 July, 2024 will not cause changes to rows of other days. Manually changing the values of past days will have no effect anywhere else, presently or in the future. 
- modify the "Week" columns (columns A and H). Naturally, all values that appear in column A must appear in column H.
- aside from the "Date" and "Week" columns, it is not recommended to manually modify other cell values which may result in data inconsistency. 

## Usage

In "record1", 
The cell in the middle (F2) indicates the status of the session. "ON" means the user is in the middle of a focus session and "OFF" otherwise. 

There is basically only one button, Time > Trigger. Triggering either starts or ends a session.

Users may change to another sheet upon filling up one sheet. In that case, see the sheet "new_record_template", the bare minimum for starting another sheet. It is recommended to copy and paste the cells from the old sheet then modify it rather than filling in from scratch to avoid data type misrepresentations, which this script is quite prone to. After that, modify the variable SHEET_NAME in the sheet "config". 


## Contributing
This project may not be regularly or reliably maintained and you are very welcome to help me by raising issues and pull requests. General feedback is welcome as well. 

## Disclaimer
This script has not been thoroughly tested. Please understand that anyone using it are doing so at their own risk. 

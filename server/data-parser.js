var fs = require('fs');

// SQLITE3!
// var sqlite3 = require('sqlite3');
// var db = new sqlite3.Database('db',
//   function(err) {
//     if(err) {
//       // STOP! couldn't open database!
//       throw err;
//     } else {
//       console.log('No error opening database!!');
//     }
//   }
// );

// at most one statement object executes a query at a time
// other statements wait in queue until previous statement executed
// https://github.com/mapbox/node-sqlite3/wiki/Control-Flow
// db.serialize(function() {
//   db.run("DROP Table incidents", function(err) {
//     if(err) {
//       console.log("drop table error!");
//     }
//   });
//   db.run("CREATE TABLE incidents (associateID INTEGER, date TEXT, code TEXT, points REAL)", function(err) {
//     if(err) {
//       console.log("create table error!");
//     }
//   });

//   db.run("SELECT * from incidents", function(err, row) {
//     console.log("SELECT");
//     console.log(row);
//   });
// });



var _data = [];
var _fileName = 'initialExceptionsReport.txt';

exports.parseData = function() {
  fs.readFile(_fileName, function(err, data) {
    if(err) {
      throw err;
    }

    _data = data.toString().split('\n');
    _data.forEach(processLine);
    for(var i = 0; i < storage.length; i++) {
      console.log(storage[i]);
    }
    // console.log('DONE?');
    // db.close();
  });
};

// needs to be outside of processLine so it persists
var associateID;

exports.storage = storage = [];

function processLine(line) {
  var associate_re = /([^,]*), ((?:\w{2,}\s?)+) (\w\s)?ID: (\d{7})/;
  var associate_match = associate_re.exec(line);
  var lastName;
  var firstName;
  var middleInitial;
  // var associateID;
  var processAssociate;

  var entry_re = /\w{3} (\d{1,2})\/(\d{1,2})\/(\d{4}) (Late In|Unexcused Absence|Holiday Skipped)(?: \[Reviewed\])?(?:(?:(?: \d{1,2}\/\d{1,2}\/\d{4} (\d{1,2}):(\d{2}):(\d{2}) (AM|PM) (\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2}) (AM|PM)).*)|(?:.* (Vacation|Holiday|Personal) .*))?/;
  var entry_match;
  var sY; // scheduledYear
  var aY; // actualYear
  var sMon; // scheduledMonth
  var aMon; // actualMonth
  var sD; // scheduledDay
  var aD; // actualDay
  var sH; // hour
  var aH;
  var sM; // minute
  var aM;
  var sS; // second
  var aS;
  var sAmPm;
  var aAmPm;
  var sT; // scheduledTime
  var aT; // actualTime

  var code;
  var points;

  if(associate_match !== null) {
    if(associateID != associate_match[4]) {
      // processAssociate = 0;
      lastName = associate_match[1];
      firstName = associate_match[2];
      if(associate_match[3]) {
        middleInitial = associate_match[3].substring(0, 1);
      } else {
        middleInitial = '';
      }
      associateID = associate_match[4];
      // processAssociate++;
      // console.log(lastName + '|' + firstName + '|' + middleInitial + '|' + associateID);
    }
  // } else if(processAssociate > 0) {
  } else {
    entry_match = entry_re.exec(line);
    if(entry_match !== null) {
      sY = entry_match[3];
      aY = entry_match[11];

      sMon = entry_match[1];
      sD = entry_match[2];
      
      aMon = entry_match[9];
      aD = entry_match[10];
      
      sH = entry_match[5] || 0;
      sM = entry_match[6] || 0;
      sS = entry_match[7] || 0;
      sAmPm = entry_match[8];
      
      aH = entry_match[12];
      aM = entry_match[13];
      aS = entry_match[14];
      aAmPm = entry_match[15];

      sT = new Date(sY, sMon, sD, sH, sM, sS);

      if(entry_match[4] === 'Unexcused Absence') {
        code = 'A';
        points = 1;
      } else if (entry_match[4] === 'Late In') {
        aT = new Date(aY, aMon, aD, aH, aM, aS);
        code = 'T';
        minutesLate = (aT - sT)/60/1000; // converting from milliseconds to seconds
        if(minutesLate > 120) {
          points = 1;
        } else if(minutesLate > 5) {
          points = 0.5;
        } else {
          points = 0;
        }
      }

      if(points) {
        // write to database
        storage.push({
          associateID: associateID,
          date: sT,
          code: code,
          points: points
        });
        /*
        db.serialize(function() {
          db.run('INSERT INTO incidents VALUES (' +
            associateID + ', "' +
            sT + '", "' +
            code + '", ' +
            points + ')', function(err) {
              if(err) {
                console.log(err);
              }
            }
          );
        });
        */
      }
    }
  }
}

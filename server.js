var express = require('express');
var bodyParser = require('body-parser');
var fs = require("fs");

const cors = require('cors');
const { Console } = require('console');
var app = express();
app.use(cors())
app.use(bodyParser.json())



const port = process.env.PORT || 5000;

app.get('/listUsers', function (req, res) {
  fs.readFile('new.json', 'utf8', function (err, data) {
      console.log( data );
      res.end( data );
   });
})

app.post('/addUser', function (req, res) {
  // Read existing users from 'new.json'
  fs.readFile('new.json', 'utf8', function (err, data) {
    if (err) {
      console.log(err);
    } else {
  let existingData = JSON.parse(data);
  // Calculate the next index for the new data
      const newIndex = Object.keys(existingData).length;
    // Add the new data to the existing data with the new index
      existingData[newIndex] = req.body;
    // Convert the updated data back to JSON
      let json = JSON.stringify(existingData, null, 2);
 // Write the updated JSON back to 'new.json'
      fs.writeFile('new.json', json, 'utf8', function (err) {
        if (err) {
          console.log(err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json(json); // Respond with the updated data
        }
      });
    }
  });
});

 app.put('/updateUser/:id', function (req, res) {
   const userIdToUpdate = req.params.id;
  const updatedUserData = req.body;
  console.log(userIdToUpdate,updatedUserData)
   // Read the existing user data from the JSON file
   fs.readFile('new.json', 'utf8', function readFileCallback(err, data){
     if (err) {
       // Handle the error appropriately (e.g., send an error response).
       console.error(err);
       return res.status(500).send('Internal Server Error');
     }
 
     // Parse the existing JSON data into an object
     let obj = JSON.parse(data);
  // Check if the user exists before updating.
  if (data.hasOwnProperty(userIdToUpdate)) {
    obj[userIdToUpdate] = updatedUserData; // Update the user data

    // Convert the updated object back to JSON.
    const updatedJson = JSON.stringify(obj);
    
       // Write the updated JSON back to the file
       fs.writeFile('new.json', updatedJson, 'utf8', function (err) {
         if (err) {
           // Handle the error appropriately.
           console.error(err);
           return res.status(500).send('Internal Server Error');
         }
 
         // Send the updated JSON data in the response
         res.json(updatedJson[userIdToUpdate]);
       });
     } else {
       // User not found, send an appropriate response
       res.status(404).send('User not found');
     }
   });
 });
 
 app.delete('/deleteUser/:id', function (req, res) {
  const userIdToDelete = req.params.id;
   
   fs.readFile('new.json', 'utf8', function (err, data) {
      if (err) {
       
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
let obj = JSON.parse(data);
 let a=obj.findIndex(x=>x.EnteryourID===userIdToDelete)
 console.log(userIdToDelete)
     
      if (obj.hasOwnProperty(a)) {
       
         obj.splice(a,1);
        console.log("User deleted:", obj);

        let json = JSON.stringify(obj);

        fs.writeFile('new.json', json, 'utf8', function (err) {
          if (err) {
            
            console.error(err);
            return res.status(500).send('Internal Server Error');
          }
          res.json(obj);
        });
      } else {
        console.log("User not found");
        res.status(404).send('User not found');
      }
   });
});




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
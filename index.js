/* THIS IS THE SERVER SIDE NODE.JS SCRIPT*/



/*
=========================================================================================================
=== This is the required files for the web app, if any modules are missing add them back via terminal ===
=========================================================================================================


*/
const express =  require('express');
const app = express();
const port = 3000;
const Datastore = require('nedb');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const VIEWS = path.join(__dirname , 'views'); // not entirely sure what this does, i think it is used in the response object for rendering file.
let db = "";


/* 
========================================================
========================================================
*/


/* 
=========================================================================================================
This section checks to ensure the database file exists, if not makes a new db file called inventory.db
=========================================================================================================
*/

 try
{
    if(fs.existsSync("inventory.db"))
    {
        db  = new Datastore({filename:  path.join(__dirname , 'inventory.db'), autoload:true});
        console.log("loading DB");
        db.loadDatabase(() => {
            console.log("file exists");
           

        });
      
   }

    else
    {
        console.log("cannot find file, making it.")
        db  = new Datastore({filename:  path.join(__dirname , 'inventory.db'), autoload:true});
        console.log("file has been created");

    }
}

catch(err)
{
    console.log(err);
    console.log("Your file cannot be found, please contact Arif 403-386-5294");
}

/* 
========================================================
========================================================
*/


/* 
=========================================================================================================
The lines below create the server. In production the port needs to be changed. 
=========================================================================================================
*/


app.listen(port, () =>{

    console.log("Listening on port 3000");
})

app.use(express.static(__dirname + '/Public'));

/*========================================*/

/*========================================*/

/* 
===========================================================================================================
The lines below are used for parsing incoming data from the forms on the client side and turning into JSON
===========================================================================================================
*/

app.use(bodyParser.json());
const urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(express.json({limit: '1mb'}));




/*========================================*/

/*========================================*/

/* 
=================================================================================================================================================
The lines below run the requests for the server that come in from the client JS script. Each type is related to the functions on the client side.
==================================================================================================================================================
*/

app.post('/inventory', urlencodedParser, (req, response, next) => {
  
    console.log("req body: " , req.body);
    
    response.status(200).json(req.body);
   
    db.insert(req.body);

    console.log("Item inserted");

    next();

    
});



app.get('/inventory' , (req, response, next) => {

let dbData = fs.readFileSync('inventory.db' , 'utf-8'); //this will read the entire db file but the data in the file is **NOT** JSOn even though it looks like it. The data is a series of returns.

let newJSON = {data: dbData.split('\n').filter(x => x).map(row => {

 return JSON.parse(row);

})}; // Since the data from the file is not JSON, this section will form the list of returns into a JSON format

console.log("newJSON " , newJSON);

console.log("status " , response.statusCode);

response.send(newJSON);

next();

});



app.post('/findItem' , (req, response, next) => 
{

    console.log("req find: ",  req.body);

    console.log("req find: ",  req.body.model);

   let result = {data: [{}]};
   let storeVar = "";
   

    const dbRes =  db.find({model:req.body.model} , function (err, docs) {

        console.log("docs: ", docs);
       
        storeVar = strapdocs(docs);

        console.log("storeVar2: " , storeVar);
        
        finish(storeVar);
        
        return storeVar;
        
    });
      
    function strapdocs(docs)
    {
        console.log("docs2: " , docs);
        
        for(let i in docs)
        {
            console.log("docs objects: " , docs[i]);

            result = {data: docs[i]};

        }

        console.log("result: " , result);
        console.log(result.data.cost);
        console.log("final result: ", result.data.model);

       return result;
    };

   
  
    
function finish(storeVar)
{
    console.log("storeVar3: " , storeVar);
    response.status(200).json(storeVar)
    next();

}
    
    
});
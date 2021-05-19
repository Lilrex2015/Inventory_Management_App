/*                                           ===================================
THIS IS THE CLIENT SIDE OF THE PROJECT THAT  |*** CONNECTS TO THE HTML PAGE *** |
                                              ==================================
*/ 

window.onload = () => {



//global scope variables seciton

myModule = {};

const serialize = require('dom-form-serializer').serialize
const tableGen = document.getElementById("InvTable");
const tableDIV = document.getElementById("tableView");
const tbody = document.getElementById("tBodyID");
const formID = document.getElementById("FormID");
const findFormID = document.getElementById("findFormID");
let dataGlobe = {};



/*========================================*/

/*========================================*/

/* 
==========================================================================================================================================
There was issues with DOM loading and timing within the JS functions, so I made it async load and the windows on load for event listeners.
===========================================================================================================================================
*/


    document.getElementById("FormID").addEventListener("submit" , (e) =>
    {
        console.log("form event listener activated");
        e.preventDefault();
        console.log("default prevented");
        console.log("formID: " , e);
        myModule.addToTable(e);

    });

    document.getElementById("checkAll").addEventListener("click" , () =>{

        formID.style.visibility = "hidden";
        findFormID.style.visibility = "hidden";
        tableDIV.style.display = "initial";
        myModule.checkAllInv();

    });


    document.getElementById("AddItem").addEventListener("click", ()=> {

        tableDIV.style.display = "none";
        findFormID.style.visibility = "hidden";
        formID.style.visibility = "visible";
       


    });

   document.getElementById("FindItem").addEventListener("click" , () => {

    
    tableDIV.style.display = "none";
    formID.style.visibility = "hidden";
    findFormID.style.visibility = "visible";
  
    });

    document.getElementById("findFormID").addEventListener("submit" , (itemName) => {

        console.log("Prevent find default");
        itemName.preventDefault();
        console.log("itemName: ", itemName);
        findFormID.style.visibility = "hidden";
        tableDIV.style.display = "initial";
        myModule.findItem(itemName);
      
        });
    
/*========================================*/

/*========================================*/

/* 
==========================================================================================================================================
This function pulls the inventory from the db file located on the server. 
===========================================================================================================================================
*/

function checkAllInv()
{
   
    fetch('/inventory', {

        method: 'GET',
        'content-type': 'application/json'
    })

    .then((response) =>{

        console.log('response ', response);

        response.json().then(data => {


            dataGlobe = data;
            printHTML(dataGlobe);
        })

    })

    


.catch(err => {

console.log("error: error spotted");

})

}

/*========================================*/

/*========================================*/

/* 
==========================================================================================================================================
This function adds new items to the database file.
===========================================================================================================================================
*/


function addToTable(e)
{


    const serialForm = serialize(document.querySelector('#FormID')); //this reads the form from the HTML page
    console.log("serialform: " , serialForm); //the converted form to JSON object
    const stringedJSON = JSON.stringify(serialForm); //Stringifying the JSON to send to the server bc it will reconvert to JSON when it gets there automatically
   
    

    // this function "talks to the server and adds the item that was entered into the form into the database"
const result = fetch('/inventory' , {

    method: 'post',
    headers : {

        'Content-Type' : 'application/json',
    },

    body: stringedJSON,
    

})

.then((resp) => {

console.log("resp " , resp);

});



};

/*========================================*/

/*========================================*/

/* 
==========================================================================================================================================
This function finds particular items in the database
===========================================================================================================================================
*/


function findItem(itemName)
{

    console.log("ItemName " , itemName)
    const serialFormFind = serialize(document.querySelector('#findFormID')); //this reads the form from the HTML page
    console.log("serialform: " , serialFormFind); //the converted form to JSON object
    const stringedJSONFind = JSON.stringify(serialFormFind); //Stringifying the JSON to send to the server bc it will reconvert to JSON when it gets there automatically
   
    console.log("Find item: " , stringedJSONFind)

    fetch('/findItem' , {

        method: 'post',

        headers : {

            'Content-Type' : 'application/json',
        },
      
        body: stringedJSONFind,


    })

    .then((resp)=> {

       return resp.json();
    })

   .then((dataJson) => {

    console.log("data: " , dataJson.data);

    Printfind(dataJson);
  

   })
    
}

/*========================================*/

/*========================================*/

/* 
==========================================================================================================================================
This function deletes items from the database, but cannot be undone once processed. 
===========================================================================================================================================
*/


function deleteItem()
{

}

/*========================================*/

/*========================================*/

/* 
==========================================================================================================================================
This function adds new items to the database file.
===========================================================================================================================================
*/


function printHTML(e)
{
   let tablerowCount = tableGen.getElementsByTagName('tr');
   let rowCount = tablerowCount.length;

   console.log("rowcount= " , rowCount);

   for(let x = rowCount-1; x>0; x--)
   {
       tableGen.removeChild(tablerowCount[x]);
   }

   
    for(let i in e.data)
    {
        console.log(`id is: ${e.data[i]._id}`);

        let rows = "";
        let newTr = document.createElement("tr");
        // let newTd = document.createElement("td"); // not needed now but maybe later in refactor
        let checkstatus = false;  
      
      
     
    
      if(e.data[i].quantity < e.data[i].target)
      {
         // alert(`${e.data[i].name} ${e.data[i].model} is currently low on stock, a reorder might be needed soon`);
          rows = `<td>${e.data[i].name}</td> <td>${e.data[i].model} </td> <td>$${e.data[i].cost}</td><td bgcolor="#FF0000">${e.data[i].quantity}</td><td>${e.data[i].target}</td><td>${e.data[i].reorder}</td><td>${e.data[i].shelf}</td>`;

      }

      else if(e.data[i].quantity == e.data[i].target)
      {
        rows = `<td>${e.data[i].name}</td> <td>${e.data[i].model} </td> <td>$${e.data[i].cost}</td><td bgcolor="#FFFF00">${e.data[i].quantity}</td><td>${e.data[i].target}</td><td>${e.data[i].reorder}</td><td>${e.data[i].shelf}</td>`;

      }

      else{

        rows = `<td> ${e.data[i].name}</td> <td> ${e.data[i].model} </td> <td>$${e.data[i].cost}</td><td bgcolor="#00FF00">${e.data[i].quantity}</td><td>${e.data[i].target}</td><td>${e.data[i].reorder}</td><td>${e.data[i].shelf}</td>`;

      }
      newTr.innerHTML = rows;
      tableGen.appendChild(newTr);

    }

   
}

function Printfind(e)
{
    let tablerowCount = tableGen.getElementsByTagName('tr');
    let rowCount = tablerowCount.length;
 
    console.log("rowcount= " , rowCount);

    for(let x = rowCount-1; x>0; x--)
    {
        tableGen.removeChild(tablerowCount[x]);
    }
         let rows = "";
         let newTr = document.createElement("tr");
         // let newTd = document.createElement("td"); // not needed now but maybe later in refactor
     
       if((e.data.quantity < e.data.target))
       {
          alert(`${e.data[i].name} ${e.data[i].model} is currently low on stock, a reorder might be needed soon`);
           rows = `<td>${e.data.name}</td> <td>${e.data.model} </td> <td>$${e.data.cost}</td><td bgcolor="#FF0000">${e.data.quantity}</td><td>${e.data.target}</td><td>${e.data.reorder}</td><td>${e.data.shelf}</td>`;
 
       }
 
       else if(e.data.quantity == e.data.target)
       {
        rows = `<td>${e.data.name}</td> <td>${e.data.model} </td> <td>$${e.data.cost}</td><td bgcolor="#FFFF00">${e.data.quantity}</td><td>${e.data.target}</td><td>${e.data.reorder}</td><td>${e.data.shelf}</td>`;
 
       }
 
       else{
 
        rows = `<td>${e.data.name}</td> <td>${e.data.model} </td> <td>$${e.data.cost}</td><td bgcolor="#00FF00">${e.data.quantity}</td><td>${e.data.target}</td><td>${e.data.reorder}</td><td>${e.data.shelf}</td>`;
 
       }
       newTr.innerHTML = rows;
       tableGen.appendChild(newTr);
 
     }
 


window.myModule = {
    
 addToTable: addToTable,   
 checkAllInv: checkAllInv,
 findItem: findItem,
 deleteItem: deleteItem,

}

} // end on window.onload function
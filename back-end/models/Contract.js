const mongoose = require('mongoose');
const ContractSchema = new mongoose.Schema({

    //description:{ type: String, required: false },
    uri:{
         type: String,
         required: true 
    },
    /*photoB64:{ 
        type: String, 
        required: true
     },*/
    imageUrl:{ 
        type: String, required: true 
    },
    date:{
         type: Date, required: true 
    }, 
   
    //userId:{ type: String, required: true },    
});

module.exports = mongoose.model('Contract', ContractSchema); 
//1 er argument = nom du model , 2 eme = nom du schema
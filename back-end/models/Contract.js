const mongoose = require('mongoose');
//Definition du model a utulilser plusieur fois a chaque foi 
const ContractSchema = new mongoose.Schema({
    //title:{ type: String, required: true },

    //description:{ type: String, required: false },
    uri:{
         type: String,
         required: true 
    },
    photo:{ 
        type: String, 
        required: true
     },
    imageUrl:{ 
        type: String, required: true 
    },
    date:{
         type: Date, required: true 
    }, 
   //vraie image image:{ type: String, required: true }, 
    //userId:{ type: String, required: true },    
});

module.exports = mongoose.model('Contract', ContractSchema); 
//1 er argument = nom du model , 2 eme = nom du schema
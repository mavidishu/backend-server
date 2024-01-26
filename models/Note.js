// (Notes)Schemas for MongoDB(ODM Object data modeling)
const mongoose = require("mongoose");

const { Schema } = mongoose;

const notesSchema = new Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,//userid of user
    ref:'user'//reference model
  },
  title : {
    type:String,
    requied:true
  },
  description: {
    type:String,
    requied:true
  },
  tag: {type:String,
    requied:true,
    default:"General"
  },
  date: {type:Date,
    default:Date.now
  },

});

module.exports = mongoose.model("notes",notesSchema);// data corresponding to this model will be stored inside collection name "notes" that will follow notesSchema
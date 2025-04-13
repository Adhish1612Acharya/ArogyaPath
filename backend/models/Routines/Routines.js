import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const RoutineSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
media: {
    images: [{path:{type:String} , filename: {type:String },}],
    videos: [ {path:{type:String} , filename: {type:String }, }],
    documents: [ {path:{type:String} , filename: {type:String }, }]
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'ownerType'
  },
  ownerType: {
    type: String,
    required: true,
    enum: ['User', 'Expert']
  },
  filters: {
    type: [String],
    required: true
  },
  routines: [
    {
      time: {
        type: String,
        required: true
      },
      content: {
        type: String,
        required: true
      }
    }
  ]
}, { timestamps: true });

let Routines=model('Routines', RoutineSchema)
export default  Routines
import { Schema, model } from "mongoose";

<<<<<<< HEAD
const { Schema, model } = mongoose;

const SuccessStorySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  media: {
    images: [{type:string}],
    videos: [{ path: { type: String }, filename: { type: String } }],
    documents: [{ path: { type: String }, filename: { type: String } }]
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
  tagged: [
    {
      type: Schema.Types.ObjectId,
      ref: "Expert"
    }
  ],
  routines:[
    {
    time:{
      type:String
    },
    content:{
      type:String
    },
    

  }
],
  verification: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Expert'
    }
  ]
}, { timestamps: true });
=======
const SuccessStorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    media: {
      images: [{ path: { type: String }, filename: { type: String } }],
      videos: [{ path: { type: String }, filename: { type: String } }],
      documents: [{ path: { type: String }, filename: { type: String } }],
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "ownerType",
    },
    ownerType: {
      type: String,
      required: true,
      enum: ["User", "Expert"],
    },
    filters: {
      type: [String],
      required: true,
    },
    tagged: [
      {
        type: Schema.Types.ObjectId,
        ref: "Expert",
      },
    ],
    verification: [
      {
        type: Schema.Types.ObjectId,
        ref: "Expert",
      },
    ],
  },
  { timestamps: true }
);
>>>>>>> 67146deb5460fec4fe6056ef033a41aac03dd268

const SuccessStory = model("SuccessStory", SuccessStorySchema);
export default SuccessStory;

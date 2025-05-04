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
      images: {
        type: [String],
        validate: [
          {
            validator: function (val) {
              return val.length <= 3;
            },
            message: "You can upload a maximum of 3 images.",
          },
        ],
      },
      video: { type: String, default: null },
      document: { type: String, default: null },
    },
    filters: {
      type: [String],
      required: true,
      min: 1,
    },
    tagged: [
      {
        type: Schema.Types.ObjectId,
        ref: "Expert",
        default: [],
      },
    ],
    verified: [
      {
        type: Schema.Types.ObjectId,
        ref: "Expert",
        default: [],
        required: true,
      },
    ],
    routines: {
      type: [
        {
          time: {
            type: String,
            required: [true, "Time is required"],
            minlength: [1, "Time must be at least 2 characters"],
          },
          content: {
            type: String,
            required: [true, "Content is required"],
            minlength: [1, "Content must be at least 2 characters"],
          },
        },
      ],
      default: [],
      required: true,
    },
    readTime: {
      type: String,
      required: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);
>>>>>>> 67146deb5460fec4fe6056ef033a41aac03dd268

const SuccessStory = model("SuccessStory", SuccessStorySchema);
export default SuccessStory;

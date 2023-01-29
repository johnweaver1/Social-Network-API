const { Schema, model, Types } = require('mongoose');
// import moment module to format the timestamp (Found on this site:https://momentjs.com/)!
const moment = require('moment')
// thought schema
const thoughtSchema = new Schema (
    {
      thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => moment(createdAtVal).format("MMM DD, YYYY [at] hh:mm a"),
      },
      username: {
        type: String,
        required: true,
      },
      reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
)
// reaction schema
const reactionSchema = new Schema (
    {
       reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
       },
       reactionBody: {
        type: String,
        required: true,
        maxlength: 280
       },
       username: {
        type: String,
        required: true,
       },
       createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => moment(createdAtVal).format("MMM DD, YYYY [at] hh:mm a"),
       },
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false,
    }
)

// use for friend count
thoughtSchema.virtual('reactionCount')
.get(function() {
    return this.reactions.length;
})

// initalize the thought schema
const Thought = model('Thought', thoughtSchema);
module.exports = Thought;
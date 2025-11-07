import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
chatName: {
type: String,
trim: true
},
isGroupChat: {
type: Boolean,
default: false
},
users: [
{
type: mongoose.Schema.Types.ObjectId,
ref: 'User', // references User model
required: true
}
],
latestMessage: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Message' // will reference the latest message in the chat
},
groupAdmin: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User' // only used if isGroupChat is true
}
}, {
timestamps: true
});

const Chat = mongoose.model('Chat', ChatSchema);

export default Chat;
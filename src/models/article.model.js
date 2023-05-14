import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 5,
    maxlength: 400,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    minlength: 5,
    required: false
  },
  description: {
    type: String,
    minlength: 5,
    maxlength: 500,
    required: true
  },
  category: {
    type: String,
    enum: ['sport', 'games', 'history'],
    required: true
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true
});

const Article = mongoose.model('Article', articleSchema);

export default Article;

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlength: 4,
        maxlength: 50,
        required: true,
        trim: true 
    },
    lastName: {
        type: String,
        minlength: 3,
        maxlength: 60,
        required: true,
        trim: true
    },
    fullName: String,
    email: {
        type: String,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        lowercase: true
    },
    role: {
        type: String,
        enum: ['admin', 'writer', 'guest']
    },
    age: {
        type: Number,
        min: 1,
        max: 99
    },
    numberOfArticles: {
        type: Number,
        default: 0
    },
    articles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }],
    likedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }]
}, {
    timestamps: true
});

userSchema.pre('save', function(next) {
    this.fullName = `${this.firstName} ${this.lastName}`
    if(this.age < 0) this.age = 1
    next()
})

userSchema.pre('findOneAndUpdate', function(next) {
    this._update.fullName = `${this._update.firstName} ${this._update.lastName}`
    console.log(this._update.firstName)
    next()
})

const User = mongoose.model('User', userSchema);

export default User;

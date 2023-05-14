import User from '../models/user.model.js';
import Article from '../models/article.model.js'

export const getUsers = async (req, res, next) => {
  try {
    const sortParam = req.query.sort;
    const users = await User.find({}).select('fullName email age').sort(sortParam === 'asc' ? 'age' : '-age');
    res.send(users);
  } catch (err) {
    next(err);
  }
}

export const getUserByIdWithArticles = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id)
                            .populate({
                              path: 'articles',
                              select: '-_id title subtitle createdAt'
                            });

    if(user) res.send(user);
    else res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}

export const createUser = async (req, res, next) => {
  try {
    if(!req.body) return res.status(400).send('Empty body');

    const { firstName, lastName, age, email, role } = req.body;

    const user = new User({firstName, lastName, age, email, role});
    await user.save();

    res.send(user);
  } catch (err) {
    next(err);
  }
}

export const updateUserById = async (req, res, next) => {
  try {
    if(!req.body) return res.status(400).send('Empty body');

    const id = req.params.id;
    const { firstName, lastName, age } = req.body;

    const user = await User.findOneAndUpdate({_id: id}, {firstName, lastName, age}, {new: true}); 

    if(user) res.send(user);
    else res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}

export const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);

    await Article.deleteMany({ owner: id });

    if(user) res.send(user);
    else res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}


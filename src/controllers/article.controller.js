import Article from '../models/article.model.js';
import User from '../models/user.model.js';

export const getArticles = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;
    const query = search ? { title: { $regex: search, $options: 'i' } } : {};

    const articles = await Article.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('owner', '-_id fullName email age');

    res.json(articles);
  } catch (err) {
    next(err);
  }
}

export const getArticleById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const article = await Article.findById(id);
    
    if(article) res.send(article);
    else res.status(404).send('Article not found');
  } catch (err) {
    next(err);
  }
}

export const createArticle = async (req, res, next) => {
  try {
    if(!req.body) return res.status(400).send('Empty body');

    const { title, subtitle, description, category, ownerId } = req.body;

    const owner = await User.findById(ownerId);
    if(!owner) return res.status(404).send('Owner not found');

    const article = new Article({title, subtitle, description, category, owner: ownerId });
    
    owner.articles.push(article)
    owner.numberOfArticles++;

    await owner.save();
    await article.save();

    res.send(article);
  } catch (err) {
    next(err);
  }
}

export const updateArticleById = async (req, res, next) => {
  try {
    if(!req.body) return res.status(400).send('Empty body');

    const id = req.params.id;
    const { title, subtitle, description, category, ownerId } = req.body;

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).send('Article not found');
    }

    const owner = await User.findById(ownerId);
    if (!owner) {
      return res.status(404).send('Owner not found');
    }
    if (article.owner.toString() !== ownerId) {
      return res.status(403).send('Not authorized to update this article');
    }

    const updatedArticle = await Article.findOneAndUpdate({_id: id}, {title, subtitle, description, category, owner: ownerId}, {new: true}); 

    if(updatedArticle) res.send(updatedArticle);
  } catch (err) {
    next(err);
  }
}

export const deleteArticleById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).send('Article not found');
    }

    await Article.findByIdAndDelete(id);
    // if (article.owner.toString() !== req.user._id.toString()) {
    //   return res.status(401).send('Not authorized');
    // }

    const user = await User.findById(article.owner);
    user.numberOfArticles--;

    const index = user.articles.indexOf(article._id);
    user.articles.splice(index, 1)

    await user.save();

    res.send(article);
  } catch (err) {
    next(err);
  }
}

export const likeArticleById = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).send('Article not found');
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send('Owner not found');
    }

    if (article.likes.includes(user._id)) {
      const likeIndex = article.likes.indexOf(user._id);
      article.likes.splice(likeIndex, 1);

      const likedArticleIndex = user.likedArticles.indexOf(article._id);
      user.likedArticles.splice(likedArticleIndex, 1);
    } else {
      article.likes.push(user);
      user.likedArticles.push(article);
    }

    await article.save();
    await user.save();

    res.send(article);
  } catch (err) {
    next(err);
  }
}
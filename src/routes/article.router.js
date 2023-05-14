import { Router } from 'express';
import {
  createArticle,
  updateArticleById,
  deleteArticleById,
  getArticles,
  getArticleById,
  likeArticleById
} from '../controllers/article.controller.js';

const articleRouter = Router();

articleRouter
  .get('/', getArticles)
  .get('/:id', getArticleById)
  .post('/', createArticle)
  .put('/:id', updateArticleById)
  .delete('/:id', deleteArticleById)
  .put('/:id/like/:userId', likeArticleById);

export default articleRouter;

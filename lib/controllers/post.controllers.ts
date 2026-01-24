import { Router, Request, Response, NextFunction } from 'express';
import { checkPostCount } from '../middlewares/checkPostCount.middleware';
import PostModel from '../modules/schemas/data.schema';

class PostController {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`/posts/:num`, checkPostCount, this.addData);
    this.router.get(`/gets/all`, this.getAll);
    this.router.get(`/gets/query`, this.getElement);
    this.router.get(`/gets/:id`, this.getElementById);
    this.router.delete(`/del/query`, this.removeElement);
    this.router.delete(`/del/all`, this.removeAll);
    this.router.delete(`/del/:id`, this.removeById);
  }

  private addData = async (req: Request, res: Response) => {
    const { title, text, image } = req.body;

    if (!title || !text || !image) {
      return res.status(400).json({ error: 'Wszystkie pola muszą być wypełnione' });
    }

    try {
      const newPost = new PostModel({ title, text, image });
      await newPost.save();
      res.status(201).json(newPost);
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ error: 'Błąd serwera' });
    }
  }

  private getElement = async (req: Request, res: Response) => {
  const filters = req.body;
  try {
    const result = await PostModel.find(filters, { __v: 0 });
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Query error:', error.message);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};


  private getElementById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const post = await PostModel.findById(id);
      if (!post) return res.status(404).json({ error: 'Nie znaleziono dokumentu' });
      res.status(200).json(post);
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ error: 'Błąd serwera' });
    }
  }

  private getAll = async (req: Request, res: Response) => {
    try {
      const posts = await PostModel.find({}, { __v: 0 });
      res.status(200).json(posts);
    } catch (error: any) {
      console.error('Błąd getAll:', error.message);
      res.status(500).json({ error: 'Błąd serwera' });
    }
  }


  private removeElement = async (req: Request, res: Response) => {
    const filters = req.body;
    try {
      const result = await PostModel.deleteMany(filters);
      if (result.deletedCount === 0) return res.status(404).json({ error: 'Nie znaleziono dokumentu' });
      res.sendStatus(200);
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ error: 'Błąd serwera' });
    }
  }

  private removeById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const result = await PostModel.findByIdAndDelete(id);
      if (!result) return res.status(404).json({ error: 'Nie znaleziono dokumentu' });
      res.sendStatus(200);
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ error: 'Błąd serwera' });
    }
  }

  private removeAll = async (req: Request, res: Response) => {
    try {
      const result = await PostModel.deleteMany({});
      res.status(200).json({ message: `Usunięto ${result.deletedCount} dokumentów` });
    } catch (error: any) {
      console.error('Błąd removeAll:', error.message);
      res.status(500).json({ error: 'Błąd serwera' });
    }
  }
}

export default PostController;

import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from './config';
import PostController from './controllers/post.controllers';
import UserController from './controllers/user.controller';

export class App {
  public app: Application;

  constructor() {
    this.app = express();

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.connectToDatabase();
  }

  private initializeMiddlewares() {
    this.app.use(cors({
      origin: 'http://localhost:4200',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
    }));

    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`[${req.method} ${req.url} ${new Date().toISOString()}]`);
      next();
    });
  }

  private initializeRoutes() {   
    const postController = new PostController();
    const userController = new UserController();

    this.app.use('/', postController.router);
    this.app.use('/api', userController.router);
  }

  private async connectToDatabase(): Promise<void> {
    try {
      await mongoose.connect(config.databaseUrl);
      console.log('Połączono z bazą danych');
    } catch (error) {
      console.error('Błąd połączenia z MongoDB:', error);
    }

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    const gracefulExit = async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    };

    process.on('SIGINT', gracefulExit);
    process.on('SIGTERM', gracefulExit);
  }

  public listen() {
    this.app.listen(config.port, () => {
      console.log(`Serwer działa na http://localhost:${config.port}`);
    });
  }
}
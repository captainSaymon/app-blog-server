import { Router, Request, Response, NextFunction } from 'express';
import UserService from '../modules/services/user.service';
import { config } from '../config';
import jwt from 'jsonwebtoken';

class UserController {
    public path = '/user';
    public router = Router();
    private userService = new UserService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/create`, this.register);
        this.router.post(`${this.path}/auth`, this.login);
        this.router.delete(`${this.path}/logout/:id`, this.logout);
    }

    private register = async (req: Request, res: Response) => {
        try {
            const { name, email, password } = req.body;
            const user = await this.userService.create({ name, email, password });
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: 'Rejestracja nieudana' });
        }
    };

    private login = async (req: Request, res: Response) => {
        const { login, password } = req.body;
        const user = await this.userService.getByEmail(login);

        if (user && user.password === password) {
            const token = jwt.sign(
                { userId: user._id, name: user.name },
                config.jwtSecret,
                { expiresIn: '1h' }
            );
            res.status(200).json({ token });
        } else {
            res.status(401).json({ error: 'Błędny login lub hasło' });
        }
    };

    private logout = async (req: Request, res: Response) => {
        res.status(200).send({ message: 'Logged out' });
    };
}

export default UserController;
import * as dotenv from 'dotenv';
dotenv.config();
import express, { Express, Request, Response, NextFunction } from 'express';
import * as BodyParser from 'body-parser';
import Cors from 'cors';
import morgan from 'morgan';
import { routes } from './router';
import WebSocket from "./socket/index.socket";
import path from "path";
import * as Http from "http";
import { ChatSocket } from './controllers';

class ServerModule {

    public host;
    public port;
    public http: Http.Server | undefined;
    public app: Express;
    public io: WebSocket

    constructor() {
        this.host = process.env.HOST;
        this.port = process.env.PORT;
        this.start();
    }

    private start() {
        this.app = express();
        this.app.use(BodyParser.json({limit: '50mb'}));
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(Cors());
        this.app.use(morgan('combined'));
        this.app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
        this.app.use('/files', express.static('uploads'));
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            res.setHeader('Access-Control-Expose-Headers', 'original-name, Content-Disposition');
            next();
        });
        routes(this.app);
        this.http = Http.createServer(this.app);
        this.io = WebSocket.getInstance(this.http);
        this.io.initializeHandlers([
            { path: '/chat', handler: new ChatSocket }
        ]);

        this.http.listen(
            this.port,
            () => console.log(`Server running on http://${this.host}:${this.port}`)
        )
    }
}

export const app: ServerModule = new ServerModule();

// TODO Realize logging via winston.
// TODO Add email OTP to registration API.
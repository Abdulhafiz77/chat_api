import * as express from "express";
import { errorHandler } from "..";
import { authRoutes } from "./auth.routes";
import { chatRoutes } from "./chat.routes";

function nestedRoutes(this: any, path, configure) {
    const router = express.Router({ mergeParams: true });
    this.use(path, router);
    configure(router);
    return router;
}

express.application['prefix'] = nestedRoutes;
express.Router['prefix'] = nestedRoutes;

const expressRouter = express.Router({ mergeParams: true });

export const routes = (app: express.Application) => {

    expressRouter['prefix']('/api', app => {

        app['prefix']('/auth', data => {
            authRoutes(data)
        });
        app['prefix']('/chat', data => {
            chatRoutes(data)
        });
    
    })

    app.use(expressRouter);
    app.use(errorHandler);
};

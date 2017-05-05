import * as users from '../controllers/users';

export class RouteIndex {
    constructor (server: any, db: any) {
        let usersController: any = new users.UserController(server, db);

        server.route([
            {
                method: 'GET',
                path: '/{param*}',
                handler: {
                    directory: {
                        path: 'public/sign-up-login-form',
                        listing: true
                    }
                }
            },
            {
                method: 'POST',
                path: '/api/users',
                handler: usersController.handlerUsers(),
                config: {
                    validate: usersController.validatePayload()
                }
            }
        ]);
    }
}
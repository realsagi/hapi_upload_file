import hapiUsers from "hapi-users";

import * as Glue from "glue";
import * as  Boom from "boom";

class Server {
    constructor () {
        const manifest: any = {
            server: {},
            connections: [
                {
                    port: 8000,
                    labels: ['web']
                }
            ],
            registrations: [
                {
                    plugin: {
                        register: 'hapi-mongoose',
                        options: {
                            bluebird: false,
                            uri: 'mongodb://localhost:27017/test'
                        }
                    }
                },
                {
                    plugin: 'inert'
                },
                {
                    plugin: {
                        register: 'hapi-upload-file',
                        options: {
                            rootPath: "/Users/siliku/Documents/bluebik/project-my-channel/upload-file-test/uploads",
                            mimeValidate: ["image/jpeg", "image/png", "image/png"]
                        }
                    }
                },
                {
                    plugin: 'hapi-users'
                }
            ]
        };

        const options: any = {
            relativeTo: __dirname
        };

        Glue.compose(manifest, options, (err: any, server: any) => {
            if (err) {
                throw err;
            }

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
                }
            ]);

            server.start(() => {
                console.log('hapi started');
            });
        });
    }
}

let server: Server = new Server();
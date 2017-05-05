import * as imagesController from "./controllers/images";
import * as routs from "./routes/index";

import * as Glue from "glue";
import * as  Boom from "boom";
import * as hapiMongoose from 'hapi-mongoose';

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

            let db: any = server.plugins['hapi-mongoose'].connection;
            let routsObject: any = new routs.RouteIndex(server, db);

            server.start(() => {
                console.log('hapi started');
            });
        });
    }
}

let server: Server = new Server();
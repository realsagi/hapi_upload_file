import * as mongooseHidden from 'mongoose-hidden';

export class Users {
    private server: any;
    private mongoose: any;
    private schema: any;
    private db: any;
    constructor (server: any, db: any) {
        this.server = server;
        this.db = db;
        this.mongoose = server.plugins['hapi-mongoose'].lib;
        this.schema = this.mongoose.Schema;

        let usersSchema: any = new this.schema({
            firstName: String,
            lastName: String,
            email: String,
            password: { type: String, hide: true }
        });
        usersSchema.plugin(mongooseHidden());
        return this.db.model('users', usersSchema);
    }
}
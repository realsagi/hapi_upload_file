export class Images {
    private server: any;
    private mongoose: any;
    private schema: any;
    private db: any;
    constructor (server: any, db: any) {
        this.server = server;
        this.db = db;
        this.mongoose = server.plugins['hapi-mongoose'].lib;
        this.schema = this.mongoose.Schema;

        let imagesSchema: any = new this.schema({
            tableName: String,
            idTableName: String,
            type: String,
            imagePath: String
        });
        return this.db.model('images', imagesSchema);
    }
}
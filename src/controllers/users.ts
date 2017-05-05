import * as users from '../models/users';
import * as images from './images';
import * as Joi from 'joi';
import * as Bcrypt from 'bcrypt';

export class UserController {
    private server: any;
    private db: any;
    private usersModel: any;
    private imagesController: IImages;
    constructor (server: any, db: any) {
        this.server = server;
        this.db = db;
        this.usersModel = new users.Users(server, db);
        this.imagesController = new images.ControllerImages(server, db);
    }

    private hashBcryptPassword (password: String): Promise<any> {
        let SALT_WORK_FACTOR: number = 10;
        return new Promise((resolve: any, reject: any): void => {
            Bcrypt.genSalt(SALT_WORK_FACTOR, (err: any, salt: any) => {
                if (err) {
                    reject(err);
                }else {
                    Bcrypt.hash(password, salt, (err: any, hash: any) => {
                        if (err) {
                            reject(err);
                        }else {
                            resolve(hash);
                        }
                    });
                }
            });
        });
    }

    public validatePayload (): any {
        return {
            payload : {
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string().email().required(),
                password: Joi.string().required(),
                fileBinary: Joi.string().required(),
                fileName: Joi.string().required()
            }
        };
    }

    public handlerUsers (): any {
        return (request: any, reply: any): void => {
            let data: any = request.payload;
            let dataResponse: any = {};
            let password: string = data.password;
            this.hashBcryptPassword(password).then((hash: any) => {
                let dataForSave: any = {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    password: hash
                };
                let users: any = new this.usersModel(dataForSave);
                return users.save();
            }).then((users: any) => {
                let dataUploadImage: any = {
                    tableName: "users",
                    idTableName: users._id,
                    type: "profile",
                    fileBinary: data.fileBinary,
                    fileName: data.fileName
                };
                dataResponse['users'] = users;
                return this.imagesController.uploadImages(dataUploadImage);
            }).then((images: any) => {
                dataResponse['images'] = images;
                reply(dataResponse);
            }).catch((err: any) => {
                console.log(err);
                this.usersModel.find({_id: dataResponse['users']._id}).remove().exec();
                let statusCodeError: number = 500;
                reply(err).code(statusCodeError);
            });
        };
    }
}
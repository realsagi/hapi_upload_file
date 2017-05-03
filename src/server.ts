'use strict';

const Glue = require('glue');
const Boom = require('boom');
const mkdirp = require('mkdirp');

const FileType = require('file-type');
const readChunk = require('read-chunk');

const fs = require('fs');

const manifest = {
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
                register: 'hapi-mongodb',
                options: {
                    url: 'mongodb://localhost:27017/test',
                    settings: {
                        poolSize: 10
                    },
                    decorate: true
                }
            },
        },
        {
            plugin: 'inert'
        }
    ]
};

const options = {
    relativeTo: __dirname
};

function makeId(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 7; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

Glue.compose(manifest, options, (err, server) => {

    if (err) {
        throw err;
    }

     server.route([
         {
            method: 'GET',
            path: '/{param*}',
            handler: {
                directory: {
                    path: 'public/sign-up-login-form'
                }
            }
        },
        {
            method: 'GET',
            path: '/api/users/{id}',
            handler(request, reply) {
                const db = request.mongo.db;
                const ObjectID = request.mongo.ObjectID;
    
                db.collection('users').findOne({_id: new ObjectID(request.params.id) }, function (err, result) {
    
                    if (err) {
                        return reply(Boom.internal('Internal MongoDB error', err));
                    }
    
                    reply(result);
                });
            }
        },
        {
            method: 'GET',
            path: '/api/images/{id}',
            handler(request, reply) {
                const db = request.mongo.db;
                const ObjectID = request.mongo.ObjectID;
    
                db.collection('images').findOne({_id: new ObjectID(request.params.id) }, function (err, result) {
    
                    if (err) {
                        return reply(Boom.internal('Internal MongoDB error', err));
                    }
                    reply.file(result.imagePath);
                });
            }
        },
        {
            method: 'POST',
            path: '/api/users',
            handler(request, reply) {
                const db = request.mongo.db;
                const data = request.payload;

                var rootPath = "/Users/siliku/Documents/bluebik/project-my-channel/upload-file-test/uploads";
                var now = new Date();
                var subPath = "/"+now.getFullYear()+"/"+now.getMonth()+"/"+now.getDay();
                var path = rootPath+subPath;
                var fileType = data.fileName.substring(data.fileName.indexOf("."));

                mkdirp(path, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    var pathFile = path + makeId() + fileType;
                    fs.writeFile(pathFile, data.fileBinary, "binary", function(err) {
                        if(err) {
                            return console.log(err);
                        }

                        const buffer = readChunk.sync(pathFile, 0, 4100);
                        var mime = FileType(buffer);

                        if(mime == null || mime.mime.indexOf("image") < 0){
                           fs.unlinkSync(pathFile);
                           reply("not image");
                        }
                        else{
                            var dataImages = {
                                imagePath: pathFile
                            }
                            db.collection('images').save(dataImages, function (err, resultImages) {
                                var dataForSave = {
                                    name: data.name,
                                    lastName: data.last,
                                    email: data.email,
                                    passWord: data.password,
                                    imageId: resultImages.ops[0]._id
                                }
                                db.collection('users').save(dataForSave, function (err, resultUsers) {
                
                                    if (err) {
                                        return reply(Boom.internal('Internal MongoDB error', err));
                                    }
                    
                                    reply(resultUsers);
                                });
                            });
                        }
                    }); 
                });
            }
        }
    ]);

    server.start(() => {

        console.log('hapi days!');
    });
});
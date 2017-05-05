interface IUploadImages {
    tableName: string;
    idTableName: string;
    type: string;
    fileBinary: string;
    fileName: string;
}

interface IImages {
    uploadImages (data: IUploadImages): any;
}

interface ISaveImagesMongoose {
    tableName: string;
    idTableName: string;
    type: string;
    imagePath: string;
}
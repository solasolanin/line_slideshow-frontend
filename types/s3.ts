export interface Bucket {
    bucket: string,
    file: string,
}

export type S3file = {
    Key: string;
    LastModified: string;
    ETag?: string;
    Size?: number;
    StorageClass?: string;
}
export type S3fileList = {
    Contents: S3file[];
    KeyCount: number;
}
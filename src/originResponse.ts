import AWS from "aws-sdk";
import { GetObjectOutput } from "aws-sdk/clients/s3";
import _ from "lodash";
import Sharp from "sharp";

const S3 = new AWS.S3({
    signatureVersion: "v4",
});
const Bucket = "tp-image-resize";
const variables = {
    allowedFormat: ["png", "jpeg", "webp"],
    defaultFormat: "png",
};

interface IQuery {
    size?: string;
    format?: string;
}

export const convert = (data: Buffer, params: IQuery): Promise<Buffer> => {
    let res = Sharp(data);

    if (_.isEmpty(params)) {
        return new Promise((resolve, reject) => resolve(data));
    }

    if (params.size) {
        const [width, height] = params.size.split("x").map((num) => parseInt(num, 10));
        if (width > 0 && height > 0) {
            res = res.resize(width, height);
        }
    }

    if (params.format) {
        const format = _.includes(variables.allowedFormat, params.format) ? params.format : variables.defaultFormat;
        res = res.toFormat(format);
    }
    return res.toBuffer();
};

export const download = (s3path: string): Promise<GetObjectOutput> => (
    S3.getObject({
        Bucket,
        Key: s3path,
    }).promise()
);

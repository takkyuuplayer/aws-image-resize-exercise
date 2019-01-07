import {
    CloudFrontHeaders,
    CloudFrontRequest,
    CloudFrontResponse,
    CloudFrontResponseHandler,
    CloudFrontResultResponse,
} from "aws-lambda";
import lodash from "lodash";
import { resolve } from "path";
import querystring from "querystring";
import Sharp from "sharp";
import AWS from "./AWS";
import { ALLOWED, BUCKET, DEFAULT_FORMAT } from "./constants";
import { IQuery } from "./definitions";

const S3 = new AWS.S3({
    signatureVersion: "v4",
});

export const handle = (request: CloudFrontRequest, response: CloudFrontResponse)
    : Promise<CloudFrontResultResponse> => {

    console.log("1");
    if (response.status !== "200") {
        console.log("Image not found: %j ", request);

        return new Promise((success, failure) => {
            success(response);
        });
    }

    console.log("2");
    const params = querystring.parse(request.querystring) as IQuery;

    console.log("3");
    if (lodash.isEmpty(params)) {
        return new Promise((success, failure) => {
            success(response);
        });
    }

    const path = request.uri.substr(1);
    const originalFormat = path.substr(path.lastIndexOf(".") + 1);
    const format = params.format
        || (lodash.includes(ALLOWED.format, originalFormat) ? originalFormat : DEFAULT_FORMAT);

    console.log(`Fetching ${path} ...`);

    return S3.getObject({
        Bucket: BUCKET,
        Key: path,
    }).promise().then((data) => {
        console.log("Downloaded %j", data);

        let image = Sharp(data.Body as Buffer);

        if (params.size) {
            const [width, height] = params.size.split("x").map((num) => parseInt(num, 10));
            image = image.resize(width, height);
        }

        image = image.toFormat(format);

        return image.toBuffer();
    }).then((buf) => {
        console.log("Converted");

        const res = response as CloudFrontResultResponse;
        res.body = buf.toString("base64");
        res.bodyEncoding = "base64";
        delete (res.headers as CloudFrontHeaders)["content-length"];
        if (format !== originalFormat) {
            (res.headers as CloudFrontHeaders)["content-type"]
                = [{ key: "Content-Type", value: "image/" + format }];
        }
        console.log("%j", res);
        return res;
    });
};

export const handler: CloudFrontResponseHandler = (event, context, callback) => {
    console.log("%j", event);
    console.log("%j", context);

    const request = event.Records[0].cf.request;
    const response = event.Records[0].cf.response;

    handle(request, response).then((res) => {
        console.log("Returning resopnse... %j", res);
        callback(null, res);
    }).catch((err) => {
        console.log("Exception while converting image :%j", err);
        callback(null, response);
    });
};

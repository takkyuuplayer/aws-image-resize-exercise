import {
    CloudFrontHeaders,
    CloudFrontRequest,
    CloudFrontResponse,
    CloudFrontResponseHandler,
    CloudFrontResultResponse,
} from "aws-lambda";
import AWS from "aws-sdk";
import lodash from "lodash";
import querystring from "querystring";
import Sharp from "sharp";
import { ALLOWED, BUCKET, DEFAULT_FORMAT } from "./constants";
import { IQuery } from "./definitions";

AWS.config.update({
    s3: { endpoint: "http://127.0.0.1:4572" },
    s3ForcePathStyle: true,
});
const S3 = new AWS.S3({
    signatureVersion: "v4",
});

export const handle = async (request: CloudFrontRequest, response: CloudFrontResponse)
    : Promise<CloudFrontResultResponse> => {

    if (response.status !== "200") {
        console.log("Image not found: %j ", request);

        return response;
    }

    const params = querystring.parse(request.querystring) as IQuery;

    if (lodash.isEmpty(params)) {
        return response;
    }

    const originalFormat = request.uri.substr(request.uri.lastIndexOf(".") + 1);
    const data = await S3.getObject({
        Bucket: BUCKET,
        Key: request.uri,
    }).promise();

    let image = Sharp(data.Body as Buffer);

    if (params.size) {
        const [width, height] = params.size.split("x").map((num) => parseInt(num, 10));
        image = image.resize(width, height);
    }

    const format = params.format
        || (lodash.includes(ALLOWED.format, originalFormat) ? originalFormat : DEFAULT_FORMAT);
    image = image.toFormat(format);

    const buf = await image.toBuffer();
    const res = response as CloudFrontResultResponse;

    res.body = buf.toString("base64");
    res.bodyEncoding = "base64";
    if (format !== originalFormat) {
        (res.headers as CloudFrontHeaders)["content-type"]
            = [{ key: "Content-Type", value: "image/" + format }];
    }
    return res;
};

export const handler: CloudFrontResponseHandler = (event, context, callback) => {
    console.log("%j", event);
    console.log("%j", context);

    const request = event.Records[0].cf.request;
    const response = event.Records[0].cf.response;

    handle(request, response).then((res) => {
        callback(null, res);
    }).catch((err) => {
        console.log("Exception while converting image :%j", err);
    });
};

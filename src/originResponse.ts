import {
    CloudFrontHeaders,
    CloudFrontRequest,
    CloudFrontResponse,
    CloudFrontResponseHandler,
    CloudFrontResultResponse,
} from "aws-lambda";
import lodash from "lodash";
import querystring from "querystring";
import Sharp from "sharp";
import AWS from "./AWS";
import { ALLOWED, BUCKET, DEFAULT_FORMAT } from "./constants";
import { IQuery } from "./definitions";

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

    const path = request.uri.substr(1);
    const originalFormat = path.substr(path.lastIndexOf(".") + 1);
    const format = params.format
        || (lodash.includes(ALLOWED.format, originalFormat) ? originalFormat : DEFAULT_FORMAT);

    console.log(`Fetching ${path} ...`);

    const data = await S3.getObject({
        Bucket: BUCKET,
        Key: path,
    }).promise();

    console.log("Downloaded %j", data);

    let image = Sharp((data.Body as Buffer));
    if (params.size) {
        const [width, height] = params.size.split("x").map((num) => parseInt(num, 10));
        image = image.resize(width, height);
    }
    if (params.color) {
        image = image.toColorspace(params.color);
    }
    image = image.toFormat(format);

    const buf = await image.toBuffer();
    const res = (response as CloudFrontResultResponse);

    res.body = buf.toString("base64");
    res.bodyEncoding = "base64";
    delete (res.headers as CloudFrontHeaders)["content-length"];
    if (format !== originalFormat) {
        (res.headers as CloudFrontHeaders)["content-type"]
            = [{ key: "Content-Type", value: "image/" + format }];
    }

    console.log("%j", res);
    return res;
};

export const handler: CloudFrontResponseHandler = (event) => {
    console.log("%j", event);

    const request = event.Records[0].cf.request;
    const response = event.Records[0].cf.response;

    return handle(request, response);
};

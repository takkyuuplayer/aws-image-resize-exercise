import { CloudFrontHeaders, CloudFrontRequest, CloudFrontResponseHandler, CloudFrontResultResponse } from "aws-lambda";
import lodash from "lodash";
import querystring from "querystring";
import Sharp from "sharp";
import { ALLOWED, DEFAULT_FORMAT } from "./constants";
import { IQuery } from "./definitions";

export const myHandler: CloudFrontResponseHandler = (event, context, callback) => {
    const response = event.Records[0].cf.response as CloudFrontResultResponse;

    if (response.status === "404") {
        console.log("Image not found: %j ", event.Records[0].cf.request);

        callback(null, response);
        return;
    }

    const request = event.Records[0].cf.request;
    const params = querystring.parse(request.querystring) as IQuery;

    if (lodash.isEmpty(params)) {
        callback(null, response);
        return;
    }

    const originalFormat = request.uri.substr(request.uri.lastIndexOf(".") + 1);
    const buffer = response.bodyEncoding === "text"
        ? Buffer.from(response.body as string)
        : Buffer.from(response.body as string, "base64");

    let image = Sharp(buffer);

    if (params.size) {
        const [width, height] = params.size.split("x").map((num) => parseInt(num, 10));
        image = image.resize(width, height);
    }

    const format = params.format
        || (lodash.includes(ALLOWED.format, originalFormat) ? originalFormat : DEFAULT_FORMAT);
    image.toFormat(format);

    image.toBuffer().then((buf) => {
        response.body = buffer.toString("base64");
        response.bodyEncoding = "base64";
        (response.headers as CloudFrontHeaders)["content-type"] = [{ key: "Content-Type", value: "image/" + format }];
        callback(null, response);
    }).catch((err) => {
        console.log("Exception while converting image :%j", err);
    });
};

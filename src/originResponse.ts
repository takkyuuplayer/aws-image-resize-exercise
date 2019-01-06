import {
    CloudFrontHeaders,
    CloudFrontRequest,
    CloudFrontResponseHandler,
    CloudFrontResultResponse,
} from "aws-lambda";
import lodash from "lodash";
import querystring from "querystring";
import Sharp from "sharp";
import { ALLOWED, DEFAULT_FORMAT } from "./constants";
import { IQuery } from "./definitions";

export const handle = async (request: CloudFrontRequest, response: CloudFrontResultResponse)
    : Promise<CloudFrontResultResponse> => {

    if (response.status === "404") {
        console.log("Image not found: %j ", request);

        return response;
    }

    const params = querystring.parse(request.querystring) as IQuery;

    if (lodash.isEmpty(params)) {
        return response;
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
    image = image.toFormat(format);

    const buf = await image.toBuffer();
    response.body = buf.toString("base64");
    response.bodyEncoding = "base64";
    if (format !== originalFormat) {
        (response.headers as CloudFrontHeaders)["content-type"]
            = [{ key: "Content-Type", value: "image/" + format }];
    }
    return response;
};

export const handler: CloudFrontResponseHandler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const response = event.Records[0].cf.response;

    handle(request, response).then((res) => {
        callback(null, res);
    }).catch((err) => {
        console.log("Exception while converting image :%j", err);
    });
};

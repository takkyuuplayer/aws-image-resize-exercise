import { CloudFrontRequest, CloudFrontRequestHandler } from "aws-lambda";
import _ from "lodash";
import querystring from "querystring";

const allowed = {
    format: [
        "png",
        "jpeg",
        "webp",
    ],
    size: [
        "100x100",
        "200x200",
        "300x300",
        "400x400",
    ],
};

interface IQuery {
    format?: string;
    size?: string;
}

export const handleRequest = (request: CloudFrontRequest): CloudFrontRequest => {
    const InvalidQueryException = {};
    const params = querystring.parse(request.querystring) as IQuery;
    let query: IQuery = {};

    const keysToIterateOver = Object.keys(allowed).sort() as Array<keyof IQuery>;
    try {
        keysToIterateOver.forEach((key) => {
            if (!params[key]) {
                return;
            }
            if (!_.includes(allowed[key], params[key])) {
                throw InvalidQueryException;
            }
            query[key] = params[key];
        });
    } catch (InvalidQueryException) {
        query = {};
    }

    request.querystring = querystring.stringify(query);

    return request;
};

// Redirect non-allowed request to original image
export const handler: CloudFrontRequestHandler = (event, context, callback) => {
    const request = event.Records[0].cf.request;

    callback(null, handleRequest(request));
};

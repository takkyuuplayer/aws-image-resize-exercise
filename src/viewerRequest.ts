import { CloudFrontRequest, CloudFrontRequestHandler } from "aws-lambda";
import _ from "lodash";
import querystring from "querystring";
import { ALLOWED } from "./constants";
import { IQuery } from "./definitions";

export const handleRequest = (request: CloudFrontRequest): CloudFrontRequest => {
    const InvalidQueryException = {};
    const params = querystring.parse(request.querystring) as IQuery;
    let query: IQuery = {};

    const keysToIterateOver = Object.keys(ALLOWED).sort() as Array<keyof IQuery>;
    try {
        keysToIterateOver.forEach((key) => {
            if (!params[key]) {
                return;
            }
            if (!_.includes(ALLOWED[key], params[key])) {
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
export const myHandler: CloudFrontRequestHandler = (event, context, callback) => {
    const request = event.Records[0].cf.request;

    callback(null, handleRequest(request));
};

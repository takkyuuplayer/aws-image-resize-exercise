import { CloudFrontRequest, CloudFrontRequestHandler } from "aws-lambda";
import _ from "lodash";
import querystring from "querystring";
import { ALLOWED } from "./constants";
import { IQuery } from "./definitions";

export const handleRequest = (request: CloudFrontRequest): CloudFrontRequest => {
    const InvalidQueryException = {};
    const params = querystring.parse(request.querystring) as IQuery;
    let query: IQuery = {};

    try {
        (Object.keys(ALLOWED) as Array<keyof IQuery>).forEach((key) => {
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

export const handler: CloudFrontRequestHandler = (event, context, callback) => {
    console.log("%j", event);
    console.log("%j", context);

    const request = event.Records[0].cf.request;

    callback(null, handleRequest(request));
};

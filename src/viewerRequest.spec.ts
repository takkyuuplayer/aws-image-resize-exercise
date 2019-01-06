import { CloudFrontRequest } from "aws-lambda";
import { handleRequest } from "./viewerRequest";

describe("viewerRequest", () => {
    describe("handleRequest", () => {
        it("returns original request if no params specified", () => {
            const request: CloudFrontRequest = {
                clientIp: "dummy",
                headers: {},
                method: "GET",
                querystring: "",
                uri: "path/to/s3/object",
            };
            expect(handleRequest(request)).toStrictEqual({
                clientIp: "dummy",
                headers: {},
                method: "GET",
                querystring: "",
                uri: "path/to/s3/object",
            });
        });

        it("changes querystring to alphebetical order so that cloudfront can use cache", () => {
            const request: CloudFrontRequest = {
                clientIp: "dummy",
                headers: {},
                method: "GET",
                querystring: "size=100x100&format=png",
                uri: "path/to/s3/object",
            };
            expect(handleRequest(request)).toStrictEqual({
                clientIp: "dummy",
                headers: {},
                method: "GET",
                querystring: "format=png&size=100x100",
                uri: "path/to/s3/object",
            });
        });

        it("returns original request if format is not allowed", () => {
            const request: CloudFrontRequest = {
                clientIp: "dummy",
                headers: {},
                method: "GET",
                querystring: "size=100x100&format=gif",
                uri: "path/to/s3/object",
            };
            expect(handleRequest(request)).toStrictEqual({
                clientIp: "dummy",
                headers: {},
                method: "GET",
                querystring: "",
                uri: "path/to/s3/object",
            });
        });
        it("returns original request if size is not allowed", () => {
            const request: CloudFrontRequest = {
                clientIp: "dummy",
                headers: {},
                method: "GET",
                querystring: "size=1x1&format=png",
                uri: "path/to/s3/object",
            };
            expect(handleRequest(request)).toStrictEqual({
                clientIp: "dummy",
                headers: {},
                method: "GET",
                querystring: "",
                uri: "path/to/s3/object",
            });
        });
    });
});

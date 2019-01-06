import { CloudFrontRequest, CloudFrontResultResponse } from "aws-lambda";
import fs from "fs";
import sharp = require("sharp");
import { handle } from "./originResponse";

describe("originResponse", () => {
    describe("handle", () => {
        it("returns response as it is, if status = 404", () => {
            const request = {} as CloudFrontRequest;
            const response: CloudFrontResultResponse = {
                status: "404",
            };
            return handle(request, response).then((res) => {
                expect(res).toStrictEqual({
                    status: "404",
                });
            });
        });

        it("returns response as it is, if querystring is empty", () => {
            const request = {
                querystring: "",
            } as CloudFrontRequest;
            const response: CloudFrontResultResponse = {
                body: "foo",
                bodyEncoding: "text",
                status: "200",
            };
            return handle(request, response).then((res) => {
                expect(res).toStrictEqual({
                    body: "foo",
                    bodyEncoding: "text",
                    status: "200",
                });
            });
        });

        it("converts svg to png", () => {
            const svg = fs.readFileSync(__dirname + "/../test/data/android.svg", "utf8");
            const png = fs.readFileSync(__dirname + "/../test/data/android.100x100.png").toString("base64");
            const request = {
                querystring: "format=png&size=100x100",
                uri: "./test/data/android.svg",
            } as CloudFrontRequest;
            const response: CloudFrontResultResponse = {
                body: svg,
                bodyEncoding: "text",
                headers: {
                    "content-type": [{ key: "Content-Type", value: "image/svg+xml" }],
                },
                status: "200",
            };

            return handle(request, response).then((res) => {
                expect(res).toStrictEqual({
                    body: png,
                    bodyEncoding: "base64",
                    headers: {
                        "content-type": [{ key: "Content-Type", value: "image/png" }],
                    },
                    status: "200",
                });
            });
        });

        it("convert svg to png as default if only size is specified", () => {
            const svg = fs.readFileSync(__dirname + "/../test/data/android.svg", "utf8");
            const png = fs.readFileSync(__dirname + "/../test/data/android.100x100.png").toString("base64");
            const request = {
                querystring: "size=100x100",
                uri: "./test/data/android.svg",
            } as CloudFrontRequest;
            const response: CloudFrontResultResponse = {
                body: svg,
                bodyEncoding: "text",
                headers: {
                    "content-type": [{ key: "Content-Type", value: "image/svg+xml" }],
                },
                status: "200",
            };

            return handle(request, response).then((res) => {
                expect(res).toStrictEqual({
                    body: png,
                    bodyEncoding: "base64",
                    headers: {
                        "content-type": [{ key: "Content-Type", value: "image/png" }],
                    },
                    status: "200",
                });
            });
        });

        it("convert png to jpeg", () => {
            const png = fs.readFileSync(__dirname + "/../test/data/android.100x100.png").toString("base64");
            const jpeg = fs.readFileSync(__dirname + "/../test/data/android.100x100.png.jpeg").toString("base64");
            const request = {
                querystring: "format=jpeg",
                uri: "./test/data/android.100x100.png",
            } as CloudFrontRequest;
            const response: CloudFrontResultResponse = {
                body: png,
                bodyEncoding: "base64",
                headers: {
                    "content-type": [{ key: "Content-Type", value: "image/png" }],
                },
                status: "200",
            };

            return handle(request, response).then((res) => {
                expect(res).toStrictEqual({
                    body: jpeg,
                    bodyEncoding: "base64",
                    headers: {
                        "content-type": [{ key: "Content-Type", value: "image/jpeg" }],
                    },
                    status: "200",
                });
            });
        });
    });
});

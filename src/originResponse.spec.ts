import { CloudFrontRequest, CloudFrontResponse } from "aws-lambda";
import fs from "fs";
import sharp = require("sharp");
import { handle } from "./originResponse";

describe("originResponse", () => {
    describe("handle", () => {
        it("returns response as it is, if status = 404", () => {
            const request = {} as CloudFrontRequest;
            const response = {
                status: "404",
            } as CloudFrontResponse;
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
            const response = {
                status: "200",
                statusDescription: "Foo",
            } as CloudFrontResponse;
            return handle(request, response).then((res) => {
                expect(res).toStrictEqual({
                    status: "200",
                    statusDescription: "Foo",
                });
            });
        });

        it("converts svg to png", () => {
            const png = fs.readFileSync(__dirname + "/../test/data/android.100x100.png").toString("base64");
            const request = {
                querystring: "format=png&size=100x100",
                uri: "/android.svg",
            } as CloudFrontRequest;
            const response: CloudFrontResponse = {
                headers: {
                    "content-type": [{ key: "Content-Type", value: "image/svg+xml" }],
                },
                status: "200",
                statusDescription: "OK",
            };

            return handle(request, response).then((res) => {
                if (process.env.CI) {
                    expect(res).toMatchSnapshot();
                } else {
                    expect(res).toStrictEqual({
                        body: png,
                        bodyEncoding: "base64",
                        headers: {
                            "content-type": [{ key: "Content-Type", value: "image/png" }],
                        },
                        status: "200",
                        statusDescription: "OK",
                    });
                }
            });
        });
        it("convert svg to png as default if only size is specified", () => {
            const png = fs.readFileSync(__dirname + "/../test/data/android.100x100.png").toString("base64");
            const request = {
                querystring: "size=100x100",
                uri: "/android.svg",
            } as CloudFrontRequest;
            const response: CloudFrontResponse = {
                headers: {
                    "content-type": [{ key: "Content-Type", value: "image/svg+xml" }],
                },
                status: "200",
                statusDescription: "OK",
            };

            return handle(request, response).then((res) => {
                if (process.env.CI) {
                    expect(res).toMatchSnapshot();
                } else {
                    expect(res).toStrictEqual({
                        body: png,
                        bodyEncoding: "base64",
                        headers: {
                            "content-type": [{ key: "Content-Type", value: "image/png" }],
                        },
                        status: "200",
                        statusDescription: "OK",
                    });
                }
            });
        });

        it("convert png to jpeg", () => {
            const jpeg = fs.readFileSync(__dirname + "/../test/data/android.100x100.png.jpeg").toString("base64");
            const request = {
                querystring: "format=jpeg",
                uri: "/android.100x100.png",
            } as CloudFrontRequest;
            const response: CloudFrontResponse = {
                headers: {
                    "content-type": [{ key: "Content-Type", value: "image/png" }],
                },
                status: "200",
                statusDescription: "OK",
            };

            return handle(request, response).then((res) => {
                if (process.env.CI) {
                    expect(res).toMatchSnapshot();
                } else {
                    expect(res).toStrictEqual({
                        body: jpeg,
                        bodyEncoding: "base64",
                        headers: {
                            "content-type": [{ key: "Content-Type", value: "image/jpeg" }],
                        },
                        status: "200",
                        statusDescription: "OK",
                    });
                }
            });
        });
        it("converts color", () => {
            // const svg = fs.readFileSync(__dirname + "/../test/data/android.svg");
            // sharp(Buffer.from(svg)).toColorspace("b-w").toFile(__dirname + "/../test/data/android.b-w.png");

            const png = fs.readFileSync(__dirname + "/../test/data/android.b-w.png").toString("base64");
            const request = {
                querystring: "color=b-w",
                uri: "/android.svg",
            } as CloudFrontRequest;
            const response: CloudFrontResponse = {
                headers: {
                    "content-type": [{ key: "Content-Type", value: "image/svg+xml" }],
                },
                status: "200",
                statusDescription: "OK",
            };

            return handle(request, response).then((res) => {
                if (process.env.CI) {
                    expect(res).toMatchSnapshot();
                } else {
                    expect(res).toStrictEqual({
                        body: png,
                        bodyEncoding: "base64",
                        headers: {
                            "content-type": [{ key: "Content-Type", value: "image/png" }],
                        },
                        status: "200",
                        statusDescription: "OK",
                    });
                }
            });
        });
    });
});

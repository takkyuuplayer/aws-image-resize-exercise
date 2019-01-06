import fs from "fs";
import sharp from "sharp";
import * as originResponse from "./originResponse";

describe("originResponse", () => {
    const svg = fs.readFileSync(__dirname + "/../test/data/android.svg", "utf8");

    describe("convert", () => {
        it("returns original image if params is not present", async () => {
            const buf = Buffer.from(svg);
            return originResponse.convert(buf, {})
                .then((data) => data.toString("utf-8", 0, data.length))
                .then((data) => expect(data).toStrictEqual(svg));
        });

        it("can change format", async () => {
            const buf = Buffer.from(svg);
            const png = fs.readFileSync(__dirname + "/../test/data/android.png");
            return originResponse.convert(buf, { format: "png" })
                .then((data) => expect(data).toStrictEqual(png));
        });

        it("can change size", async () => {
            const buf = Buffer.from(svg);
            const png = fs.readFileSync(__dirname + "/../test/data/android.300x400.png");
            return originResponse.convert(buf, { format: "png", size: "300x400" })
                .then((data) => expect(data).toStrictEqual(png));
        });

        it("can change color", async () => {
            const buf = Buffer.from(svg);
            const png = fs.readFileSync(__dirname + "/../test/data/android.greyscale.png");
            return originResponse.convert(buf, { format: "png", color: "greyscale" })
                .then((data) => expect(data).toStrictEqual(png));
        });

        it("returns png if the format is not supported", async () => {
            const buf = Buffer.from(svg);
            const png = fs.readFileSync(__dirname + "/../test/data/android.png");
            return originResponse.convert(buf, { format: "gif" })
                .then((data) => expect(data).toStrictEqual(png));
        });
    });
});

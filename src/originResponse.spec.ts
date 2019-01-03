import * as originResponse from "./originResponse";
describe("originResponse", () => {
    describe("convert", () => {
        it("returns original image if params is not present", () => {
            const svg = '<svg><rect x="0" y="0" width="200" height="200" rx="50" ry="50"/></svg>';
            const buf = Buffer.from(svg);
            return originResponse.convert(buf, {})
                .then((data) => data.toString("utf-8", 0, data.length))
                .then((data) => expect(data).toStrictEqual(svg));
        });
    });
});

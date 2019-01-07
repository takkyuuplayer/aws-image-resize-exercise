import AWS from "aws-sdk";

if (process.env.NODE_ENV === "test") {
    AWS.config.update({
        s3: { endpoint: "http://127.0.0.1:4572" },
        s3ForcePathStyle: true,
    });
}

export default AWS;

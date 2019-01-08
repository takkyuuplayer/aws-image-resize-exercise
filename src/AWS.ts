import AWS from "aws-sdk";

if (process.env.NODE_ENV === "test") {
    const host = process.env.AWS_ENDPOINT || "localhost";
    AWS.config.update({
        s3: { endpoint: `http://${host}:4572` },
        s3ForcePathStyle: true,
    });
}

export default AWS;

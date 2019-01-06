[![CircleCI](https://circleci.com/gh/takkyuuplayer/aws-image-resize-exercise.svg?style=svg)](https://circleci.com/gh/takkyuuplayer/aws-image-resize-exercise)

# aws-cloudfront-lambda-image

Image converter with Lambda@Edge

![aws-lambda-edge.png](docs/aws-lambda-edge.png)

| Trigger         | Description                                                               |
| --------------- | ------------------------------------------------------------------------- |
| Viewer Request  | Query validation. If the query is NOT allowed, forward to original image. |
| Origin Request  | Not in use.                                                               |
| Origin Response | Convert image if needed.                                                  |
| Viewer Response | Not in use.                                                               |

## Demo

![android.svg](https://d3vgre4swtghsk.cloudfront.net/android.svg)

## Architecture

### Lambda@Edge

* [TypeScript](https://www.typescriptlang.org/)

## Reference

* [Resizing Images with Amazon CloudFront & Lambda@Edge \| AWS CDN Blog \| Networking & Content Delivery](https://aws.amazon.com/blogs/networking-and-content-delivery/resizing-images-with-amazon-cloudfront-lambdaedge-aws-cdn-blog/)

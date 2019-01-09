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

| path                     | Image                                                                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| android.svg              | [![android.svg](https://d3p1hm6bntztq0.cloudfront.net/android.svg)](https://d3p1hm6bntztq0.cloudfront.net/android.svg)                                       |
| android.svg?format=jpeg  | [![android.svg.jpeg](https://d3p1hm6bntztq0.cloudfront.net/android.svg?format=jpeg)](https://d3p1hm6bntztq0.cloudfront.net/android.svg?format=jpeg)          |
| android.svg?size=200x200 | [![android.svg.200x200.png](https://d3p1hm6bntztq0.cloudfront.net/android.svg?size=200x200)](https://d3p1hm6bntztq0.cloudfront.net/android.svg?size=200x200) |
| android.svg?color=b-w    | [![android.svg.b-w.png](https://d3p1hm6bntztq0.cloudfront.net/android.svg?color=b-w)](https://d3p1hm6bntztq0.cloudfront.net/android.svg?color=b-w)           |

## Architecture

### Lambda@Edge Function

* [TypeScript](https://www.typescriptlang.org/)

### Deployment

* TBA

## Reference

* [Resizing Images with Amazon CloudFront & Lambda@Edge \| AWS CDN Blog \| Networking & Content Delivery](https://aws.amazon.com/blogs/networking-and-content-delivery/resizing-images-with-amazon-cloudfront-lambdaedge-aws-cdn-blog/)

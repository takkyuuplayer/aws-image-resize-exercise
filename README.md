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

## DEMO

| path                                           | Image                                                                                                                                                                                                                           |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| android.svg                                    | [![android.svg](http://d3j1mtqm8uuzbf.cloudfront.net/android.svg)](http://d3j1mtqm8uuzbf.cloudfront.net/android.svg)                                                                                                            |
| android.svg?format=jpeg                        | [![android.svg?format=jpeg](https://d3j1mtqm8uuzbf.cloudfront.net/android.svg?format=jpeg)](https://d3j1mtqm8uuzbf.cloudfront.net/android.svg?format=jpeg)                                                                      |
| android.svg?size=200x200                       | [![android.svg?size=200x200](https://d3j1mtqm8uuzbf.cloudfront.net/android.svg?size=200x200)](https://d3j1mtqm8uuzbf.cloudfront.net/android.svg?size=200x200)                                                                   |
| android.svg?color=b-w                          | [![android.svg?color=b-w](https://d3j1mtqm8uuzbf.cloudfront.net/android.svg?color=b-w)](https://d3j1mtqm8uuzbf.cloudfront.net/android.svg?color=b-w)                                                                            |
| android.svg?color=b-w&size=100x100&format=jpeg | [![android.svg?color=b-w&size=100x100&format=jpeg](https://d3j1mtqm8uuzbf.cloudfront.net/android.svg?color=b-w&size=100x100&format=jpeg)](https://d3j1mtqm8uuzbf.cloudfront.net/android.svg?color=b-w&size=100x100&format=jpeg) |

## HOW TO USE

1. Fix bucket name in `src/constants.ts` and `deployment/Makefile`
2. Fix LambdaS3's bucket name in `deployment/Makefile`. The bucket should be in us-east-1 region.
3. Build

    ```
    $ docker run --volume=$PWD:/srv -w=/srv 8base/docker-amazonlinux-node:node8 make
    $ docker run --volume=$PWD:/srv -w=/srv 8base/docker-amazonlinux-node:node8 make build
    ```
4. Deploy ([Takes 20+ minues...](https://forums.aws.amazon.com/thread.jspa?threadID=237248))

    ```
    make deploy
    ```

5. Confirm

    ```
    $ aws s3 sync ./test/data s3://<BucketName>
    ```

    Refer CloudFront Distribution Domain Name

    ```
    $ cd deployment && make output
    ```

    * https://CloudFrontURL/android.svg
    * https://CloudFrontURL/android.b-w.png?size=100x100

## ARCHITECTURE

### Lambda@Edge Function

* [TypeScript](https://www.typescriptlang.org/)

### CI/CD

* [Workflows \- CircleCI](https://circleci.com/docs/2.0/workflows/)
* [AWS Command Line Interface](https://docs.aws.amazon.com/cli/index.html)

## REFERENCE

* [Resizing Images with Amazon CloudFront & Lambda@Edge \| AWS CDN Blog \| Networking & Content Delivery](https://aws.amazon.com/blogs/networking-and-content-delivery/resizing-images-with-amazon-cloudfront-lambdaedge-aws-cdn-blog/)
* [Managing Lambda@Edge and CloudFront deployments by using a CI/CD pipeline \| Networking & Content Delivery](https://aws.amazon.com/blogs/networking-and-content-delivery/managing-lambdaedge-and-cloudfront-deployments-by-using-a-ci-cd-pipeline/)
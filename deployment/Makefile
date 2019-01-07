DIR=$(dir $(realpath $(firstword $(MAKEFILE_LIST))))
AWS_DEFAULT_REGION=us-east-1
BucketName=tp-image-resize
StackName=tp-image-resize

test:
	aws cloudformation validate-template --template-body file://$(DIR)template.cf.yml

confirm:
	AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION} \
	aws cloudformation deploy \
		--capabilities CAPABILITY_IAM \
		--no-execute-changeset \
		--stack-name ${StackName} \
		--template-file template.cf.yml \
		--parameter-overrides BucketName=${BucketName}
package:
	AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION} \
	aws cloudformation package \
		--template-file template.cf.yml \
		--s3-bucket tp-lambda.us-east-1 \
		--output-template-file packaged.yml

deploy:
	AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION} \
	aws cloudformation deploy \
		--capabilities CAPABILITY_IAM \
		--stack-name ${StackName} \
		--template-file packaged.yml \
		--parameter-overrides BucketName=${BucketName}

output:
	aws cloudformation describe-stacks --stack-name ${StackName}

help:
	@cat Makefile

DIR=$(dir $(realpath $(firstword $(MAKEFILE_LIST))))
AWS_DEFAULT_REGION=us-east-1
BucketName=tp-image-resize
StackName=tp-image-resize
LambdaS3Bucket=tp-tmp.us-east-1

confirm: packaged.yml
	AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION} \
	aws cloudformation deploy \
		--capabilities CAPABILITY_IAM \
		--no-execute-changeset \
		--stack-name ${StackName} \
		--template-file packaged.yml \
		--parameter-overrides BucketName=${BucketName}

packaged.yml:
	cd ${DIR}/../dist && zip -FS -q -r viewerRequest.zip viewerRequest.js
	cd ${DIR}/../dist && zip -FS -q -r originResponse.zip originResponse.js node_modules
	AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION} \
	aws cloudformation package \
		--template-file template.cf.yml \
		--s3-bucket ${LambdaS3Bucket} \
		--output-template-file packaged.yml

deploy: packaged.yml
	AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION} \
	aws cloudformation deploy \
		--capabilities CAPABILITY_IAM \
		--stack-name ${StackName} \
		--template-file packaged.yml \
		--parameter-overrides BucketName=${BucketName}
	$(MAKE) output

output:
	AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION} \
	aws cloudformation describe-stacks --stack-name ${StackName}

help:
	@cat Makefile

.PHONY: packaged.yml

#!/bin/bash
#  this project name is used in many of the object names for several of the cloudformation stacks
export PROJECT_NAME=jphmenu
#  staging bucket name to initially hold code uploaded from this github
export S3_BUCKET=${PROJECT_NAME}-s3-stage-bucket
export LOCAL_IP=`curl http://checkip.amazonaws.com/`

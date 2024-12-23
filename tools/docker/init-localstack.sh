#!/bin/bash

awslocal s3api create-bucket --bucket hssdev --create-bucket-configuration LocationConstraint=eu-central-1 --region eu-central-1 2> /dev/null

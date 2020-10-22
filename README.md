# slack-widget-proxy

Deploy via:
```
sls deploy --token <MY_SLACK_APP_OAUTH_TOKEN> --bucket <S3_BUCKET_ID>
```

## Variables to determine

* OAuth token
* S3 bucket to store object cache

## Getting setup

* Configure Lambda environment
* Configure S3 bucket for object cache
* Determine token for OAuth


## Questions

Is there a need to encrypt the data to and from the S3 bucket? Seems like this data is publicly visible anyway.
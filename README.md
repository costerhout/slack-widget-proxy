# slack-widget-proxy

## What you need to get started

* OAuth token for a Slack App with scopes:
  * users.profile:read
  * users:read
* S3 bucket to store object cache. You'll need to know the region as well as the bucket name.

Deploy via:
```
sls deploy --token <MY_SLACK_APP_OAUTH_TOKEN> --bucket <S3_BUCKET_ID> --region <Amazon region ID, e.g. 'us-west-1'>
```

It'll then return a set of URLs for you to use in the front end portion of the app.
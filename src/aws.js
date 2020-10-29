/**
 * @Author: Colin Osterhout <ctosterhout>
 * @Date:   2020-10-21T18:11:05-08:00
 * @Email:  ctosterhout@alaska.edu
 * @Project: ernie
 * @Last modified by:   ctosterhout
 * @Last modified time: 2020-10-28T22:37:11-08:00
 * @License: Released under MIT License. Copyright 2020 University of Alaska Southeast.  For more details, see https://opensource.org/licenses/MIT
 */

// Patterns in this module adapted from the developer's guide:
// https://docs.aws.amazon.com/lambda/latest/dg/with-s3-example-deployment-pkg.html

const dayjs = require('dayjs');
const bucketId = process.env.bucket;
const region = process.env.region;
const maxAge = 24; // Max age of the cache, in hours
const AWS = require('aws-sdk');
const s3 = new AWS.S3({ region });

// loadObjectCache — get an object from the bucket with the given key
const loadObjectCache = async (srcKey) => {
  const expirationDateTimestamp = dayjs(new Date()).subtract(maxAge, 'hours').toDate();
  const params = {
    Bucket: bucketId,
    Key: srcKey,
    IfModifiedSince: expirationDateTimestamp
  };
  
  try {
    const obj = await s3.getObject(params).promise();
    
    // The data is returned as a node.js buffer — convert that to string and parse it.
    return JSON.parse(obj.Body.toString());
  } catch (error) {
    console.log(error);
    // Gracefully catch an error and return undefined
    return undefined;
  } 
}

// storeObjectCache — put an object (data) in the bucket with the given key
const storeObjectCache = async (key, data) => {
  // Serialize the JS data object as a JSON string
  const params = {
    Bucket: bucketId,
    Key: key,
    Body: JSON.stringify(data),
    ContentType: "application/json"
  };
  
  try {
    await s3.putObject(params).promise();  
  } catch (error) {
    console.log(error);
  }
  
}

module.exports = {
  loadObjectCache,
  storeObjectCache
};
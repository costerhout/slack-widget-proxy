'use strict';

const { getProfile } = require('../slack');

module.exports.handleViewProfile = async event => {
  const profile = await getProfile(event.pathParameters.id);
  
  // If we're successful grabbing a profile, great. Return that with a 200 response. Otherwise, give a 404 and a simple error message  
  const response = profile ?
    {
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
      },
      statusCode: 200,
      body: JSON.stringify(profile)
    } :
    {
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
      },
      statusCode: 404,
      body: JSON.stringify({
        message: 'User profile not found'
      })
    };
    
  return response;
};
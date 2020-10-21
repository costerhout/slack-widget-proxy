'use strict';

const { getProfile } = require('../slack');

module.exports.handleViewProfile = async event => {
  const profile = await getProfile(event.pathParameters.id);
  
  return {
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
    },
    statusCode: 200,
    body: JSON.stringify(profile,
      null,
      2
    ),
  };
};
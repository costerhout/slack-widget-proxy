'use strict';
const { getUsers } = require('../slack');

module.exports.handleListProfiles = async event => {
  const users = await getUsers();
  
  return {
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
    },
    statusCode: 200,
    body: JSON.stringify(users),
  };
};

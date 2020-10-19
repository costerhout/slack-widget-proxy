'use strict';
const { getUsers, getProfile } = require('../slack');

module.exports.handleViewProfile = async event => {
  const users = await getUsers();
  const profile = await getProfile(users[0].id);
  
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

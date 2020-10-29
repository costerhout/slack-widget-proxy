/**
 * @Author: Colin Osterhout <ctosterhout>
 * @Date:   2020-10-20T19:37:17-08:00
 * @Email:  colixx@gmail.com
 * @Project: slack-widget-proxy
 * @Last modified by:   ctosterhout
 * @Last modified time: 2020-10-28T23:48:47-08:00
 * @License: MIT
 */

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

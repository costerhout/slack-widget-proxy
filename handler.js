'use strict';

const {
  WebClient
} = require('@slack/web-api');

const token = process.env.token;
const web = new WebClient(token);

// Grab list of all the users
const getUsers = async () => {
  const limit = 50;
  let records = [];
  let keepGoing = true;
  let cursor = undefined;
  
  while (keepGoing) {
    let response = await web.users.list({
      limit: limit,
      cursor: cursor
    });
    await records.push.apply(records, response.members);
    cursor = response.response_metadata.next_cursor;
    
    // keepGoing = response.ok && cursor !== '';
    keepGoing = false;
  }

  return records;
}

const getProfile = async (user) => {
  // todo: consider caching labels from team.profile.get
  let profile = await web.users.profile.get({
    user: user,
    include_labels: false
  });
  
  return profile;
}

module.exports.hello = async event => {
  const users = await getUsers();
  const profile = await getProfile(users[0].id);
  
  return {
    statusCode: 200,
    body: JSON.stringify(profile,
      null,
      2
    ),
  };
};

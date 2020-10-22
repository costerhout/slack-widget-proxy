'use strict';

const {
  WebClient
} = require('@slack/web-api');
const {
  loadObjectCache,
  storeObjectCache
} = require('./aws');

const token = process.env.token;
const web = new WebClient(token);
const keyAllUsers = '__all_users';

// Grab list of all the users
const getUsers = async () => {  
  const loadFreshUserList = async () => {
    const limit = 100;  // this is arbitrary — the documentation was not specific.
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
      
      keepGoing = response.ok && cursor !== '';
    }
    
    // Store in the cache for next time
    storeObjectCache(keyAllUsers, records);
    return records;
  }
  
  // Attempt to load the user list from the cache first
  const recordsFromCache = await loadObjectCache(keyAllUsers);

  // If we were successful with loading the list from the cache, return that.
  // Otherwise, get a fresh set of users
  return recordsFromCache ?
    recordsFromCache :
    await loadFreshUserList();
}

const getProfile = async (user) => {
  // Attempt to load the user list from the cache first
  const recordFromCache = await loadObjectCache(user);
  
  const loadFreshUserProfile = async () => {
    try {
      const data = await web.users.profile.get({
        user: user,
        include_labels: false
      });
      
      // Store in the cache for next time
      storeObjectCache(user, data.profile);
      
      return data.profile;  
    } catch (err) {
      // Store this away in the logs for debug and return undefined gracefully
      console.log(err)
      
      return undefined;
    }
  }
  
  // If we were successful with loading the list from the cache, return that.
  // Otherwise, get a fresh set of users
  return recordFromCache ?
    recordFromCache :
    await loadFreshUserProfile();  
}

module.exports = {
  getUsers,
  getProfile
}
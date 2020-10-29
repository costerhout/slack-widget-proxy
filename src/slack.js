/**
 * @Author: Colin Osterhout <ctosterhout>
 * @Date:   2020-10-18T15:26:08-08:00
 * @Email:  colixx@gmail.com
 * @Project: slack-widget-proxy
 * @Last modified by:   ctosterhout
 * @Last modified time: 2020-10-28T23:48:44-08:00
 * @License: MIT
 */

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
    const isUser = (member) => ('id' in member) && !(member.is_bot || member.is_app_user)
    const limit = 200;  // this is arbitrary — the documentation was not specific.
    let records = [];
    let keepGoing = true;
    let cursor = undefined;

    while (keepGoing) {
      try {
        let response = await web.users.list({
          limit: limit,
          cursor: cursor
        });
        
        if (response.ok) {
          // push only real users, neither bots nor apps
          records.push.apply(records, response.members.filter(isUser));
          
          // set up the fetch cursor for next time.
          // This is an area that could be optimized to allow for server-side pagination
          cursor = response.response_metadata.next_cursor;
          keepGoing = response.ok && cursor !== ''; 
        } else if ('error' in response) {
          throw new Error(response.error)
        } else {
          throw new Error('Unable to retrieve users list')
        }      
      } catch (error) {
        console.error(error);
      } 
    }
    
    // Store in the cache for next time
    await storeObjectCache(keyAllUsers, records);  
    
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
      
      if (data.ok) {
        // Store in the cache for next time
        storeObjectCache(user, data.profile);  
      } else if ('error' in data) {
        throw new Error(data.error)
      } else {
        throw new Error('Unable to retrieve profile')
      }
      
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
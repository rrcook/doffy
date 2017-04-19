"use strict";

let nforce = require('nforce'),

    SF_CLIENT_ID = process.env.SF_CLIENT_ID,
    SF_CLIENT_SECRET = process.env.SF_CLIENT_SECRET,
    SF_USER_NAME = process.env.SF_USER_NAME,
    SF_PASSWORD = process.env.SF_PASSWORD,
    SF_TOKEN = process.env.SF_TOKEN;

let org = nforce.createConnection({
    clientId: SF_CLIENT_ID,
    clientSecret: SF_CLIENT_SECRET,
    redirectUri: 'http://localhost:3000/oauth/_callback',
    environment: 'sandbox',
    mode: 'single',
    autoRefresh: true
});

let login = (callback) => {
    return new Promise((resolve, reject) => {
        org.authenticate({username: SF_USER_NAME, password: SF_PASSWORD, securityToken: SF_TOKEN}, err =>  {
            if (err) {
                console.log("Authentication error");
                console.log(err);
                reject(err);
            } else {
                console.log("Authentication successful");
                resolve();
            }
        });
    });

};

let findTodaysOrders = () => {
    return new Promise((resolve, reject) => {
        let q = `SELECT Id,Remote_Order_Status__c  FROM Order WHERE Remote_Order_Status__c LIKE 'Sterling%' AND CreatedDate > LAST_WEEK`;
        org.query({query: q}, (err, resp) => {
            if (err) {
                console.log(err);
                reject("An error as occurred");
            } else {
                resolve(resp.records);
            }
        });
    });

};

let findErrors = () => {
    return new Promise((resolve, reject) => {
        let q = `SELECT Account.Name, Id,Remote_Order_Status__c,Remote_Order_Status_Message__c
                 FROM Order WHERE Remote_Order_Status__c = 'Sterling Error'
                 ORDER BY CreatedDate DESC LIMIT 3`;
        org.query({query: q}, (err, resp) => {
            if (err) {
                console.log(err);
                reject("An error as occurred");
            } else {
                resolve(resp.records);
            }
        });
    });

};

// let findUsers = () => {
//     return new Promise((resolve, reject) => {
//         let q = `SELECT id FROM user`;
//         org.query({query: q}, (err, resp) => {
//             if (err) {
//                 console.log(err);
//                 reject("An error as occurred");
//             } else {
//                 resolve(resp.records);
//             }
//         });
//     });
//
// };

exports.login = login;
// exports.findUsers = findUsers;
exports.findTodaysOrders = findTodaysOrders;
exports.findErrors = findErrors;

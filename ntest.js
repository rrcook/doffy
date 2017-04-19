"use strict";

let force = require('./force');

force.login()
  .then(() => force.findTodaysOrders())
  .then(results => {
    results.map(result => console.log(result._fields.remote_order_status__c));
    // console.log(results);
    console.log(`length is ${results.length}`);
  })
  .then(() => force.findErrors())
  .then(results => {
    results.map(result => console.log(`Account ${result._fields.account.Name} has the error ${result._fields.remote_order_status_message__c}`));
    // results.map(result => console.log(result._fields));
  });

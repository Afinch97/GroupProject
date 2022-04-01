#!/usr/bin/env node

import { $, argv } from 'zx';

/**
 * Script used to run both the flask server and the Parcel bundler in parallel
 * or clear js folder and build and run if in production mode
 * 
 * Run this script with argument --prod for production mode
 */


// this is in the format filename:appname, 
// if either or both are different in your Flask project change it to that
process.env.FLASK_APP = 'app:app'; 

if (argv.prod) {
  // builds the React part first and then runs the Flask app in production mode
  await $`npx parcel build`;
  await $`flask run`;
} else {
  process.env.FLASK_ENV = 'development'; // to enable debug features in Flask
  // this is what runs both processes in parallel, Promise.all executes all promises in the array in parallel
  // zx returns the result of $ commands as promises
  await Promise.all([
    $`npx parcel watch`,
    $`flask run`,
  ]);
}

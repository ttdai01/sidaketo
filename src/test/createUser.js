'use strict';

// tests for createUser
// Generated by serverless-mocha-plugin

const mochaPlugin = require('serverless-mocha');
const expect = mochaPlugin.chai.expect;
let wrapped = mochaPlugin.getWrapper('createUser', '../../../src/functions/createUser.js', 'createUser');
const AWS = require('aws-sdk-mock')
const AWS_SDK = require('aws-sdk')
AWS.setSDKInstance(AWS_SDK)
describe('createUser', () => {
  before((done) => {
    done();
  });

  it('implement tests here', async () => {
    const response = await wrapped.run({});
    expect(response).to.not.be.empty;
  });
});

// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

var assert = require('chai').assert;
var uuid = require('uuid');
var debug = require('debug')('azure-iot-provisioning-device-e2e');
var certHelper = require('./cert_helper');

var provisioningServiceClient = require('azure-iot-provisioning-service').ProvisioningServiceClient;

var serviceClient = provisioningServiceClient.fromConnectionString(process.env.IOT_PROVISIONING_SERVICE_CONNECTION_STRING);

var enrollment = {
  registrationId: 'e2e-node-deleteme-psc-' + uuid.v4(),
  attestation: {
    type: 'tpm',
    tpm: {
      endorsementKey: "AToAAQALAAMAsgAgg3GXZ0SEs/gakMyNRqXXJP1S124GUgtk8qHaGzMUaaoABgCAAEMAEAgAAAAAAAEAtKEADl/sNRgmYAjP6gXmbccRaJoTnVixisUaek0OwAzFGN70xt9ZOYp6fhIwfcft3fdVKOrKpXYcTe72CGNkGJGlQz5ti9n2pQ0uJhcX8aefh4Onm7lVlUCQAVp1K0r6zI8vkEXWsBIvwvxk0eMJbFaq146kbTkJHIGczb89RkFH2TX+CgXeZOG9oXQzUNwktmTUacspamune5Wywc/ce8HsDFYchyUHogFhrZ/LPnzyTDXO8sSC5z5dvsUBtUME3iRYDyKgZOfBtmRMqQewD+4iH+ZEJjtsyJiWR8hFhyKROnOuqXfNFwjd5IcNU4wtlKO0cLyXmTOfQK6Da1pr5Q=="
    }
  },
  provisioningStatus: "enabled",
  capabilities: {
    iotEdge: true
  },
  reprovisionPolicy: {
    updateHubAssignment: true,
    migrateDeviceData: true
  },
  allocationPolicy: 'custom',
  customAllocationDefinition: {
    webhookUrl: 'https://web.hook',
    apiVersion: '2019-03-31'
  }
};

var symmetricKeyEnrollment = {
  registrationId: 'e2e-node-deleteme-psc-' + uuid.v4(),
  attestation: {
    type: 'symmetricKey',
    symmetricKey: {
      primaryKey: Buffer.from(uuid.v4()).toString('base64'),
      secondaryKey: Buffer.from(uuid.v4()).toString('base64')
    }
  },
  provisioningStatus: "enabled",
  reprovisionPolicy: {
    updateHubAssignment: false,
    migrateDeviceData: false
  },
  allocationPolicy: 'hashed'
};

var enrollmentGroup = {
  enrollmentGroupId: 'e2e-node-deleteme-psc-' + uuid.v4(),
  attestation: {
    type: 'x509',
    x509: {
      signingCertificates: {
        primary: {
          certificate: ''
        }
      }
    }
  },
  provisioningStatus: "enabled",
  reprovisionPolicy: {
    updateHubAssignment: true,
    migrateDeviceData: false
  },
  allocationPolicy: 'geoLatency'
};

var symmetricKeyEnrollmentGroup = {
  enrollmentGroupId: 'e2e-node-deleteme-psc-' + uuid.v4(),
  attestation: {
    type: 'symmetricKey',
    symmetricKey: {
      primaryKey: Buffer.from(uuid.v4()).toString('base64'),
      secondaryKey: Buffer.from(uuid.v4()).toString('base64')
    }
  },
  provisioningStatus: "enabled",
  reprovisionPolicy: {
    updateHubAssignment: false,
    migrateDeviceData: true
  },
  allocationPolicy: 'static'
};

describe('Provisioning Service Client: CRUD operations', function () {
  this.timeout(60000);
  before(function(done) {
    certHelper.createIntermediateCaCert('test cert', null, function(err, cert) {
      if (err) {
        done(err);
      } else {
        enrollmentGroup.attestation.x509.signingCertificates.primary.certificate = cert.cert;
        done();
      }
    });
  });

  var testSpecification = [
    {
      getFunction: serviceClient.getIndividualEnrollment.bind(serviceClient),
      deleteFunction: serviceClient.deleteIndividualEnrollment.bind(serviceClient),
      getAttestationMechanismFunction: serviceClient.getIndividualEnrollmentAttestationMechanism.bind(serviceClient),
      testDescription: 'IndividualEnrollment object with TPM',
      idPropertyName: 'registrationId',
      createFunction: serviceClient.createOrUpdateIndividualEnrollment.bind(serviceClient),
      updateFunction: serviceClient.createOrUpdateIndividualEnrollment.bind(serviceClient),
      enrollmentObject: enrollment
    },
    {
      getFunction: serviceClient.getIndividualEnrollment.bind(serviceClient),
      deleteFunction: serviceClient.deleteIndividualEnrollment.bind(serviceClient),
      getAttestationMechanismFunction: serviceClient.getIndividualEnrollmentAttestationMechanism.bind(serviceClient),
      testDescription: 'IndividualEnrollment object with symmetric keys',
      idPropertyName: 'registrationId',
      createFunction: serviceClient.createOrUpdateIndividualEnrollment.bind(serviceClient),
      updateFunction: serviceClient.createOrUpdateIndividualEnrollment.bind(serviceClient),
      enrollmentObject: symmetricKeyEnrollment
    },
    {
      getFunction: serviceClient.getEnrollmentGroup.bind(serviceClient),
      deleteFunction: serviceClient.deleteEnrollmentGroup.bind(serviceClient),
      getAttestationMechanismFunction: serviceClient.getEnrollmentGroupAttestationMechanism.bind(serviceClient),
      testDescription: 'EnrollmentGroup object with x509',
      idPropertyName: 'enrollmentGroupId',
      createFunction: serviceClient.createOrUpdateEnrollmentGroup.bind(serviceClient),
      updateFunction: serviceClient.createOrUpdateEnrollmentGroup.bind(serviceClient),
      enrollmentObject: enrollmentGroup
    },
    {
      getFunction: serviceClient.getEnrollmentGroup.bind(serviceClient),
      deleteFunction: serviceClient.deleteEnrollmentGroup.bind(serviceClient),
      getAttestationMechanismFunction: serviceClient.getEnrollmentGroupAttestationMechanism.bind(serviceClient),
      testDescription: 'EnrollmentGroup object with symmetric keys',
      idPropertyName: 'enrollmentGroupId',
      createFunction: serviceClient.createOrUpdateEnrollmentGroup.bind(serviceClient),
      updateFunction: serviceClient.createOrUpdateEnrollmentGroup.bind(serviceClient),
      enrollmentObject: symmetricKeyEnrollmentGroup
    }
  ];
  testSpecification.forEach(function(testConfiguration) {
    describe('#Create', function() {
      let enrollmentForCreateTest = {};
      afterEach(function(done) {
        debug('In afterEach of #Create: before get: enrollment record etag: ' + enrollmentForCreateTest.etag);
        debug('In afterEach of #Create: before get: entire enrollment record' + JSON.stringify(enrollmentForCreateTest));
        testConfiguration.getFunction(enrollmentForCreateTest[testConfiguration.idPropertyName], function (err, getResult) {
          if (err) {
            debug(err);
          } else {
            debug('In afterEach of #Create: after get: enrollment record etag: ' + enrollmentForCreateTest.etag);
            debug('In afterEach of #Create: just before delete: getResult - ' + JSON.stringify(getResult));
            testConfiguration.deleteFunction(getResult, function(err) {
              if (err) {
                debug(err);
              }
              assert.isNull(err, 'Non null response from the delete AFTER create.');
              done();
            });
          }
        });
      });
      it(testConfiguration.testDescription, function(callback) {
        testConfiguration.createFunction(testConfiguration.enrollmentObject, function(err, returnedEnrollment) {
          if (err) {
            debug(err);
          }
          debug('In #Create after Create - returned enrollment is: ' + JSON.stringify(returnedEnrollment));
          assert.isNull(err,'Should be no error from the create');
          enrollmentForCreateTest = returnedEnrollment;
          callback();
        });
      });
    });
  });

  testSpecification.forEach(function(testConfiguration) {
    describe('#Delete', function() {
      let enrollmentForDeleteTest = {};
      beforeEach(function(done) {
        debug('In beforeEach for #delete - config enrollmentObject is: ' + JSON.stringify(testConfiguration.enrollmentObject));
        testConfiguration.createFunction(testConfiguration.enrollmentObject, function(err, returnedEnrollment) {
          if (err) {
            debug(err);
          }
          assert.isNull(err, 'Should be no error from the BEFORE create');
          debug('In beforeEach for #delete - returnedEnrollment is: ' + JSON.stringify(returnedEnrollment));
          enrollmentForDeleteTest = returnedEnrollment;
          done();
        });
      });
      it(testConfiguration.testDescription, function(callback) {
        debug('In test for #Delete - enrollmentForDeleteTest is: ' + JSON.stringify(enrollmentForDeleteTest));
        testConfiguration.deleteFunction(enrollmentForDeleteTest[testConfiguration.idPropertyName], enrollmentForDeleteTest.etag, function(err) {
          if (err) {
            debug(err);
          }
          assert.isNull(err, 'Non null response from the delete.');
          callback();
        });
      });
    });
  });

  testSpecification.forEach(function(testConfiguration) {
    describe('#Update', function() {
      let enrollmentReturnedFromUpdate = {};
      let enrollmentToUpdate = {};
      beforeEach(function(done) {
        debug('in beforeEach of #Update - enrollment to create is: ' + JSON.stringify(testConfiguration.enrollmentObject));
        testConfiguration.createFunction(testConfiguration.enrollmentObject, function(err, returnedEnrollment) {
          if (err) {
            debug(err);
          }
          assert.isNull(err, 'Should be no error from the create');
          debug('In beforeEach of #Update - returnedEnrollment is: ' + JSON.stringify(returnedEnrollment));
          enrollmentToUpdate = returnedEnrollment;
          done();
        });
      });
      afterEach(function(done) {
        debug('In afterEach of #Update - enrollmentReturnedFromUpdate is: ' + JSON.stringify(enrollmentReturnedFromUpdate));
        testConfiguration.deleteFunction(enrollmentReturnedFromUpdate, function(err) {
          if (err) {
            debug(err);
          }
          assert.isNull(err, 'Non null response from the delete AFTER create.');
          done();
        });
      });
      it(testConfiguration.testDescription, function(callback) {
        enrollmentToUpdate.provisioningStatus = 'disabled';
        debug('In test for #Update - enrollmentToUpdate is: ' + JSON.stringify(enrollmentToUpdate));
        testConfiguration.updateFunction(enrollmentToUpdate, function(err, updatedEnrollment) {
          if (err) {
            debug(err);
          }
          assert.isNull(err);
          assert.equal(updatedEnrollment.provisioningStatus, 'disabled', 'provisioning state not disabled');
          debug('In test for #Update - updatedEnrollment is: ' + JSON.stringify(updatedEnrollment));
          enrollmentReturnedFromUpdate = updatedEnrollment;
          callback();
        });
      });
    });
  });

  testSpecification.forEach(function(testConfiguration) {
    describe('#getAttestationMechanism', function () {
      let enrollmentToVerify = {};
      beforeEach(function(done) {
        debug('in beforeEach for #getAttest - enrollmentObject is: ' + JSON.stringify(testConfiguration.enrollmentObject));
        testConfiguration.createFunction(testConfiguration.enrollmentObject, function(err, returnedEnrollment) {
          if (err) {
            debug(err);
          }
          assert.isNull(err, 'Should be no error from the create');
          debug('In beforeEach for #getAttest - returnedEnrollment is: ' + JSON.stringify(returnedEnrollment));
          enrollmentToVerify = returnedEnrollment;
          done();
        });
      });
      afterEach(function(done) {
        debug('in afterEach of #getAttest - enrollmentToVerify to be deleted is: ' + JSON.stringify(enrollmentToVerify));
        testConfiguration.deleteFunction(enrollmentToVerify, function(err) {
          if (err) {
            debug(err);
          }
          assert.isNull(err, 'Non null response from the delete AFTER create.');
          done();
        });
      });
      it(testConfiguration.testDescription, function(done) {
        debug('In test of getAttest - enrollmentToVerify is: ' + JSON.stringify(enrollmentToVerify));
        testConfiguration.getAttestationMechanismFunction(enrollmentToVerify[testConfiguration.idPropertyName], function (err, attestationMechanism) {
          if (err) {
            debug(err);
          }
          assert.isNull(err);
          assert.strictEqual(testConfiguration.enrollmentObject.attestation.type, attestationMechanism.type);
          done();
        });
      });
    });
  });
});

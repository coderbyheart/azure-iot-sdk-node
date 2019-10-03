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
  testSpecification.forEach((testConfiguration) => {
    describe('#Create', () => {
      let enrollmentForCreateTest = {};
      after((callbackForAfterOfCreate) => {
        debug('In after of #Create: before get: enrollment record etag: ' + enrollmentForCreateTest.etag);
        debug('In after of #Create: before get: entire enrollment record' + JSON.stringify(enrollmentForCreateTest));
        testConfiguration.getFunction(enrollmentForCreateTest[testConfiguration.idPropertyName], (getErr, getResult) => {
          if (getErr) {
            debug(getErr);
          } else {
            debug('In after of #Create: after get: enrollment record etag: ' + enrollmentForCreateTest.etag);
            debug('In after of #Create: just before delete: getResult - ' + JSON.stringify(getResult));
            let createContextUuid = uuid.v4();
            testConfiguration.deleteFunction(getResult, (deleteErr) => {
              debug('In after of #Create: just AFTER delete invocation: contextId is: ' + createContextUuid);
              debug('In after of #Create: just AFTER delete invocation: getResult - ' + JSON.stringify(getResult));
              if (deleteErr) {
                debug(deleteErr);
              }
              assert.isNull(deleteErr, 'Non null response from the delete AFTER create.');
              callbackForAfterOfCreate();
            });
          }
        });
      });
      it(testConfiguration.testDescription, (callbackForItOfCreate) => {
        debug('In #Create IT with enrollment object: ' + JSON.stringify(testConfiguration.enrollmentObject));
        testConfiguration.createFunction(testConfiguration.enrollmentObject, (createErr, returnedEnrollment) => {
          if (createErr) {
            debug(createErr);
          }
          debug('In #Create IT after Create - returned enrollment is: ' + JSON.stringify(returnedEnrollment));
          assert.isNull(createErr,'Should be no error from the create');
          enrollmentForCreateTest = returnedEnrollment;
          callbackForItOfCreate();
        });
      });
    });
  });

  testSpecification.forEach((testConfiguration) => {
    describe('#Delete', () => {
      let enrollmentForDeleteTest = {};
      before((callbackForBeforeOfDelete) => {
        debug('In before for #delete - config enrollmentObject is: ' + JSON.stringify(testConfiguration.enrollmentObject));
        testConfiguration.createFunction(testConfiguration.enrollmentObject, (createErr, returnedEnrollment) => {
          if (createErr) {
            debug(createErr);
          }
          assert.isNull(createErr, 'Should be no error from the BEFORE create');
          debug('In before for #delete - returnedEnrollment is: ' + JSON.stringify(returnedEnrollment));
          enrollmentForDeleteTest = returnedEnrollment;
          callbackForBeforeOfDelete();
        });
      });
      it(testConfiguration.testDescription, (callbackForItOfDelete) => {
        debug('In IT for #Delete - enrollmentForDeleteTest is: ' + JSON.stringify(enrollmentForDeleteTest));
        let deleteContextUuid = uuid.v4();
        testConfiguration.deleteFunction(enrollmentForDeleteTest[testConfiguration.idPropertyName], enrollmentForDeleteTest.etag, (deleteError) => {
          debug('In IT for #Delete - after delete invocation - contextUuid is: ' + deleteContextUuid);
          debug('In IT for #Delete - after delete invocation - enrollmentForDeleteTest is: ' + JSON.stringify(enrollmentForDeleteTest));
          if (deleteError) {
            debug(deleteError);
          }
          assert.isNull(deleteError, 'Non null response from the delete.');
          callbackForItOfDelete();
        });
      });
    });
  });

  testSpecification.forEach((testConfiguration) => {
    describe('#Update', () => {
      let enrollmentReturnedFromUpdate = {};
      let enrollmentToUpdate = {};
      before((callbackForAfterOfUpdate) => {
        debug('in before of #Update - enrollment to create is: ' + JSON.stringify(testConfiguration.enrollmentObject));
        testConfiguration.createFunction(testConfiguration.enrollmentObject, (createErr, returnedEnrollment) => {
          if (createErr) {
            debug(createErr);
          }
          assert.isNull(createErr, 'Should be no error from the create');
          debug('In before of #Update - returnedEnrollment is: ' + JSON.stringify(returnedEnrollment));
          enrollmentToUpdate = returnedEnrollment;
          callbackForAfterOfUpdate();
        });
      });
      after((callbackForAfterOfUpdate) => {
        debug('In after of #Update - enrollmentReturnedFromUpdate is: ' + JSON.stringify(enrollmentReturnedFromUpdate));
        let updateContextUuid = uuid.v4();
        testConfiguration.deleteFunction(enrollmentReturnedFromUpdate, (deleteErr) => {
          debug('In after for #update after delete invocation - context uuid is: ' + updateContextUuid);
          debug('In after for #update after delete invocation for enrollmentReturnedFromUpdate: ' + JSON.stringify(enrollmentReturnedFromUpdate));
          if (deleteErr) {
            debug(deleteErr);
          }
          assert.isNull(deleteErr, 'Non null response from the delete AFTER create.');
          callbackForAfterOfUpdate();
        });
      });
      it(testConfiguration.testDescription, (callbackForItOfUpdate) => {
        enrollmentToUpdate.provisioningStatus = 'disabled';
        debug('In IT test for #Update - enrollmentToUpdate is: ' + JSON.stringify(enrollmentToUpdate));
        testConfiguration.updateFunction(enrollmentToUpdate, (updateErr, updatedEnrollment) => {
          if (updateErr) {
            debug(updateErr);
          }
          assert.isNull(updateErr);
          assert.equal(updatedEnrollment.provisioningStatus, 'disabled', 'provisioning state not disabled');
          debug('In IT test for #Update - updatedEnrollment is: ' + JSON.stringify(updatedEnrollment));
          enrollmentReturnedFromUpdate = updatedEnrollment;
          callbackForItOfUpdate();
        });
      });
    });
  });

  testSpecification.forEach((testConfiguration) => {
    describe('#getAttestationMechanism', () => {
      let enrollmentToVerify = {};
      before((callbackForBeforeOfGetAttestation) => {
        debug('in before for #getAttest - enrollmentObject is: ' + JSON.stringify(testConfiguration.enrollmentObject));
        testConfiguration.createFunction(testConfiguration.enrollmentObject, (createError, returnedEnrollment) => {
          if (createError) {
            debug(createError);
          }
          assert.isNull(createError, 'Should be no error from the create');
          debug('In before for #getAttest - returnedEnrollment is: ' + JSON.stringify(returnedEnrollment));
          enrollmentToVerify = returnedEnrollment;
          callbackForBeforeOfGetAttestation();
        });
      });
      after((callbackForAfterOfGetAttestation) => {
        debug('in after of #getAttest - enrollmentToVerify to be deleted is: ' + JSON.stringify(enrollmentToVerify));
        let getAttestContextUuid = uuid.v4();
        testConfiguration.deleteFunction(enrollmentToVerify, (deleteError) => {
          debug('in after of #getAttest AFTER delete invocation - getAttestContextUuid is: ' + getAttestContextUuid);
          debug('in after of #getAttest AFTER delete invocation - enrollmentToVerify deleted is: ' + JSON.stringify(enrollmentToVerify));
          if (deleteError) {
            debug(deleteError);
          }
          assert.isNull(deleteError, 'Non null response from the delete AFTER create.');
          callbackForAfterOfGetAttestation();
        });
      });
      it(testConfiguration.testDescription, (callbackForItOfGetAttestation) => {
        debug('In IT test of getAttest - enrollmentToVerify is: ' + JSON.stringify(enrollmentToVerify));
        testConfiguration.getAttestationMechanismFunction(enrollmentToVerify[testConfiguration.idPropertyName], (getAttestErr, attestationMechanism) => {
          if (getAttestErr) {
            debug(getAttestErr);
          }
          assert.isNull(getAttestErr);
          assert.strictEqual(testConfiguration.enrollmentObject.attestation.type, attestationMechanism.type);
          callbackForItOfGetAttestation();
        });
      });
    });
  });
});

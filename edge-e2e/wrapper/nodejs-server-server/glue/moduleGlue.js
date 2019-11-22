// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
'use strict';
/*jshint esversion: 6 */

var ModuleClient = require('azure-iot-device').ModuleClient;
var Message = require('azure-iot-device').Message;
var debug = require('debug')('azure-iot-e2e:node')
var glueUtils = require('./glueUtils');
var NamedObjectCache = require('./NamedObjectCache');

/**
 * cache of objects.  Used to return object by name to the caller.
 */
var objectCache = new NamedObjectCache();

/**
 * Create an event handler which calls the callback for the second event only.  Used
 * like EventEmitter.Once(), only it returns the second event and then removes itself.
 * This is needed for 'properties.desired' events because the first event comes when
 * registering for the hander, but in many cases, we want the second event which is
 * an actual delta.
 *
 * @param {Object} object     EventEmitter object for the event that we're registering for
 * @param {string} eventName  Name of the event that we're registering for
 * @param {function} cb       Callback to call when the second event is received.
 */
var callbackForSecondEventOnly = function(object, eventName, cb) {
  var alreadyReceivedFirstEvent = false;
  var handler = function(x) {
    if (alreadyReceivedFirstEvent) {
      object.removeListener(eventName, handler);
      cb(x);
    } else {
      alreadyReceivedFirstEvent = true;
    }
  }
  object.on(eventName, handler);
}

/**
 * Helper function which either creates a Twin or returns a Twin for the given connection
 * if it already exists.
 *
 * @param {string} connectionId   Connection to get the twin for
 * @param {function} callback     callback used to return the Twin object
 */
var getModuleOrDeviceTwin = function(connectionId, callback) {
  var client = objectCache.getObject(connectionId);
  // cheat: use internal member.  We should really call getTwin the first time
  // and cache the value in this code rather than relying on internal implementations.
  if (client._twin) {
    callback(null, client._twin);
  } else {
    client.getTwin(callback);
  }
}


/**
 * Connect to the azure IoT Hub as a module
 *
 * transportType String Transport to use
 * connectionString String connection string
 * caCertificate Certificate  (optional)
 * returns connectResponse
 **/
exports.module_Connect = function(transportType,connectionString,caCertificate) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "connectionId" : "connectionId"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Connect the module
 *
 * connectionId String Id for the connection
 * no response value expected for this operation
 **/
exports.module_Connect2 = function(connectionId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Connect to the azure IoT Hub as a module using the environment variables
 *
 * transportType String Transport to use
 * returns connectResponse
 **/
exports.module_ConnectFromEnvironment = function(transportType) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "connectionId" : "connectionId"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Create a module client from a connection string
 *
 * transportType String Transport to use
 * connectionString String connection string
 * caCertificate Certificate  (optional)
 * returns connectResponse
 **/
exports.module_CreateFromConnectionString = function(transportType,connectionString,caCertificate) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "connectionId" : "connectionId"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Create a module client using the EdgeHub environment
 *
 * transportType String Transport to use
 * returns connectResponse
 **/
exports.module_CreateFromEnvironment = function(transportType) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "connectionId" : "connectionId"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Create a module client from X509 credentials
 *
 * transportType String Transport to use
 * x509 Object 
 * returns connectResponse
 **/
exports.module_CreateFromX509 = function(transportType,x509) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "connectionId" : "connectionId"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Disonnect and destroy the module client
 *
 * connectionId String Id for the connection
 * no response value expected for this operation
 **/
exports.module_Destroy = function(connectionId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Disconnect the module
 *
 * connectionId String Id for the connection
 * no response value expected for this operation
 **/
exports.module_Disconnect = function(connectionId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Disonnect the module
 *
 * connectionId String Id for the connection
 * no response value expected for this operation
 **/
exports.module_Disconnect2 = function(connectionId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Enable input messages
 *
 * connectionId String Id for the connection
 * no response value expected for this operation
 **/
exports.module_EnableInputMessages = function(connectionId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Enable methods
 *
 * connectionId String Id for the connection
 * no response value expected for this operation
 **/
exports.module_EnableMethods = function(connectionId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Enable module twins
 *
 * connectionId String Id for the connection
 * no response value expected for this operation
 **/
exports.module_EnableTwin = function(connectionId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * get the current connection status
 *
 * connectionId String Id for the connection
 * returns String
 **/
exports.module_GetConnectionStatus = function(connectionId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get the device twin
 *
 * connectionId String Id for the connection
 * returns Object
 **/
exports.module_GetTwin = function(connectionId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "{}";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * call the given method on the given device
 *
 * connectionId String Id for the connection
 * deviceId String 
 * methodInvokeParameters Object 
 * returns Object
 **/
exports.module_InvokeDeviceMethod = function(connectionId,deviceId,methodInvokeParameters) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "{}";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * call the given method on the given module
 *
 * connectionId String Id for the connection
 * deviceId String 
 * moduleId String 
 * methodInvokeParameters Object 
 * returns Object
 **/
exports.module_InvokeModuleMethod = function(connectionId,deviceId,moduleId,methodInvokeParameters) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "{}";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Updates the device twin
 *
 * connectionId String Id for the connection
 * props Object 
 * no response value expected for this operation
 **/
exports.module_PatchTwin = function(connectionId,props) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Reconnect the module
 *
 * connectionId String Id for the connection
 * forceRenewPassword Boolean True to force SAS renewal (optional)
 * no response value expected for this operation
 **/
exports.module_Reconnect = function(connectionId,forceRenewPassword) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Wait for a method call, verify the request, and return the response.
 * This is a workaround to deal with SDKs that only have method call operations that are sync.  This function responds to the method with the payload of this function, and then returns the method parameters.  Real-world implemenatations would never do this, but this is the only same way to write our test code right now (because the method handlers for C, Java, and probably Python all return the method response instead of supporting an async method call)
 *
 * connectionId String Id for the connection
 * methodName String name of the method to handle
 * requestAndResponse RoundtripMethodCallBody 
 * no response value expected for this operation
 **/
exports.module_RoundtripMethodCall = function(connectionId,methodName,requestAndResponse) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Send an event
 *
 * connectionId String Id for the connection
 * eventBody Object 
 * no response value expected for this operation
 **/
exports.module_SendEvent = function(connectionId,eventBody) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Send an event to a module output
 *
 * connectionId String Id for the connection
 * outputName String 
 * eventBody Object 
 * no response value expected for this operation
 **/
exports.module_SendOutputEvent = function(connectionId,outputName,eventBody) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * wait for the current connection status to change and return the changed status
 *
 * connectionId String Id for the connection
 * returns String
 **/
exports.module_WaitForConnectionStatusChange = function(connectionId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Wait for the next desired property patch
 *
 * connectionId String Id for the connection
 * returns Object
 **/
exports.module_WaitForDesiredPropertiesPatch = function(connectionId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "{}";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Wait for a message on a module input
 *
 * connectionId String Id for the connection
 * inputName String 
 * returns String
 **/
exports.module_WaitForInputMessage = function(connectionId,inputName) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


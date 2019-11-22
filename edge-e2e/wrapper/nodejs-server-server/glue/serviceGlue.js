// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
'use strict';
/*jshint esversion: 6 */

var debug = require('debug')('azure-iot-e2e:node')
var glueUtils = require('./glueUtils');
var NamedObjectCache = require('./NamedObjectCache');
var ServiceClient = require('azure-iothub').Client;

/**
 * cache of objects.  Used to return object by name to the caller.
 */
var objectCache = new NamedObjectCache();


/**
 * Connect to service
 * Connect to the Azure IoTHub service.  More specifically, the SDK saves the connection string that is passed in for future use.
 *
 * connectionString String connection string
 * returns connectResponse
 **/
exports.service_Connect = function(connectionString) {
}


/**
 * Disconnect from the service
 * Disconnects from the Azure IoTHub service.  More specifically, closes all connections and cleans up all resources for the active connection
 *
 * connectionId String Id for the connection
 * no response value expected for this operation
 **/
exports.service_Disconnect = function(connectionId) {
}


/**
 * call the given method on the given device
 *
 * connectionId String Id for the connection
 * deviceId String 
 * methodInvokeParameters Object 
 * returns Object
 **/
exports.service_InvokeDeviceMethod = function(connectionId,deviceId,methodInvokeParameters) {
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
exports.service_InvokeModuleMethod = function(connectionId,deviceId,moduleId,methodInvokeParameters) {
}


/**
 * Send a c2d message
 *
 * connectionId String Id for the connection
 * eventBody Object 
 * no response value expected for this operation
 **/
exports.service_SendC2d = function(connectionId,eventBody) {
}


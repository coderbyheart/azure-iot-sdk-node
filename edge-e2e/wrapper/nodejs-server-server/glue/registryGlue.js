// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
'use strict';
/*jshint esversion: 6 */

var debug = require('debug')('azure-iot-e2e:node')
var glueUtils = require('./glueUtils');
var NamedObjectCache = require('./NamedObjectCache');

var Registry = require('azure-iothub').Registry;


/**
 * cache of objects.  Used to return object by name to the caller.
 */
var objectCache = new NamedObjectCache();

/**
 * Connect to registry
 * Connect to the Azure IoTHub registry.  More specifically, the SDK saves the connection string that is passed in for future use.
 *
 * connectionString String connection string
 * returns connectResponse
 **/
exports.registry_Connect = function(connectionString) {
}


/**
 * Disconnect from the registry
 * Disconnects from the Azure IoTHub registry.  More specifically, closes all connections and cleans up all resources for the active connection
 *
 * connectionId String Id for the connection
 * no response value expected for this operation
 **/
exports.registry_Disconnect = function(connectionId) {
}


/**
 * gets the device twin for the given deviceid
 *
 * connectionId String Id for the connection
 * deviceId String 
 * returns Object
 **/
exports.registry_GetDeviceTwin = function(connectionId,deviceId) {
}


/**
 * gets the module twin for the given deviceid and moduleid
 *
 * connectionId String Id for the connection
 * deviceId String 
 * moduleId String 
 * returns Object
 **/
exports.registry_GetModuleTwin = function(connectionId,deviceId,moduleId) {
}


/**
 * update the device twin for the given deviceId
 *
 * connectionId String Id for the connection
 * deviceId String 
 * props Object 
 * no response value expected for this operation
 **/
exports.registry_PatchDeviceTwin = function(connectionId,deviceId,props) {
}


/**
 * update the module twin for the given deviceId and moduleId
 *
 * connectionId String Id for the connection
 * deviceId String 
 * moduleId String 
 * props Object 
 * no response value expected for this operation
 **/
exports.registry_PatchModuleTwin = function(connectionId,deviceId,moduleId,props) {
}


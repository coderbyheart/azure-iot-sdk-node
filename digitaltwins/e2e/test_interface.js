module.exports = {
  '@id': 'urn:microsoft:azureiot:nodesdk:e2etest:1',
  '@type': 'Interface',
  'displayName': 'Azure IoT Node Client Library End-to-End Tests',
  'contents': [
    {
      '@type': 'Telemetry',
      'name': 'telemetry',
      'schema': 'double'
    },
    {
      '@type': 'Property',
      'name': 'readOnlyProperty',
      'writable': false,
      'schema': 'string'
    },
    {
      '@type': 'Property',
      'name': 'readWriteProperty',
      'writable': true,
      'schema': 'string'
    },
    {
      '@type': 'Command',
      'name': 'syncCommand',
      'commandType': 'synchronous',
      'request': {
        'name': 'requestProperty',
        'schema': 'string'
      },
      'response': {
        'name': 'responseProperty',
        'schema': 'string'
      }
    }
  ],
  '@context': 'http://azureiot.com/v1/contexts/Interface.json'
};

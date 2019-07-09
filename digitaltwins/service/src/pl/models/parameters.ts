/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

import * as msRest from "@azure/ms-rest-js";

export const apiVersion: msRest.OperationQueryParameter = {
  parameterPath: "apiVersion",
  mapper: {
    required: true,
    serializedName: "api-version",
    defaultValue: '2019-07-01-preview',
    type: {
      name: "String"
    }
  }
};
export const commandName: msRest.OperationURLParameter = {
  parameterPath: "commandName",
  mapper: {
    required: true,
    serializedName: "commandName",
    type: {
      name: "String"
    }
  }
};
export const connectTimeoutInSeconds: msRest.OperationQueryParameter = {
  parameterPath: [
    "options",
    "connectTimeoutInSeconds"
  ],
  mapper: {
    serializedName: "connectTimeoutInSeconds",
    type: {
      name: "Number"
    }
  }
};
export const deviceId: msRest.OperationURLParameter = {
  parameterPath: "deviceId",
  mapper: {
    required: true,
    serializedName: "deviceId",
    type: {
      name: "String"
    }
  }
};
export const digitalTwinId: msRest.OperationURLParameter = {
  parameterPath: "digitalTwinId",
  mapper: {
    required: true,
    serializedName: "digitalTwinId",
    type: {
      name: "String"
    }
  }
};
export const expand: msRest.OperationQueryParameter = {
  parameterPath: [
    "options",
    "expand"
  ],
  mapper: {
    serializedName: "expand",
    type: {
      name: "Boolean"
    }
  }
};
export const id: msRest.OperationURLParameter = {
  parameterPath: "id",
  mapper: {
    required: true,
    serializedName: "id",
    type: {
      name: "String"
    }
  }
};
export const ifMatch: msRest.OperationParameter = {
  parameterPath: [
    "options",
    "ifMatch"
  ],
  mapper: {
    serializedName: "If-Match",
    type: {
      name: "String"
    }
  }
};
export const interfaceName: msRest.OperationURLParameter = {
  parameterPath: "interfaceName",
  mapper: {
    required: true,
    serializedName: "interfaceName",
    type: {
      name: "String"
    }
  }
};
export const jobStatus: msRest.OperationQueryParameter = {
  parameterPath: [
    "options",
    "jobStatus"
  ],
  mapper: {
    serializedName: "jobStatus",
    type: {
      name: "String"
    }
  }
};
export const jobType: msRest.OperationQueryParameter = {
  parameterPath: [
    "options",
    "jobType"
  ],
  mapper: {
    serializedName: "jobType",
    type: {
      name: "String"
    }
  }
};
export const mid: msRest.OperationURLParameter = {
  parameterPath: "mid",
  mapper: {
    required: true,
    serializedName: "mid",
    type: {
      name: "String"
    }
  }
};
export const modelId: msRest.OperationURLParameter = {
  parameterPath: "modelId",
  mapper: {
    required: true,
    serializedName: "modelId",
    type: {
      name: "String"
    }
  }
};
export const moduleId: msRest.OperationURLParameter = {
  parameterPath: "moduleId",
  mapper: {
    required: true,
    serializedName: "moduleId",
    type: {
      name: "String"
    }
  }
};
export const responseTimeoutInSeconds: msRest.OperationQueryParameter = {
  parameterPath: [
    "options",
    "responseTimeoutInSeconds"
  ],
  mapper: {
    serializedName: "responseTimeoutInSeconds",
    type: {
      name: "Number"
    }
  }
};
export const top: msRest.OperationQueryParameter = {
  parameterPath: [
    "options",
    "top"
  ],
  mapper: {
    serializedName: "top",
    type: {
      name: "Number"
    }
  }
};

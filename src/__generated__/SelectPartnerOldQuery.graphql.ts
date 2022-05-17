/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type SelectPartnerOldQueryVariables = {};
export type SelectPartnerOldQueryResponse = {
    readonly me: {
        readonly partners: ReadonlyArray<{
            readonly name: string | null;
            readonly internalID: string;
        } | null> | null;
    } | null;
};
export type SelectPartnerOldQuery = {
    readonly response: SelectPartnerOldQueryResponse;
    readonly variables: SelectPartnerOldQueryVariables;
};



/*
query SelectPartnerOldQuery {
  me {
    partners {
      name
      internalID
      id
    }
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "SelectPartnerOldQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Partner",
            "kind": "LinkedField",
            "name": "partners",
            "plural": true,
            "selections": [
              (v0/*: any*/),
              (v1/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SelectPartnerOldQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Partner",
            "kind": "LinkedField",
            "name": "partners",
            "plural": true,
            "selections": [
              (v0/*: any*/),
              (v1/*: any*/),
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "dc669b324eda5ec081fb7f5be760517a",
    "id": null,
    "metadata": {},
    "name": "SelectPartnerOldQuery",
    "operationKind": "query",
    "text": "query SelectPartnerOldQuery {\n  me {\n    partners {\n      name\n      internalID\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = '7dfc11253bd8d4fa7bad361fa80fc850';
export default node;

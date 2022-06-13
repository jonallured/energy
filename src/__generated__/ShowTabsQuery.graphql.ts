/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type ShowTabsQueryVariables = {
    slug: string;
};
export type ShowTabsQueryResponse = {
    readonly show: {
        readonly name: string | null;
    } | null;
};
export type ShowTabsQuery = {
    readonly response: ShowTabsQueryResponse;
    readonly variables: ShowTabsQueryVariables;
};



/*
query ShowTabsQuery(
  $slug: String!
) {
  show(id: $slug) {
    name
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "slug"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "slug"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ShowTabsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Show",
        "kind": "LinkedField",
        "name": "show",
        "plural": false,
        "selections": [
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ShowTabsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Show",
        "kind": "LinkedField",
        "name": "show",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "3b88bb803f71368a322e1e2179b18401",
    "id": null,
    "metadata": {},
    "name": "ShowTabsQuery",
    "operationKind": "query",
    "text": "query ShowTabsQuery(\n  $slug: String!\n) {\n  show(id: $slug) {\n    name\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = '8c52620896b8dcb2f485a4d0a7fad526';
export default node;

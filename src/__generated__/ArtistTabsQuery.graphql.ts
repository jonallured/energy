/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type ArtistTabsQueryVariables = {
    slug: string;
};
export type ArtistTabsQueryResponse = {
    readonly artist: {
        readonly name: string | null;
    } | null;
};
export type ArtistTabsQuery = {
    readonly response: ArtistTabsQueryResponse;
    readonly variables: ArtistTabsQueryVariables;
};



/*
query ArtistTabsQuery(
  $slug: String!
) {
  artist(id: $slug) {
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
    "name": "ArtistTabsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
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
    "name": "ArtistTabsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
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
    "cacheID": "f5565ade92c49e1f82ee5ac2ce3872b5",
    "id": null,
    "metadata": {},
    "name": "ArtistTabsQuery",
    "operationKind": "query",
    "text": "query ArtistTabsQuery(\n  $slug: String!\n) {\n  artist(id: $slug) {\n    name\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = 'd614509d640ed9d05f325471ea6c2e2a';
export default node;

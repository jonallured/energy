/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ShowsTabQueryVariables = {
    partnerID: string;
};
export type ShowsTabQueryResponse = {
    readonly partner: {
        readonly showsConnection: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly internalID: string;
                    readonly slug: string;
                    readonly artworksCount: number | null;
                    readonly " $fragmentRefs": FragmentRefs<"ShowListItem_show">;
                } | null;
            } | null> | null;
        } | null;
    } | null;
};
export type ShowsTabQuery = {
    readonly response: ShowsTabQueryResponse;
    readonly variables: ShowsTabQueryVariables;
};



/*
query ShowsTabQuery(
  $partnerID: String!
) {
  partner(id: $partnerID) {
    showsConnection(first: 100, status: ALL) {
      edges {
        node {
          internalID
          slug
          artworksCount
          ...ShowListItem_show
          id
        }
      }
    }
    id
  }
}

fragment ShowListItem_show on Show {
  name
  formattedStartAt: startAt(format: "MMMM D")
  formattedEndAt: endAt(format: "MMMM D, YYYY")
  coverImage {
    url
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "partnerID"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "partnerID"
  }
],
v2 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  },
  {
    "kind": "Literal",
    "name": "status",
    "value": "ALL"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artworksCount",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ShowsTabQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Partner",
        "kind": "LinkedField",
        "name": "partner",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v2/*: any*/),
            "concreteType": "ShowConnection",
            "kind": "LinkedField",
            "name": "showsConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ShowEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Show",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
                      (v4/*: any*/),
                      (v5/*: any*/),
                      {
                        "args": null,
                        "kind": "FragmentSpread",
                        "name": "ShowListItem_show"
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "showsConnection(first:100,status:\"ALL\")"
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ShowsTabQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Partner",
        "kind": "LinkedField",
        "name": "partner",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v2/*: any*/),
            "concreteType": "ShowConnection",
            "kind": "LinkedField",
            "name": "showsConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ShowEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Show",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
                      (v4/*: any*/),
                      (v5/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "name",
                        "storageKey": null
                      },
                      {
                        "alias": "formattedStartAt",
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "format",
                            "value": "MMMM D"
                          }
                        ],
                        "kind": "ScalarField",
                        "name": "startAt",
                        "storageKey": "startAt(format:\"MMMM D\")"
                      },
                      {
                        "alias": "formattedEndAt",
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "format",
                            "value": "MMMM D, YYYY"
                          }
                        ],
                        "kind": "ScalarField",
                        "name": "endAt",
                        "storageKey": "endAt(format:\"MMMM D, YYYY\")"
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Image",
                        "kind": "LinkedField",
                        "name": "coverImage",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "url",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v6/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "showsConnection(first:100,status:\"ALL\")"
          },
          (v6/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "7d27c8c0a0717971f3f07cca73db42d7",
    "id": null,
    "metadata": {},
    "name": "ShowsTabQuery",
    "operationKind": "query",
    "text": "query ShowsTabQuery(\n  $partnerID: String!\n) {\n  partner(id: $partnerID) {\n    showsConnection(first: 100, status: ALL) {\n      edges {\n        node {\n          internalID\n          slug\n          artworksCount\n          ...ShowListItem_show\n          id\n        }\n      }\n    }\n    id\n  }\n}\n\nfragment ShowListItem_show on Show {\n  name\n  formattedStartAt: startAt(format: \"MMMM D\")\n  formattedEndAt: endAt(format: \"MMMM D, YYYY\")\n  coverImage {\n    url\n  }\n}\n"
  }
};
})();
(node as any).hash = '9a4a3b5cdf44d1e60bcbf460d5d1a3c5';
export default node;

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkGridItem_artwork = {
    readonly internalID: string;
    readonly title: string | null;
    readonly date: string | null;
    readonly image: {
        readonly url: string | null;
        readonly aspectRatio: number;
    } | null;
    readonly availability: string | null;
    readonly " $refType": "ArtworkGridItem_artwork";
};
export type ArtworkGridItem_artwork$data = ArtworkGridItem_artwork;
export type ArtworkGridItem_artwork$key = {
    readonly " $data"?: ArtworkGridItem_artwork$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkGridItem_artwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtworkGridItem_artwork",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "internalID",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "date",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "image",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "url",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "aspectRatio",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "availability",
      "storageKey": null
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = '0d6e2609ee69e1bd161cbc0ea9898461';
export default node;

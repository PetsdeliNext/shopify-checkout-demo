export interface GraphQLResponse {
  extensions: {
    cost: {
      requestedQueryCost: number;
      actualQueryCost: number;
      throttleStatus: {
        maximumAvailable: number;
        currentlyAvailable: number;
        restoreRate: number;
      };
    };
  };
}

export interface GraphQLFulfilled<T> extends GraphQLResponse {
  data: T;
}

export interface GraphQLReject extends GraphQLResponse {
  errors: {
    message: string;
    locations: unknown[];
    path: unknown[];
    extensions: unknown;
  }[];
}
export interface ListData<T> {
  edges: {
    cursor: string;
    node: T;
  }[];
  pageInfo: {
    hasNextPage?: true;
    endCursor?: string;
  };
}

export interface FragmentMetafield {
  node: Omit<Metafield, 'id'> & { id: string };
}
export type EventMetafield = Metafield;

export interface Metafield {
  id: number;
  namespace: string;
  key: string;
  value: string | number | boolean;
  type: string;
}

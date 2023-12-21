import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

import { Cluster } from '@/components/ClusterSwitcher';

type PermalinkedQuery = Readonly<{
    cluster: Cluster;
    query: string;
    variables?: string;
}>;

const QUERY_OPERATION_HEADER = 'q';
const VERSION_HEADER = '0';

function encodeCluster(cluster: Cluster) {
    // TODO: When custom URLs are supported encode/decode them with a prefix.
    return `${cluster}`;
}

function decodeCluster(untrustedEncodedClusterString: string): Cluster {
    if (!/^\d$/.test(untrustedEncodedClusterString)) {
        throw new Error('Cluster malformed in permalink');
    }
    const clusterValue = parseInt(untrustedEncodedClusterString, 10);
    if (!(clusterValue in Cluster)) {
        throw new Error('Invalid cluster in permalink');
    }
    return clusterValue;
}

function createPermalinkSlug({ cluster, query, variables }: PermalinkedQuery): string {
    return [
        QUERY_OPERATION_HEADER,
        VERSION_HEADER,
        encodeCluster(cluster),
        compressToEncodedURIComponent(query),
        variables ? compressToEncodedURIComponent(variables) : null,
    ]
        .filter(Boolean)
        .join(':');
}

export function createPermalink(permalinkedQuery: PermalinkedQuery) {
    const url = new URL(process.env.VERCEL_URL || window.location.href);
    url.pathname = '';
    url.hash = createPermalinkSlug(permalinkedQuery);
    return url;
}

export function parsePermlinkSlug(untrustedPermalinkString: string): PermalinkedQuery {
    const parts = untrustedPermalinkString.split(':');
    const [queryOperationHeader, version, encodedCluster, encodedQuery, encodedVariables] = parts;
    if (queryOperationHeader !== QUERY_OPERATION_HEADER) {
        throw new Error('Permalink malformed');
    }
    if (version !== VERSION_HEADER) {
        throw new Error('Permalink version not recognized');
    }
    if (parts.length < 4 || parts.length > 5) {
        throw new Error('Permalink malformed');
    }
    return {
        cluster: decodeCluster(encodedCluster),
        query: decompressFromEncodedURIComponent(encodedQuery),
        variables: decompressFromEncodedURIComponent(encodedVariables) ?? undefined,
    };
}

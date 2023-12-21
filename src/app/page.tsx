'use client';

import 'graphiql/graphiql.css';

import { Storage, StorageAPI } from '@graphiql/toolkit';
import { createRpcGraphQL } from '@solana/rpc-graphql';
import { createDefaultRpcTransport, createSolanaRpc } from '@solana/web3.js';
import { GraphiQL } from 'graphiql';
import React, { useMemo, useRef } from 'react';

import { Cluster, ClusterSwitcher } from '@/components/ClusterSwitcher';
import { createPermalink, parsePermlinkSlug } from '@/utils/permalink';
import { useHash } from '@/utils/url-hash';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};

function createQueryResolver(cluster: Cluster) {
    const url = `https://api.${cluster}.solana.com`;
    const transport = createDefaultRpcTransport({ url });
    const rpc = createSolanaRpc({ transport });
    const rpcGraphQL = createRpcGraphQL(rpc);
    return rpcGraphQL.query.bind(rpcGraphQL);
}

export default function Home() {
    const [hash, setHash] = useHash();
    const permalinkedQuery = useMemo(() => {
        if (hash) {
            return parsePermlinkSlug(decodeURIComponent(hash));
        }
    }, [hash]);
    const proxyStorage = useMemo<Storage | undefined>(() => {
        const { storage } = new StorageAPI();
        function runUnlessKeyOnBlocklist<TFn extends (...args: never[]) => ReturnType<TFn>>(
            args: Parameters<TFn>,
            onBlocked: TFn,
            onAllowed: TFn,
        ) {
            if (!permalinkedQuery) {
                return onAllowed(...args);
            }
            const [key] = args;
            switch (key) {
                case 'graphiql:headers':
                case 'graphiql:query':
                case 'graphiql:queries':
                case 'graphiql:tabState':
                case 'graphiql:variables':
                    return onBlocked(...args);
                default:
                    return onAllowed(...args);
            }
        }
        return {
            clear() {
                return storage?.clear();
            },
            getItem(...args) {
                return runUnlessKeyOnBlocklist<Storage['getItem']>(
                    args,
                    () => null,
                    key => storage?.getItem(key) ?? null,
                );
            },
            get length() {
                return storage?.length ?? 0;
            },
            removeItem(...args) {
                return runUnlessKeyOnBlocklist<Storage['removeItem']>(
                    args,
                    () => {},
                    key => {
                        storage?.removeItem(key);
                    },
                );
            },
            setItem(...args) {
                return runUnlessKeyOnBlocklist<Storage['setItem']>(
                    args,
                    () => {},
                    (...args) => {
                        storage?.setItem(...args);
                    },
                );
            },
        };
    }, [permalinkedQuery]);
    const [cluster, setCluster] = React.useState<Cluster>(() => permalinkedQuery?.cluster ?? Cluster.DEVNET);
    const variablesRef = useRef<string | undefined>();
    const graphQLFetcher = useMemo(() => {
        const resolveQuery = createQueryResolver(cluster);
        return async (...args: Parameters<React.ComponentProps<typeof GraphiQL>['fetcher']>) => {
            const [{ query, variables }] = args;
            return await resolveQuery(query, variables);
        };
    }, [cluster]);
    return (
        <GraphiQL
            fetcher={graphQLFetcher}
            isHeadersEditorEnabled={false}
            query={permalinkedQuery?.query}
            onCopyQuery={query => {
                const permalink = createPermalink({
                    cluster,
                    query,
                    variables: variablesRef.current,
                });
                navigator.clipboard.writeText(permalink.toString());
                setHash(permalink.hash);
            }}
            onEditVariables={variables => {
                variablesRef.current = variables;
            }}
            showPersistHeadersSettings={false}
            storage={proxyStorage}
            variables={permalinkedQuery?.variables}
        >
            <GraphiQL.Logo>
                <ClusterSwitcher currentCluster={cluster} onClusterChange={setCluster} />
            </GraphiQL.Logo>
        </GraphiQL>
    );
}

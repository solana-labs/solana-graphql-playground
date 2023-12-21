'use client';

import 'graphiql/graphiql.css';

import { createRpcGraphQL } from '@solana/rpc-graphql';
import { createDefaultRpcTransport, createSolanaRpc } from '@solana/web3.js';
import { GraphiQL } from 'graphiql';
import React, { useMemo } from 'react';

import { ClusterSwitcher, TargetCluster } from './cluster-switcher';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};

function createQueryResolver(cluster: TargetCluster = 'devnet') {
    const url = `https://api.${cluster}.solana.com`;
    const transport = createDefaultRpcTransport({ url });
    const rpc = createSolanaRpc({ transport });
    const rpcGraphQL = createRpcGraphQL(rpc);
    return rpcGraphQL.query.bind(rpcGraphQL);
}

export default function Home() {
    const [cluster, setCluster] = React.useState<TargetCluster>('devnet');
    const graphQLFetcher = useMemo(() => {
        const resolveQuery = createQueryResolver(cluster);
        return async (...args: Parameters<React.ComponentProps<typeof GraphiQL>['fetcher']>) => {
            const [{ query, variables }] = args;
            return await resolveQuery(query, variables);
        };
    }, [cluster]);
    return (
        <main className="flex flex-col w-full h-screen divide-y divide-slate-300">
            {/* Header section */}
            <h1 className="px-5 py-4 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500">
                Solana GraphQL Playground
            </h1>

            {/* IDE */}
            <div className="grow">
                {typeof window !== 'undefined' && (
                    <GraphiQL
                        fetcher={graphQLFetcher}
                        isHeadersEditorEnabled={false}
                        showPersistHeadersSettings={false}
                    >
                        <GraphiQL.Logo>
                            <ClusterSwitcher currentCluster={cluster} onClusterChange={setCluster} />
                        </GraphiQL.Logo>
                    </GraphiQL>
                )}
            </div>
        </main>
    );
}

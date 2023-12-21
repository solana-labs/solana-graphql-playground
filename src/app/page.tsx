'use client';

import 'graphiql/graphiql.css';

import { createRpcGraphQL } from '@solana/rpc-graphql';
import { createDefaultRpcTransport, createSolanaRpc } from '@solana/web3.js';
import { GraphiQL } from 'graphiql';
import React, { useCallback, useEffect } from 'react';

import { ClusterSwitcher, TargetCluster } from './cluster-switcher';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};

function setupRpcGraphQL(cluster: TargetCluster = 'devnet') {
    const url = `https://api.${cluster}.solana.com`;
    const transport = createDefaultRpcTransport({ url });
    const rpc = createSolanaRpc({ transport });
    return createRpcGraphQL(rpc);
}

export default function Home() {
    const [cluster, setCluster] = React.useState<TargetCluster>('devnet');
    const [rpcGraphQL, setRpcGraphQL] = React.useState(setupRpcGraphQL(cluster));

    useEffect(() => {
        setRpcGraphQL(setupRpcGraphQL(cluster));
    }, [cluster]);

    const graphQLFetcher = useCallback(
        async (...args: Parameters<React.ComponentProps<typeof GraphiQL>['fetcher']>) => {
            const [{ query, variables }] = args;
            return await rpcGraphQL.query(query, variables);
        },
        [rpcGraphQL],
    );

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

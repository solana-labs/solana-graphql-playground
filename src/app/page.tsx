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
        <main className="flex flex-col items-center justify-center justify-between p-12 w-full h-screen">
            {/* Header section */}
            <div className="flex flex-row w-full justify-between my-auto ml-0">
                {/* Left side title */}
                <h1 className="text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">
                    Solana GraphQL Playground
                </h1>
            </div>

            {/* IDE */}
            <div className="h-screen border-2 border-gray-500 rounded w-full">
                {typeof window !== 'undefined' && (
                    <GraphiQL fetcher={graphQLFetcher} isHeadersEditorEnabled={false}>
                        <GraphiQL.Logo>
                            <ClusterSwitcher currentCluster={cluster} onClusterChange={setCluster} />
                        </GraphiQL.Logo>
                    </GraphiQL>
                )}
            </div>
        </main>
    );
}

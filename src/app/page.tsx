'use client';

import 'graphiql/graphiql.css';

import { createRpcGraphQL } from '@solana/rpc-graphql'
import { createDefaultRpcTransport, createSolanaRpc } from '@solana/web3.js'
import { GraphiQL } from 'graphiql';
import React, { useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

type Cluster = 'devnet' | 'testnet' | 'mainnet-beta';

function setupRpcGraphQL(cluster: Cluster = 'devnet') {
  const url = `https://api.${cluster}.solana.com`;
  const transport = createDefaultRpcTransport({ url });
  const rpc = createSolanaRpc({ transport });
  return createRpcGraphQL(rpc);
}

export default function Home() {
  const [cluster, setCluster] = React.useState<Cluster>('devnet');
  const [rpcGraphQL, setRpcGraphQL] = React.useState(setupRpcGraphQL(cluster));

  useEffect(() => {
    setRpcGraphQL(setupRpcGraphQL(cluster));
  }, [cluster])

  return (
    <main className="flex flex-col items-center justify-center justify-between p-12 w-full h-screen">
      
      {/* Header section */}
      <div className="flex flex-row w-full justify-between my-auto ml-0">
        {/* Left side title */}
        <h1 className="text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">
          Solana GraphQL Playground
        </h1>
        {/* Right side cluster select */}
        <div className='flex flex-row justify-between text-l p-4 pb-0 w-1/2 my-auto mr-0'>
          <button
            className={`border-2 border-${cluster === 'devnet' ? 'green-400' : 'gray-500'} rounded-md p-2`}
            onClick={() => setCluster('devnet')}
          >
            <p>Devnet</p>
          </button>
          <button
            className={`border-2 border-${cluster === 'testnet' ? 'green-400' : 'gray-500'} rounded-md p-2`}
            onClick={() => setCluster('testnet')}
          >
            <p>Testnet</p>
          </button>
          <button
            className={`border-2 border-${cluster === 'mainnet-beta' ? 'green-400' : 'gray-500'} rounded-md p-2`}
            onClick={() => setCluster('mainnet-beta')}
          >
            <p>Mainnet-Beta</p>
          </button>
        </div>
      </div>

      {/* IDE */}
      <div className='h-screen border-2 border-gray-500 rounded w-full'>
        {(typeof window !== 'undefined') &&
          <GraphiQL
            fetcher={
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (params: any) => rpcGraphQL.query(params.query)
            }
          />
        }
      </div>
    </main>
  )
}

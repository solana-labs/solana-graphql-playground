'use client';

import 'graphiql/graphiql.css';

import { createRpcGraphQL } from '@solana/rpc-graphql'
import { createDefaultRpcTransport, createSolanaRpc } from '@solana/web3.js'
import { GraphiQL } from 'graphiql';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

const transport = createDefaultRpcTransport({ url: 'https://api.devnet.solana.com' });
const rpc = createSolanaRpc({ transport });
const rpcGraphQL = createRpcGraphQL(rpc);

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center justify-between p-24 w-full">
      <div className="z-10 w-full h-screen items-center justify-between font-mono text-sm lg:flex">
        <div>
            <h1 className="text-4xl font-bold leading-none">
                <span className="text-green-400">Solana</span>
                <span className="text-pink-500"> GraphQL</span>
                <span className="text-blue-300"> Playground</span>
            </h1>
        </div>
        {(typeof window !== 'undefined') &&
            <div className='h-full'>
              <GraphiQL fetcher={
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (params: any) => rpcGraphQL.query(params.query)
              } />
            </div>
        }
      </div>
    </main>
  )
}

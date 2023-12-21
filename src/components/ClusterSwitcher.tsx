import { StarIcon, ToolbarButton, ToolbarMenu } from '@graphiql/react';
import Image from 'next/image';

export enum Cluster {
    DEVNET = 0,
    TESTNET = 1,
}

type Props = Readonly<{
    currentCluster: Cluster;
    onClusterChange: (nextCluster: Cluster) => void;
}>;

const CLUSTER_LABEL = {
    [Cluster.DEVNET]: 'Devnet',
    [Cluster.TESTNET]: 'Testnet',
} as const;

export function ClusterSwitcher({ currentCluster, onClusterChange }: Props) {
    return (
        <ToolbarMenu
            button={
                <ToolbarButton className="!relative" label="Select cluster">
                    <Image
                        alt="Selected cluster icon"
                        aria-hidden={true}
                        src="/solanaLogoMark.svg"
                        width={24}
                        height={24}
                        className="graphiql-toolbar-icon"
                    />
                    <span className="absolute bottom-0 right-0 size-3 text-xs text-center font-bold bg-white block leading-none">
                        {CLUSTER_LABEL[currentCluster].slice(0, 1)}
                    </span>
                </ToolbarButton>
            }
            label="Select cluster"
        >
            {[Cluster.DEVNET, Cluster.TESTNET].map(Cluster => (
                <ToolbarMenu.Item onSelect={onClusterChange.bind(null, Cluster)}>
                    <StarIcon
                        className={`inline pe-1 align-text-top ${Cluster === currentCluster ? '' : 'invisible'}`}
                    />{' '}
                    {CLUSTER_LABEL[Cluster]}
                </ToolbarMenu.Item>
            ))}
        </ToolbarMenu>
    );
}

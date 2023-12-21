import { StarIcon, ToolbarButton, ToolbarMenu } from '@graphiql/react';
import Image from 'next/image';

export type TargetCluster = 'devnet' | 'testnet';

type Props = Readonly<{
    currentCluster: TargetCluster;
    onClusterChange: (nextCluster: TargetCluster) => void;
}>;

const CLUSTER_LABEL = {
    devnet: 'Devnet',
    testnet: 'Testnet',
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
            {(['devnet', 'testnet'] as TargetCluster[]).map(targetCluster => (
                <ToolbarMenu.Item onSelect={onClusterChange.bind(null, targetCluster)}>
                    <StarIcon
                        className={`inline pe-1 align-text-top ${targetCluster === currentCluster ? '' : 'invisible'}`}
                    />{' '}
                    {CLUSTER_LABEL[targetCluster]}
                </ToolbarMenu.Item>
            ))}
        </ToolbarMenu>
    );
}

import GraphiQL from 'graphiql';

import { ClusterSwitcher } from '@/components/ClusterSwitcher';

type Props = React.ComponentProps<typeof GraphiQL> & React.ComponentProps<typeof ClusterSwitcher>;

export default function Ide({ currentCluster, onClusterChange: handleClusterChange, ...props }: Props) {
    return (
        <GraphiQL {...props}>
            <GraphiQL.Logo>
                <ClusterSwitcher currentCluster={currentCluster} onClusterChange={handleClusterChange} />
            </GraphiQL.Logo>
        </GraphiQL>
    );
}

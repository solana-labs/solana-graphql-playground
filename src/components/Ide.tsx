import GraphiQL from 'graphiql';

import { ClusterSwitcher } from '@/components/ClusterSwitcher';

import CopiedPopUp from './CopiedPopUp';

type Props = React.ComponentProps<typeof GraphiQL>
    & React.ComponentProps<typeof ClusterSwitcher>
    & React.ComponentProps<typeof CopiedPopUp>;

export default function Ide({ currentCluster, onClusterChange: handleClusterChange, showCopiedPopup, ...props }: Props) {
    return (<>
        <CopiedPopUp showCopiedPopup={showCopiedPopup} />
        <GraphiQL {...props}>
            <GraphiQL.Logo>
                <ClusterSwitcher currentCluster={currentCluster} onClusterChange={handleClusterChange} />
            </GraphiQL.Logo>
        </GraphiQL>
        </>
    );
}

import { useEffect, useMemo, useState } from 'react';

function normalizeHash(rawHash: string) {
    return rawHash.replace(/^#/, '');
}

export function useHash() {
    const [hash, setHash] = useState(() => (typeof window !== 'undefined' ? normalizeHash(window.location.hash) : ''));

    useEffect(() => {
        function handleHashChange(e: HashChangeEvent) {
            setHash(normalizeHash(new URL(e.newURL).hash));
        }
        window.addEventListener('hashchange', handleHashChange);
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    return useMemo(
        () =>
            [
                hash,
                function setHash(rawHash: string) {
                    const nextHash = normalizeHash(rawHash);
                    if (nextHash !== hash) {
                        window.location.hash = nextHash;
                    }
                },
            ] as const,
        [hash],
    );
}

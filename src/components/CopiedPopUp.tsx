import classNames from 'classnames';

type Props = Readonly<{
    showCopiedPopup: boolean;
}>;

export default function CopiedPopUp({ showCopiedPopup }: Props) {
    return (
        <div
            className={classNames(
                'absolute bottom-0 right-0 mr-4 mb-4 py-2 px-4 rounded-md text-white text-sm font-medium bg-gray-900',
                {
                    'opacity-0': !showCopiedPopup,
                    'opacity-100': showCopiedPopup,
                },
            )}
        >
            Copied!
        </div>
    );
}
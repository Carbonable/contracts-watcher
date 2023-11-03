import LabelComponent from "./LabelComponent"

export default function LoadingAndError({ isLoading, isError, error, title } : { isLoading?: boolean, isError?: boolean, error?: Error|null, title: string }) {
    if (isLoading) {
        return (
            <LabelComponent
                title={title}
                loading={true}
            />
        )
    }

    if (isError) {
        console.error(error);

        return (
            <LabelComponent
                title={title}
                error={true}
            />
        )
    }

    return null;
}
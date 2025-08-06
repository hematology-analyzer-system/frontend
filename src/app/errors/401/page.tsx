import ErrorLayout from "@/components/Layout/ErrorLayout";

export default function Error401() {
    return (
        <ErrorLayout
            title="401 - Unauthorized Access"
            subTitle="Access denied. You are not authorized to view this page."
            content="You may need to log in or have the correct permissions to access this resource."
            inputArray={['4', 'image', '1']}
            backgroundText1="Unauthorized"
            backgroundText2="access"
        >
            <></>
        </ErrorLayout>
    )
}
import ErrorLayout from "@/components/Layout/ErrorLayout";

export default function Error400() {
    return (
        <ErrorLayout
            title="400 - Bad Request"
            subTitle="Oops! Your request was invalid"
            content="It seems the server couldn't understand your request. This might be due to a malformed request or invalid data."
            inputArray={['4', 'image', 'image']}
            backgroundText1="Bad"
            backgroundText2="request"
        >
            <></>
        </ErrorLayout>
    )
}
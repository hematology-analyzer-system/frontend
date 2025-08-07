// Catch 500 internal server error

"use client";

import ErrorLayout from "@/components/Layout/ErrorLayout";


export default function Error() {
    return (
        <ErrorLayout
            title="500 - Internal Server Error"
            subTitle="Sorry! Something went wrong on our side."
            content="Our server encountered an error while processing your request. We are working on fixing it."
            inputArray={['5', 'image', 'image']}
            backgroundText1="Server"
            backgroundText2="error"
        >
            <></>
        </ErrorLayout>
    )
}
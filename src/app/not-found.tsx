import ErrorLayout from "@/components/Layout/ErrorLayout";


function NotFound() {
    return (
        <ErrorLayout
            title="404 - Page not found"
            subTitle="Oops! We can't seem to find the page you're looking for."
            content="It looks like the page you're trying to reach either doesn't exist, was moved, or the link is broken. 
                    Let's help you get back on track"
            inputArray={['4', 'image', '4']}
            backgroundText1="Server"
            backgroundText2="error"
        >
            <></>
        </ErrorLayout>
    );
}

export default NotFound;
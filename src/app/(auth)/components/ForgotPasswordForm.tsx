function ForgotPasswordForm() {
    return (
        <form className="w-full max-w-[800px] flex flex-col gap-5 p-10 lg:p-0">
            <h1 className="text-2xl md:text-4xl font-bold text-primary dark:text-primary-dark text-center">Forgot your password?</h1>

            <h3 className="text-md text-text-secondary dark:text-text-secondary-dark text-center">Give us your registered email address for verification</h3>

            <label className="w-full lg:w-3/4 mx-auto mt-5 transition-all">
                <input className="input" type="text" placeholder="Enter your email" required/>
            </label>

            <button className="button w-full lg:w-3/4 mx-auto mb-5 select-none" type="submit">Reset password</button>
        </form>
    );
}

export default ForgotPasswordForm;
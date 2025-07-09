"use client";

import AuthForm from "../../components/AuthForm";

function AdminAuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark transition-colors p-5 lg:p-0">
      <div
        className={`relative flex justify-items-center h-auto min-h-[400px] bg-surface dark:bg-surface-dark rounded-2xl shadow-xl w-full max-w-[400px] overflow-hidden p-10`}
      >
        <AuthForm formName="Sign In" isAdmin={false} />
      </div>
    </div>
  );
}

export default AdminAuthPage;

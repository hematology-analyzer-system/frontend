import Link from "next/link";

export const SidebarLink = ({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) => {
  return (
    <Link href={href}>
      <div className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer">
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  );
};

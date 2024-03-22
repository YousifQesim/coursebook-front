"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ item }) => {
  const pathName = usePathname();

  return (
    <Link
      href={item.path}
      className={`p-2 rounded-lg font-500 text-sm text-center min-w-24 ${
        pathName === item.path && "bg-bg text-white" 
      }`}
    >
      {item.title}
    </Link>
  );
};

export default NavLink;

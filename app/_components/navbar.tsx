"use client";

import { UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { href: "/", name: "Dashboard" },
    { href: "/transactions", name: "Transações" },
    { href: "/subscription", name: "Assinatura" },
  ];

  return (
    <>
      <nav className="border-b border-solid px-4 py-4 sm:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/logo.svg"
              width={120}
              height={27}
              alt="Finance AI"
              className="mr-4"
            />
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none sm:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
          <div className="hidden sm:flex sm:items-center sm:gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? "font-bold text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <button className="flex items-center text-sm text-muted-foreground hover:text-primary">
            <UserButton showName />
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-black shadow-lg ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out sm:hidden`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <Image src="/logo.svg" width={100} height={22} alt="Finance AI" />
          <button
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block py-2 ${
                pathname === item.href
                  ? "font-bold text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;

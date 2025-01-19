"use client";

import { CldImage } from "next-cloudinary";
import Link from "next/link";
import * as lucideReact from 'lucide-react';
import { cn } from "~/lib/utils"

type FooterProps = React.HTMLAttributes<HTMLElement>

export const Footer = ({ className, ...props }: FooterProps) => {
  return (
    <footer className={cn("w-full bg-gradient-to-r from-yellow-100 via-pink-100 to-purple-100 shadow-inner", className)} {...props}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <CldImage
              src="Official_LOGO_grn_ic9ldd"
              alt="Company Logo"
              width={100}
              height={100}
              className="mb-4"
            />
            <p className="mt-4 text-green-800 font-serif font-medium">
              Transforming ideas into digital solutions with innovative
              technologies and creative strategies.
            </p>
            <div className="mt-6 flex space-x-4">
              <Link href="#" className="text-green-600 hover:text-pink-600 transition-colors duration-300">
                <lucideReact.Facebook size={24} />
              </Link>
              <Link href="#" className="text-green-600 hover:text-pink-600 transition-colors duration-300">
                <lucideReact.Twitter size={24} />
              </Link>
              <Link href="#" className="text-green-600 hover:text-pink-600 transition-colors duration-300">
                <lucideReact.Instagram size={24} />
              </Link>
              <Link href="#" className="text-green-600 hover:text-pink-600 transition-colors duration-300">
                <lucideReact.Linkedin size={24} />
              </Link>
            </div>
          </div>
          <div>
            <h5 className="text-green-800 font-bold mb-3 text-lg">Quick Links</h5>
            <ul className="space-y-2">
              {["Home", "About Us", "Services", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-green-600 hover:text-pink-600 transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-green-800 font-bold mb-3 text-lg">Services</h5>
            <ul className="space-y-2">
              {["Web Development", "Mobile Apps", "UI/UX Design", "Consulting"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-green-600 hover:text-pink-600 transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-300 bg-white/50 py-4 text-center">
        <p className="text-pink-800 text-sm font-bold">
          &copy; {new Date().getFullYear()} MSNS-DEV | M.S. NAZ HIGH SCHOOL® |
          HH_STUDIOS™ | All rights reserved.
        </p>
      </div>
    </footer>
  );
};


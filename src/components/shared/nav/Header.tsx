'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { CldImage } from 'next-cloudinary'
import { Button } from '~/components/ui/button'
import Link from 'next/link'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { User } from 'lucide-react'
import { cn } from "~/lib/utils"

type HeaderProps = React.HTMLAttributes<HTMLElement>

export default function Header({ className, ...props }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [isAuthenticated] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const isDashboard = pathname === '/dashboard' || pathname === '/academics' || pathname === '/revenue' || pathname === '/account' || pathname === '/userReg';

  return (
    <header
      className={cn(
        `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out`,
        scrolled ? 'bg-transparent backdrop-blur-md py-2' : 'bg-green-100/40 py-2',
        className
      )}
      {...props}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-full">
        {/* Logo Section */}
        <Link href="/" className="flex items-center">
          <CldImage
            src="Official_LOGO_grn_ic9ldd"
            alt="Logo"
            width={50}
            height={50}
            className="transition-all duration-300 ease-in-out hover:scale-110"
          />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:block">
          <ul className="flex space-x-4 text-black font-bold">
            <li>
              <Link href="/dashboard">
                <Button variant="ghost">Home</Button>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <Button variant="ghost">About</Button>
              </Link>
            </li>
            <li>
              <Link href="">
                <Button variant="ghost">Contact</Button>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-white/20 focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition-all duration-300 ease-in-out"
                >
                  <User className="h-5 w-5 text-red-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-transform duration-300 ease-in-out"
              >
                <DropdownMenuItem className="hover:bg-purple-100 focus:bg-purple-200">
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-purple-100 focus:bg-purple-200">
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-purple-100 focus:bg-purple-200">
                  <Link href="/logout">Logout</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : isDashboard ? (
            <Link href="/account">
              <Button variant="outline">Profile</Button>
            </Link>
          ) : (
            <Link href="/signup">
              <Button variant="outline">Join Now</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}


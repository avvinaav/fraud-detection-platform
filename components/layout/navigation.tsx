'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Search, Shield, Settings } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/analyze', label: 'Analyze', icon: Search },
  { href: '/investigate/demo', label: 'Investigate', icon: Shield },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b bg-zinc-950/80 backdrop-blur-xl">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">FraudDetect AI</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-4 py-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2 relative z-10">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-500' : 'text-zinc-400'}`} />
                    <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-zinc-400 hover:text-white'}`}>
                      {item.label}
                    </span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/20 rounded-lg"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-right">
              <p className="font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@frauddetect.ai</p>
            </div>
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
              A
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

"use client";

import {
  LayoutDashboard,
  Users,
  Pencil,
  FileText,
  BarChart3,
  Shield,
  Settings,
  HelpCircle,
  Bell,
  LogOut,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: false },
  { icon: Users, label: "Pengguna", active: false },
  { icon: Pencil, label: "Desain", active: true },
  { icon: FileText, label: "Konten", active: false },
  { icon: BarChart3, label: "Laporan", active: false },
  { icon: Shield, label: "Keamanan", active: false },
];

const bottomItems = [
  { icon: Settings, label: "Pengaturan" },
  { icon: HelpCircle, label: "Bantuan" },
  { icon: Bell, label: "Notifikasi" },
  { icon: LogOut, label: "Keluar" },
];

export default function MainNavigation() {
  return (
    <nav className="flex flex-col w-14 bg-white border-r border-border items-center py-4 justify-between shrink-0">
      <div className="flex flex-col items-center gap-1">
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center mb-4">
          <span className="text-white text-xs font-bold">O</span>
        </div>
        {navItems.map((item) => (
          <button
            key={item.label}
            title={item.label}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
              item.active
                ? "bg-primary-light text-primary"
                : "text-text-secondary hover:bg-gray-100"
            }`}
          >
            <item.icon size={20} />
          </button>
        ))}
      </div>
      <div className="flex flex-col items-center gap-1">
        {bottomItems.map((item) => (
          <button
            key={item.label}
            title={item.label}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-text-secondary hover:bg-gray-100 transition-colors"
          >
            <item.icon size={20} />
          </button>
        ))}
      </div>
    </nav>
  );
}

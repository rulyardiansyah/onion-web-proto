"use client";

import Image from "next/image";
import { Settings, HelpCircle, Bell, LogOut } from "lucide-react";

const navItems = [
  { icon: "/icon-main-menu-01.png", label: "Dashboard", active: false },
  { icon: "/icon-main-menu-02.png", label: "Pengguna", active: false },
  { icon: "/icon-main-menu-03.png", label: "Desain", active: true },
  { icon: "/icon-main-menu-04.png", label: "Konten", active: false },
  { icon: "/icon-main-menu-05.png", label: "Laporan", active: false },
  { icon: "/icon-main-menu-06.png", label: "Keamanan", active: false },
  { icon: "/icon-main-menu-07.png", label: "Pengaturan", active: false },
];

const bottomItems = [
  { icon: Settings, label: "Pengaturan" },
  { icon: HelpCircle, label: "Bantuan" },
  { icon: Bell, label: "Notifikasi" },
  { icon: LogOut, label: "Keluar" },
];

export default function MainNavigation() {
  return (
    <nav className="main-nav">
      <div className="main-nav__top">
        <div className="main-nav__logo">
          <Image src="/product-logo.png" alt="Product Logo" width={36} height={36} />
        </div>
        {navItems.map((item) => (
          <button
            key={item.label}
            title={item.label}
            className={`main-nav__item${item.active ? " main-nav__item--active" : " main-nav__item--inactive"}`}
          >
            <Image src={item.icon} alt={item.label} width={20} height={20} />
          </button>
        ))}
      </div>
      <div className="main-nav__bottom">
        {bottomItems.map((item) => (
          <button key={item.label} title={item.label} className="main-nav__item">
            <item.icon size={20} />
          </button>
        ))}
      </div>
    </nav>
  );
}

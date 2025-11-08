
import Link from 'next/link';
import { BrandingSettings } from "@/lib/types";
import { DynamicIcon } from './dynamic-icon';
import { Facebook, Twitter, Instagram, Phone, Mail, MapPin } from 'lucide-react';

export function Footer({ branding }: { branding: BrandingSettings | null }) {
  const footerText = branding?.footerText || `© ${new Date().getFullYear()} Gc Fiber Net. All rights reserved.`;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/user/plans", label: "Plans" },
    { href: "/user/support", label: "Support" },
    { href: "/auth/login", label: "Login" },
  ];

  const legalLinks = [
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
  ]

  const socialLinks = [
    { href: "#", icon: Facebook },
    { href: "#", icon: Twitter },
    { href: "#", icon: Instagram },
  ]

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Branding Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <DynamicIcon iconName={branding?.icon || "Wifi"} className="h-7 w-7 text-primary" />
              <span className="font-bold text-xl">{branding?.brandName || "Gc Fiber Net"}</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
                Your trusted local internet provider for Aali Village, offering reliable speed and friendly service.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
           {/* Contact Section */}
           <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Contact Us</h3>
             <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                    <span>Aali Village, New Delhi, India</span>
                </li>
                 <li className="flex items-start">
                    <Mail className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                    <a href="mailto:support@gcfibernet.com" className="hover:text-primary">support@gcfibernet.com</a>
                </li>
                 <li className="flex items-start">
                    <Phone className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                    <a href="tel:+919999999999" className="hover:text-primary">+91 9999-XXX-XXX</a>
                </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="py-6 border-t flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground text-center sm:text-left mb-4 sm:mb-0">
            {footerText}
          </p>
          <div className="flex items-center space-x-4">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <Link key={index} href={social.href} className="text-muted-foreground hover:text-primary transition-colors">
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">Social Media</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

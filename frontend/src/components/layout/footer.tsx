import {
  Mail,
  Phone,
  MapPin,
  Leaf,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import { Link } from "react-router-dom";

interface FooterProps {
  userType: "expert" | "patient";
}

export function Footer({ userType }: FooterProps) {
  const footerLinks = {
    expert: [
      {
        title: "Professional",
        links: [
          { label: "Dashboard", href: "/dashboard" },
          { label: "Patient Management", href: "/patients" },
          { label: "Resources", href: "/resources" },
          { label: "Clinical Guidelines", href: "/guidelines" },
        ],
      },
      {
        title: "Support",
        links: [
          { label: "Help Center", href: "/help" },
          { label: "Documentation", href: "/docs" },
          { label: "Community", href: "/community" },
        ],
      },
    ],
    patient: [
      {
        title: "Health",
        links: [
          { label: "Find Experts", href: "/experts" },
          { label: "Health Articles", href: "/articles" },
          { label: "Wellness Tips", href: "/tips" },
          { label: "Emergency Care", href: "/emergency" },
        ],
      },
      {
        title: "Support",
        links: [
          { label: "FAQs", href: "/faqs" },
          { label: "Contact Us", href: "/contact" },
          { label: "Patient Rights", href: "/rights" },
        ],
      },
    ],
  };

  return (
    <footer className="w-full bg-gray-900 text-gray-300 border-t border-gray-700">
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {/* Brand & Slogan */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center space-x-2 text-white">
                <Leaf className="h-6 w-6 text-green-500" />
                <span className="text-xl font-bold">AyurCare</span>
              </Link>
              <p className="text-gray-400">
                Empowering health through traditional wisdom and modern care.
              </p>
              <div className="flex items-center space-x-2 text-green-400 text-sm">
                <Leaf className="w-4 h-4" />
                <span>Ancient roots, modern healing</span>
              </div>
            </div>

            {/* Dynamic Links */}
            {footerLinks[userType].map((section) => (
              <div key={section.title}>
                <h3 className="text-lg font-semibold text-white mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="hover:text-indigo-400 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
              <div className="space-y-3">
                <a
                  href="mailto:ayurcare@example.com"
                  className="flex items-center space-x-2 hover:text-indigo-400"
                >
                  <Mail className="w-5 h-5" />
                  <span>ayurcare@example.com</span>
                </a>
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>+91 9876543210</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Mangalore, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Socials + Copyright */}
          <div className="mt-10 pt-6 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © {new Date().getFullYear()} AyurCare. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-indigo-400">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-indigo-400">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-indigo-400">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-indigo-400">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

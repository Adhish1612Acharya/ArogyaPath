import { Leaf, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
  userType: 'expert' | 'patient';
}

export function Footer({ userType }: FooterProps) {
  const footerLinks = {
    expert: [
      {
        title: 'Professional',
        links: [
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Patient Management', href: '/patients' },
          { label: 'Resources', href: '/resources' },
          { label: 'Clinical Guidelines', href: '/guidelines' },
        ],
      },
      {
        title: 'Support',
        links: [
          { label: 'Help Center', href: '/help' },
          { label: 'Documentation', href: '/docs' },
          { label: 'Community', href: '/community' },
        ],
      },
    ],
    patient: [
      {
        title: 'Health',
        links: [
          { label: 'Find Experts', href: '/experts' },
          { label: 'Health Articles', href: '/articles' },
          { label: 'Wellness Tips', href: '/tips' },
          { label: 'Emergency Care', href: '/emergency' },
        ],
      },
      {
        title: 'Support',
        links: [
          { label: 'FAQs', href: '/faqs' },
          { label: 'Contact Us', href: '/contact' },
          { label: 'Patient Rights', href: '/rights' },
        ],
      },
    ],
  };

  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold">AyurCare</span>
            </Link>
            <p className="text-gray-600">
              Empowering health through traditional wisdom and modern care.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-600">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-600">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-600">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-600">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {footerLinks[userType].map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-gray-600 hover:text-green-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t">
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} AyurCare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
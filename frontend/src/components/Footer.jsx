import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-espresso text-cream/70 mt-24">
      {/* Newsletter strip */}
      <div className="border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-serif text-2xl font-light text-cream mb-1">Stay in the loop</p>
            <p className="text-2xs tracking-widest uppercase text-cream/50">New arrivals · Exclusive offers · Interior inspiration</p>
          </div>
          <form className="flex w-full max-w-sm" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-white/10 border border-white/20 text-cream placeholder-cream/30 px-4 py-3 text-sm focus:outline-none focus:border-white/50 transition-colors"
            />
            <button className="bg-gold text-white text-2xs font-medium tracking-widest uppercase px-6 py-3 hover:bg-gold/90 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-serif text-2xl font-light text-cream tracking-[0.15em] mb-4">MAISON</p>
            <p className="text-xs leading-relaxed text-cream/50 mb-6">
              Curating beautiful home decor for discerning tastes. Every piece is selected for quality, craftsmanship, and lasting beauty.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Instagram, href: '#instagram', label: 'Instagram' },
                { Icon: Twitter, href: '#twitter', label: 'Twitter' },
                { Icon: Facebook, href: '#facebook', label: 'Facebook' },
                { Icon: Youtube, href: '#youtube', label: 'Youtube' },
              ].map(({ Icon, href, label }) => (
                <a key={href} href={href} aria-label={label} className="text-cream/40 hover:text-cream transition-colors duration-200">
                  <Icon size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="text-2xs tracking-widest3 uppercase text-cream/40 mb-5 font-medium">Shop</p>
            <ul className="space-y-3">
              {['All Products','Living Room','Bedroom','Kitchen & Dining','Bathroom','Wall Art','Lighting'].map(item => (
                <li key={item}>
                  <Link
                    to={item === 'All Products' ? '/collections' : `/collections?category=${item.toLowerCase().replace(/ & /g,'-').replace(/ /g,'-')}`}
                    className="text-xs text-cream/50 hover:text-cream transition-colors duration-200"
                  >{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-2xs tracking-widest3 uppercase text-cream/40 mb-5 font-medium">Company</p>
            <ul className="space-y-3">
              {['About Us','Our Story','Sustainability','Press','Careers','Contact'].map(item => (
                <li key={item}>
                  <a href="#" className="text-xs text-cream/50 hover:text-cream transition-colors duration-200">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <p className="text-2xs tracking-widest3 uppercase text-cream/40 mb-5 font-medium">Help</p>
            <ul className="space-y-3">
              {['FAQ','Shipping & Delivery','Returns & Exchanges','Track Your Order','Gift Cards','Size Guide'].map(item => (
                <li key={item}>
                  <a href="#" className="text-xs text-cream/50 hover:text-cream transition-colors duration-200">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-2xs tracking-widest3 uppercase text-cream/40 mb-5 font-medium">Contact</p>
            <ul className="space-y-3 text-xs text-cream/50">
              <li>Mon–Fri, 9am–6pm</li>
              <li><a href="mailto:hello@maison.com" className="hover:text-cream transition-colors">hello@maison.com</a></li>
              <li><a href="tel:+18001234567" className="hover:text-cream transition-colors">+1 800 123 4567</a></li>
              <li className="pt-2">
                <p className="text-cream/30 text-2xs leading-relaxed">12 Rue de Rivoli,<br/>Paris, 75001</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-2xs text-cream/30">
          <p>© 2026 Maison Home Decor. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-cream/70 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-cream/70 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-cream/70 transition-colors">Cookie Settings</a>
          </div>
          <div className="flex items-center gap-2 text-cream/20">
            {['VISA','MC','AMEX','PayPal'].map(p => (
              <span key={p} className="border border-white/10 px-2 py-0.5 text-2xs">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

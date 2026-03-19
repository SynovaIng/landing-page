"use client";

import Image from "next/image";
import Link from "next/link";

import { CONTACT_INFO } from "@/contexts/shared/app/contact-info";

import { useTheme } from "./ThemeContext";

const footerLinks = {
  empresa: [
    { label: "Nosotros", href: "/nosotros" },
    { label: "Certificaciones", href: "/nosotros#certificaciones" },
    { label: "Trabaja con nosotros", href: "/contacto" },
  ],
  servicios: [
    { label: "Residencial", href: "/servicios#residencial" },
    { label: "Industrial", href: "/servicios#industrial" },
    { label: "Certificación SEC", href: "/servicios#certificaciones" },
    { label: "Mantención", href: "/servicios#mantencion" },
  ],
};

const socials = [
  {
    label: "Instagram",
    href: CONTACT_INFO.socials.instagram,
    icon: (
      <path
        fillRule="evenodd"
        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.468 2.373c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
        clipRule="evenodd"
      />
    ),
  },
  {
    label: "TikTok",
    href: CONTACT_INFO.socials.tiktok,
    icon: (
      <path d="M16.6 5.82c1.46 1.05 3.18 1.66 4.94 1.74v3.02c-1.64-.04-3.24-.42-4.67-1.12l-.01 5.47c0 2.91-2.36 5.27-5.27 5.27s-5.27-2.36-5.27-5.27 2.36-5.27 5.27-5.27c.31 0 .62.03.92.08v3.11a2.21 2.21 0 0 0-.92-.2 2.28 2.28 0 1 0 2.28 2.28V2.5h2.73c.13 1.24.73 2.39 1.69 3.32Z" />
    ),
  },
  {
    label: "WhatsApp",
    href: `https://wa.me/${CONTACT_INFO.whatsappNumber.replace(/\D/g, "")}`,
    icon: (
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    ),
  },
];

export default function Footer() {
  const { activeTheme } = useTheme();

  return (
    <footer className="bg-(--color-footer-bg) border-t border-gray-700 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <div className="mb-6">
              <Image
                src={activeTheme.logoFooter}
                alt="SYNOVA"
                width={0}
                height={0}
                sizes="100vw"
                className="h-18 w-auto"
              />
            </div>
            <p className="text-sm text-footer-text-muted leading-relaxed mb-6">
              Soluciones eléctricas de alto estándar para industrias y
              residencias. Certificación, seguridad y compromiso en cada
              proyecto.
            </p>
            <div className="flex gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-footer-text-muted hover:text-primary transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    {s.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="text-sm font-semibold text-(--color-footer-text) uppercase tracking-wider mb-4">
              Empresa
            </h3>
            <ul className="space-y-3">
              {footerLinks.empresa.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-footer-text-muted hover:text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Servicios */}
          <div>
            <h3 className="text-sm font-semibold text-(--color-footer-text) uppercase tracking-wider mb-4">
              Servicios
            </h3>
            <ul className="space-y-3">
              {footerLinks.servicios.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-footer-text-muted hover:text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-sm font-semibold text-(--color-footer-text) uppercase tracking-wider mb-4">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">
                  location_on
                </span>
                <span className="text-sm text-footer-text-muted">{CONTACT_INFO.address}</span>
              </li>
              {CONTACT_INFO.phoneNumbers.map((phoneNumber) => (
                <li key={phoneNumber} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    call
                  </span>
                  <a
                    href={`tel:${phoneNumber}`}
                    className="text-sm text-footer-text-muted hover:text-primary transition-colors"
                  >
                    {phoneNumber}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  mail
                </span>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-sm text-footer-text-muted hover:text-primary transition-colors"
                >
                  {CONTACT_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-footer-text-muted order-2 md:order-1">
            © 2025 SYNOVA Servicios Eléctricos. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 order-1 md:order-2">
            <a href="#" className="text-xs text-footer-text-muted hover:text-muted">
              Privacidad
            </a>
            <a href="#" className="text-xs text-footer-text-muted hover:text-muted">
              Términos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

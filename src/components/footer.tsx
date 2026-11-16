import { sectionList } from '@/lib/sections';
import { site, socialConfigured } from '@/lib/site';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="flex items-center gap-2.5 text-[15px] font-semibold">
            <span
              className="grid size-7 place-items-center rounded-lg text-[11px] font-bold"
              style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}
            >
              MG
            </span>
            {site.name}
          </p>
          <p className="prose-text text-muted mt-4 max-w-sm text-pretty text-[14px] leading-relaxed">
            {site.tagline} Sistemas, integrações e automações com IA — do escopo
            à entrega.
          </p>
          <p className="text-faint data mt-5 text-[11px]">
            Feito com Next.js, TypeScript e Tailwind. Código próprio.
          </p>
        </div>

        <nav aria-label="Rodapé — seções">
          <h2 className="label">seções</h2>
          <ul className="mt-4 space-y-2.5">
            {sectionList.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-muted flex items-baseline gap-2.5 text-[13px] transition hover:text-[color:var(--cyan)]"
                >
                  <span className="data text-faint text-[11px]">{section.index}</span>
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="label">contato</h2>
          <ul className="mt-4 space-y-2.5 text-[13px]">
            <li>
              <a
                href={`tel:${site.phone.tel}`}
                className="text-muted transition hover:text-[color:var(--cyan)]"
              >
                {site.phone.display}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="text-muted break-all transition hover:text-[color:var(--cyan)]"
              >
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={site.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition hover:text-[color:var(--cyan)]"
              >
                GitHub ↗
              </a>
            </li>
            {socialConfigured(site.socials.linkedin) ? (
              <li>
                <a
                  href={site.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition hover:text-[color:var(--cyan)]"
                >
                  LinkedIn ↗
                </a>
              </li>
            ) : null}
            <li className="text-faint pt-1">{site.location}</li>
          </ul>
        </div>
      </div>

      <div className="container-page flex flex-col gap-2 border-t py-5 text-[11.5px] sm:flex-row sm:items-center">
        <p className="text-faint">
          © {year} {site.name}. Todos os direitos reservados.
        </p>
        <a
          href="#topo"
          className="text-faint transition hover:text-[color:var(--cyan)] sm:ml-auto"
        >
          ↑ voltar ao topo
        </a>
      </div>
    </footer>
  );
}

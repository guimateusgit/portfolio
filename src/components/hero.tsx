'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { heroTags, site, socialConfigured, whatsappLink } from '@/lib/site';
import { Magnetic } from './fx/magnetic';
import { Tilt } from './fx/tilt';

/** Anéis do núcleo orbital. `r` é o raio em % do lado do container. */
const ORBITS = [
  { r: 25, duration: 34, reverse: false, items: ['React', 'Next.js', 'TypeScript'] },
  { r: 38, duration: 52, reverse: true, items: ['Node.js', 'PostgreSQL', 'Docker', 'IA'] },
] as const;

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.898 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.548 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488" />
  </svg>
);

export function Hero() {
  const reduced = useReducedMotion();

  const fadeUp = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.75,
            delay,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          },
        };

  return (
    <section id="topo" className="relative pt-28 md:pt-36">
      <div className="container-page pb-20 md:pb-28">
        <div className="grid items-center gap-16 lg:grid-cols-[1.12fr_0.88fr]">
          {/* ---------------- coluna de texto ---------------- */}
          <div>
            <motion.div {...fadeUp(0)} className="flex flex-wrap items-center gap-3">
              <span className="label">00 / início</span>
              <span className="panel inline-flex items-center gap-2 rounded-full px-3 py-1.5">
                <span
                  className="pulse-soft size-1.5 rounded-full"
                  style={{ background: 'var(--accent)' }}
                  aria-hidden
                />
                <span className="data text-accent text-[11px]">
                  disponível para novos projetos
                </span>
              </span>
            </motion.div>

            <motion.p {...fadeUp(0.06)} className="text-faint data mt-7 text-[12px]">
              {site.name} · desenvolvedor full stack · {site.location}
            </motion.p>

            <motion.h1
              {...fadeUp(0.12)}
              className="mt-4 max-w-3xl text-balance text-[clamp(2.1rem,5.4vw,3.9rem)] font-bold leading-[1.04] tracking-[-0.02em]"
            >
              Eu construo sistemas e automações que{' '}
              <span className="grad-text">devolvem tempo</span> para a sua empresa.
            </motion.h1>

            <motion.p
              {...fadeUp(0.2)}
              className="prose-text text-muted mt-7 max-w-xl text-pretty text-[17px] leading-relaxed"
            >
              Site, sistema interno, integração entre programas, atendimento
              automático no WhatsApp. Se hoje alguém da sua equipe faz isso na
              mão, provavelmente dá para automatizar. Converso em português,
              entrego com prazo e valor fechados, e você acompanha desde a
              primeira semana.
            </motion.p>

            <motion.div {...fadeUp(0.28)} className="mt-9 flex flex-wrap items-center gap-3">
              <Magnetic>
                <a href="#montar" className="btn-primary group">
                  Montar meu projeto
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </a>
              </Magnetic>

              <Magnetic>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  <WhatsAppIcon className="size-[17px]" />
                  Chamar no WhatsApp
                </a>
              </Magnetic>
            </motion.div>

            <motion.div {...fadeUp(0.34)} className="mt-6 flex flex-wrap items-center gap-5">
              <p className="text-faint prose-text text-[13px]">
                Primeira conversa gratuita · resposta em até 24h em dias úteis
              </p>
              <span className="h-4 w-px bg-[color:var(--line)]" aria-hidden />
              <div className="flex items-center gap-4">
                <a
                  href={site.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="text-faint transition hover:text-[color:var(--cyan)]"
                >
                  <Github className="size-[18px]" aria-hidden />
                </a>
                <a
                  href={site.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className={`text-faint transition hover:text-[color:var(--cyan)] ${
                    socialConfigured(site.socials.linkedin) ? '' : 'hidden'
                  }`}
                >
                  <Linkedin className="size-[18px]" aria-hidden />
                </a>
                <a
                  href={`mailto:${site.email}`}
                  aria-label="Enviar e-mail"
                  className="text-faint transition hover:text-[color:var(--cyan)]"
                >
                  <Mail className="size-[18px]" aria-hidden />
                </a>
              </div>
            </motion.div>
          </div>

          {/* ---------------- núcleo orbital ---------------- */}
          <motion.div
            initial={reduced ? undefined : { opacity: 0, scale: 0.9 }}
            animate={reduced ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-md"
          >
            <Tilt max={9}>
              <div className="relative mx-auto aspect-square w-full">
                {/* halo */}
                <div
                  className="absolute inset-[12%] rounded-full blur-3xl"
                  style={{ background: 'var(--aurora-a)' }}
                  aria-hidden
                />

                {/* anéis estáticos */}
                {[25, 38, 48].map((radius) => (
                  <div
                    key={radius}
                    className="absolute rounded-full border"
                    style={{
                      inset: `${50 - radius}%`,
                      borderColor: 'var(--line)',
                    }}
                    aria-hidden
                  />
                ))}

                {/* núcleo */}
                <div className="absolute left-1/2 top-1/2 flex size-[22%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-[color:var(--line-strong)] bg-[color:var(--panel-solid)]">
                  <span
                    className="text-[clamp(1rem,2.6vw,1.6rem)] font-bold leading-none"
                    style={{ color: 'var(--accent)' }}
                  >
                    MG
                  </span>
                  <span className="label mt-1 scale-[0.8] text-[9px]">{site.age} anos</span>
                </div>

                {/* chips orbitando */}
                {ORBITS.map((orbit) => (
                  <div
                    key={orbit.r}
                    className="absolute inset-0"
                    style={
                      reduced
                        ? undefined
                        : {
                            animation: `spin-slow ${orbit.duration}s linear infinite`,
                            animationDirection: orbit.reverse ? 'reverse' : 'normal',
                          }
                    }
                  >
                    {orbit.items.map((item, index) => {
                      const angle = (index / orbit.items.length) * Math.PI * 2 - Math.PI / 2;
                      const left = 50 + orbit.r * Math.cos(angle);
                      const top = 50 + orbit.r * Math.sin(angle);

                      return (
                        <span
                          key={item}
                          className="absolute"
                          style={{
                            left: `${left}%`,
                            top: `${top}%`,
                            transform: 'translate(-50%, -50%)',
                          }}
                        >
                          {/* contra-rotação: mantém o texto sempre na horizontal */}
                          <span
                            className="block"
                            style={
                              reduced
                                ? undefined
                                : {
                                    animation: `spin-slow ${orbit.duration}s linear infinite`,
                                    animationDirection: orbit.reverse ? 'normal' : 'reverse',
                                  }
                            }
                          >
                            <span className="panel data block whitespace-nowrap rounded-full px-2.5 py-1 text-[10.5px] transition hover:border-[color:var(--cyan)] hover:text-[color:var(--cyan)]">
                              {item}
                            </span>
                          </span>
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
            </Tilt>

            {/* legenda do visual */}
            <p className="text-faint mt-4 text-center text-[11px]">
              {heroTags.length} tecnologias no dia a dia · passe o mouse
            </p>
          </motion.div>
        </div>

        {/* indicador de rolagem */}
        <motion.a
          {...fadeUp(0.5)}
          href="#desafios"
          className="text-faint mt-16 inline-flex items-center gap-2 text-[12px] transition hover:text-[color:var(--cyan)]"
        >
          <ArrowDown className="size-4 animate-bounce" aria-hidden />
          role para ver se o seu caso está aqui
        </motion.a>
      </div>
    </section>
  );
}

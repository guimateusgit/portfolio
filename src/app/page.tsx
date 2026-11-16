import { About } from '@/components/about';
import { AiSection } from '@/components/ai-section';
import { Configurator } from '@/components/configurator';
import { Contact } from '@/components/contact';
import { Experience } from '@/components/experience';
import { Faq } from '@/components/faq';
import { Footer } from '@/components/footer';
import { Backdrop } from '@/components/fx/backdrop';
import { GithubActivity } from '@/components/github-activity';
import { Hero } from '@/components/hero';
import { Pains } from '@/components/pains';
import { Process } from '@/components/process';
import { Projects } from '@/components/projects';
import { Services } from '@/components/services';
import { CommandPalette } from '@/components/shell/command-palette';
import { ProgressRail } from '@/components/shell/progress-rail';
import { TopBar } from '@/components/shell/top-bar';

export default function HomePage() {
  return (
    <>
      <Backdrop />
      <TopBar />
      <ProgressRail />

      <main id="conteudo">
        <Hero />
        <Pains />
        <About />
        <Services />
        <AiSection />
        <Configurator />
        <Experience />
        <GithubActivity />
        <Projects />
        <Process />
        <Faq />
        <Contact />
      </main>

      <Footer />
      <CommandPalette />
    </>
  );
}

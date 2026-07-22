import { useState, useEffect, useMemo, useRef } from 'react';
import { portfolio } from '../content/portfolio';

type NavItem = {
  id: string;
  label: string;
  parentId?: string;
};

type NavSection = NavItem & {
  children?: NavItem[];
};

const sections: NavSection[] = [
  { id: 'intro', label: 'Intro' },
  { id: 'projects', label: 'Featured Projects' },
  { id: 'publications', label: 'Publications' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

const phoneHref = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 ? `tel:+1${digits}` : `tel:+${digits}`;
};

const parseProjectLink = (link: string) => {
  const separatorIndex = link.indexOf(': ');
  if (separatorIndex === -1) {
    return { label: link, url: link };
  }

  return {
    label: link.slice(0, separatorIndex),
    url: link.slice(separatorIndex + 2),
  };
};

const assetSrc = (src: string) => {
  if (!src.startsWith('/')) {
    return src;
  }

  return `${import.meta.env.BASE_URL}${src.slice(1)}`;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const scrollToElement = (element: HTMLElement) => {
  const startPosition = window.scrollY;
  const targetPosition = element.getBoundingClientRect().top + window.scrollY;
  const distance = targetPosition - startPosition;
  const duration = 320;
  const startTime = performance.now();

  const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    window.scrollTo(0, startPosition + distance * easeOutCubic(progress));

    if (progress < 1) {
      window.requestAnimationFrame(animate);
    }
  };

  window.requestAnimationFrame(animate);
};

export default function App() {
  const [activeSection, setActiveSection] = useState('intro');
  const [activeItem, setActiveItem] = useState('intro');
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);
  const scrollSettleTimeout = useRef<number | null>(null);
  const mobileNavItemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const navigationSections: NavSection[] = useMemo(
    () =>
      sections.map((section) => {
        if (section.id === 'projects') {
          return {
            ...section,
            children: portfolio.projects.items.map((project) => ({
              id: `project-${slugify(project.title)}`,
              label: project.title,
              parentId: section.id,
            })),
          };
        }

        if (section.id === 'publications') {
          return {
            ...section,
            children: portfolio.publications.items.map((publication) => ({
              id: `publication-${slugify(publication.title)}`,
              label: publication.title,
              parentId: section.id,
            })),
          };
        }

        if (section.id === 'experience') {
          return {
            ...section,
            children: portfolio.experience.items.map((experience) => ({
              id: `experience-${slugify(experience.company)}`,
              label: experience.company,
              parentId: section.id,
            })),
          };
        }

        if (section.id === 'education') {
          return {
            ...section,
            children: portfolio.education.items.map((education) => ({
              id: `education-${slugify(education.school)}`,
              label: education.school,
              parentId: section.id,
            })),
          };
        }

        return section;
      }),
    [],
  );

  const navigationItems = useMemo(
    () => navigationSections.flatMap((section) => [section, ...(section.children ?? [])]),
    [navigationSections],
  );

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      setIsProgrammaticScroll(true);
      if (scrollSettleTimeout.current) {
        window.clearTimeout(scrollSettleTimeout.current);
      }
      scrollToElement(element);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      let currentItem = navigationItems[0];

      for (const section of navigationItems) {
        const element = document.getElementById(section.id);
        if (element && scrollPosition >= element.offsetTop) {
          currentItem = section;
        }
      }

      setActiveItem(currentItem.id);
      setActiveSection(currentItem.parentId ?? currentItem.id);

      if (isProgrammaticScroll) {
        if (scrollSettleTimeout.current) {
          window.clearTimeout(scrollSettleTimeout.current);
        }

        scrollSettleTimeout.current = window.setTimeout(() => {
          setIsProgrammaticScroll(false);
        }, 180);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navigationItems, isProgrammaticScroll]);

  useEffect(
    () => () => {
      if (scrollSettleTimeout.current) {
        window.clearTimeout(scrollSettleTimeout.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      return;
    }

    mobileNavItemRefs.current[activeSection]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [activeSection]);

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden w-44 lg:block">
        <div className="space-y-5">
          {navigationSections.map((section) => (
            <div key={section.id} className="space-y-2">
              <button
                onClick={() => scrollToSection(section.id)}
                className="group block text-left"
              >
                <span
                  className={`text-sm transition-colors ${
                    activeSection === section.id
                      ? 'text-gray-900'
                      : 'text-gray-400 group-hover:text-gray-600'
                  }`}
                >
                  {section.label}
                </span>
              </button>
              {!isProgrammaticScroll && activeSection === section.id && section.children && (
                <div className="space-y-2 border-l border-gray-200 pl-3">
                  {section.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => scrollToSection(child.id)}
                      className="block max-w-full text-left"
                    >
                      <span
                        className={`block truncate text-xs transition-colors ${
                          activeItem === child.id
                            ? 'text-gray-900'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {child.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      <nav className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex gap-4 overflow-x-auto pb-1">
          {navigationSections.map((section) => (
            <button
              key={section.id}
              ref={(element) => {
                mobileNavItemRefs.current[section.id] = element;
              }}
              onClick={() => scrollToSection(section.id)}
              className="shrink-0 text-left"
            >
              <span
                className={`block text-sm transition-colors ${
                  activeSection === section.id ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {section.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      <section id="intro" className="min-h-screen scroll-mt-24 flex items-center px-8 pt-24 lg:pt-0">
        <div className="max-w-3xl mx-auto space-y-12">
          <h1 className="text-7xl md:text-8xl tracking-tight text-gray-900">
            {portfolio.intro.name}
          </h1>
          <div className="space-y-6">
            {portfolio.intro.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-xl text-gray-600 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="min-h-screen scroll-mt-24 py-32 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl mb-20 text-gray-900">{portfolio.projects.title}</h2>

          <div className="space-y-24">
            {portfolio.projects.items.map((project) => {
              const projectId = `project-${slugify(project.title)}`;
              const visualFrame = project.image ? (
                <div className="aspect-video overflow-hidden bg-gray-100 rounded-2xl">
                  <img
                    src={assetSrc(project.image)}
                    alt={project.imageAlt}
                    className={`h-full w-full ${project.imageFit === 'contain' ? 'object-contain p-4' : 'object-cover'}`}
                    loading="lazy"
                  />
                </div>
              ) : null;

              const visual =
                visualFrame && project.url ? (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="block group">
                    {visualFrame}
                  </a>
                ) : (
                  visualFrame
                );

              const projectIntro = (
                <>
                  <div className="text-sm text-gray-400">
                    {project.organization} • {project.dates}
                  </div>
                  <h3 className="text-4xl text-gray-900">{project.title}</h3>
                  <p className="text-xl text-gray-600 leading-relaxed">{project.description}</p>
                  {(project.url || project.blogUrl) && (
                    <div className="flex flex-wrap gap-4">
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex text-sm text-gray-900 border-b border-gray-900 hover:text-gray-600 hover:border-gray-600 transition-colors"
                        >
                          {project.urlLabel}
                        </a>
                      )}
                      {project.blogUrl && (
                        <a
                          href={project.blogUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex text-sm text-gray-900 border-b border-gray-900 hover:text-gray-600 hover:border-gray-600 transition-colors"
                        >
                          Read blog
                        </a>
                      )}
                    </div>
                  )}
                </>
              );

              const projectDetails = (
                <>
                  <div className="flex flex-wrap gap-2 pt-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="pt-4 space-y-2">
                    {project.highlights.map((highlight) => (
                      <div key={highlight} className="flex items-center gap-3 text-gray-600">
                        <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                  {project.links.length > 0 && (
                    <div className="flex flex-wrap gap-4 pt-2">
                      {project.links.map((link) => {
                        const projectLink = parseProjectLink(link);
                        return (
                          <a
                            key={link}
                            href={projectLink.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                          >
                            {projectLink.label}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </>
              );

              const content = (
                <div className="space-y-6">
                  {projectIntro}
                  {projectDetails}
                </div>
              );

              if (!visual) {
                return (
                  <div
                    id={projectId}
                    key={project.title}
                    className="grid scroll-mt-24 grid-cols-1 gap-10 border-l-2 border-gray-200 pl-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.7fr)]"
                  >
                    <div className="space-y-6">
                      {projectIntro}
                    </div>

                    <div className="space-y-6 lg:pt-8">
                      {projectDetails}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  id={projectId}
                  key={project.title}
                  className="grid scroll-mt-24 grid-cols-1 gap-10 border-l-2 border-gray-200 pl-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.7fr)]"
                >
                  <div className="space-y-8">
                    <div className="space-y-6">{projectIntro}</div>
                    {visual}
                  </div>
                  <div className="space-y-6 lg:pt-8">{projectDetails}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="publications" className="scroll-mt-24 py-32 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl mb-20 text-gray-900">{portfolio.publications.title}</h2>
          <div className="space-y-12">
            {portfolio.publications.items.map((publication) => (
              <a
                id={`publication-${slugify(publication.title)}`}
                key={publication.url}
                href={publication.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group border-l-2 border-gray-200 pl-8 hover:border-gray-900 transition-colors"
              >
                <div className="text-sm text-gray-400 mb-2">
                  {publication.source} • {publication.year}
                </div>
                <h3 className="text-2xl text-gray-900 group-hover:text-gray-600 transition-colors mb-3">
                  {publication.title}
                </h3>
                <p className="text-gray-500">{publication.authors}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="min-h-screen scroll-mt-24 py-32 px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl mb-20 text-gray-900">{portfolio.experience.title}</h2>

          <div className="space-y-16">
            {portfolio.experience.items.map((experience) => (
              <div
                id={`experience-${slugify(experience.company)}`}
                key={experience.company}
                className="scroll-mt-24 border-l-2 border-gray-300 pl-8 space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-2">
                  <div>
                    <h3 className="text-3xl text-gray-900">{experience.company}</h3>
                    <div className="text-gray-500 mt-1">{experience.role}</div>
                  </div>
                  <div className="text-gray-400">{experience.dates}</div>
                </div>
                <p className="text-gray-600 leading-relaxed max-w-3xl">
                  {experience.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {experience.tags.map((tag, tagIndex) => (
                    <span key={tag} className="contents">
                      {tagIndex > 0 && <span className="text-gray-300">•</span>}
                      <span className="text-sm text-gray-500">{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div id="education" className="mt-32 scroll-mt-24">
            <h2 className="text-5xl mb-20 text-gray-900">{portfolio.education.title}</h2>
            <div className="space-y-12">
              {portfolio.education.items.map((education) => (
                <div
                  id={`education-${slugify(education.school)}`}
                  key={education.school}
                  className="scroll-mt-24 border-l-2 border-gray-300 pl-8 space-y-2"
                >
                  <h3 className="text-2xl text-gray-900">{education.school}</h3>
                  <div className="text-gray-600">{education.degree}</div>
                  <div className="text-gray-400">{education.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="min-h-screen scroll-mt-24 flex items-center px-8">
        <div className="max-w-2xl w-full mx-auto text-center space-y-12">
          <h2 className="text-5xl text-gray-900">{portfolio.contact.title}</h2>
          <p className="text-xl text-gray-600">{portfolio.contact.message}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 text-left">
            <a
              href={`mailto:${portfolio.contact.email}`}
              className="block p-6 border border-gray-200 rounded-2xl hover:border-gray-900 transition-all hover:shadow-lg group"
            >
              <div className="text-sm text-gray-400 mb-2">Email</div>
              <div className="text-2xl text-gray-900 group-hover:text-gray-600">
                {portfolio.contact.email}
              </div>
            </a>

            <a
              href={phoneHref(portfolio.contact.phone)}
              className="block p-6 border border-gray-200 rounded-2xl hover:border-gray-900 transition-all hover:shadow-lg group"
            >
              <div className="text-sm text-gray-400 mb-2">Phone</div>
              <div className="text-2xl text-gray-900 group-hover:text-gray-600">
                {portfolio.contact.phone}
              </div>
            </a>

            <a
              href={portfolio.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 border border-gray-200 rounded-2xl hover:border-gray-900 transition-all hover:shadow-lg group"
            >
              <div className="text-sm text-gray-400 mb-2">LinkedIn</div>
              <div className="text-2xl text-gray-900 group-hover:text-gray-600">
                linkedin.com/in/ankur-sarda
              </div>
            </a>

            <a
              href={portfolio.contact.x}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 border border-gray-200 rounded-2xl hover:border-gray-900 transition-all hover:shadow-lg group"
            >
              <div className="text-sm text-gray-400 mb-2">X</div>
              <div className="text-2xl text-gray-900 group-hover:text-gray-600">
                x.com/ankursarda
              </div>
            </a>
          </div>

          <div className="pt-12">
            <p className="text-gray-400">{portfolio.contact.footer}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

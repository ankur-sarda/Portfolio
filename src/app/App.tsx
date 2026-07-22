import { useState, useEffect } from 'react';
import { portfolio } from '../content/portfolio';

const sections = [
  { id: 'intro', label: 'Intro' },
  { id: 'projects', label: 'Projects' },
  { id: 'publications', label: 'Publications' },
  { id: 'experience', label: 'Experience' },
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

export default function App() {
  const [activeSection, setActiveSection] = useState('intro');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
        <div className="space-y-6">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="group block"
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
          ))}
        </div>
      </nav>

      <section id="intro" className="min-h-screen flex items-center px-8">
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

      <section id="projects" className="min-h-screen py-32 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl mb-20 text-gray-900">{portfolio.projects.title}</h2>

          <div className="space-y-24">
            {portfolio.projects.items.map((project, index) => {
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
                    key={project.title}
                    className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.7fr)] gap-10 border-l-2 border-gray-200 pl-8"
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
                  key={project.title}
                  className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.7fr)] gap-10 border-l-2 border-gray-200 pl-8"
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

      <section id="publications" className="py-32 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl mb-20 text-gray-900">{portfolio.publications.title}</h2>
          <div className="space-y-12">
            {portfolio.publications.items.map((publication) => (
              <a
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

      <section id="experience" className="min-h-screen py-32 px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl mb-20 text-gray-900">{portfolio.experience.title}</h2>

          <div className="space-y-16">
            {portfolio.experience.items.map((experience) => (
              <div key={experience.company} className="border-l-2 border-gray-300 pl-8 space-y-4">
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

          <div className="mt-32">
            <h2 className="text-5xl mb-20 text-gray-900">{portfolio.education.title}</h2>
            <div className="space-y-12">
              {portfolio.education.items.map((education) => (
                <div key={education.school} className="border-l-2 border-gray-300 pl-8 space-y-2">
                  <h3 className="text-2xl text-gray-900">{education.school}</h3>
                  <div className="text-gray-600">{education.degree}</div>
                  <div className="text-gray-400">{education.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="min-h-screen flex items-center px-8">
        <div className="max-w-2xl w-full mx-auto text-center space-y-12">
          <h2 className="text-5xl text-gray-900">{portfolio.contact.title}</h2>
          <p className="text-xl text-gray-600">{portfolio.contact.message}</p>

          <div className="space-y-6 pt-8">
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
          </div>

          <div className="pt-12">
            <p className="text-gray-400">{portfolio.contact.footer}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

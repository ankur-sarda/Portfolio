import introMarkdown from '../../content/intro.md?raw';
import projectsMarkdown from '../../content/projects.md?raw';
import publicationsMarkdown from '../../content/publications.md?raw';
import experienceMarkdown from '../../content/experience.md?raw';
import educationMarkdown from '../../content/education.md?raw';
import contactMarkdown from '../../content/contact.md?raw';

type MarkdownEntry = {
  title: string;
  fields: Record<string, string>;
  paragraphs: string[];
  lists: Record<string, string[]>;
};

type Project = {
  title: string;
  organization: string;
  dates: string;
  icon: string;
  gradient: string;
  url: string;
  urlLabel: string;
  blogUrl: string;
  image: string;
  imageAlt: string;
  imageFit: string;
  description: string;
  tags: string[];
  highlights: string[];
  links: string[];
};

type Publication = {
  title: string;
  source: string;
  year: string;
  url: string;
  authors: string;
};

type Experience = {
  company: string;
  role: string;
  dates: string;
  description: string;
  tags: string[];
};

type Education = {
  school: string;
  degree: string;
  detail: string;
};

const parseMarkdown = (markdown: string) => {
  const lines = markdown.split(/\r?\n/);
  const title = lines.find((line) => line.startsWith('# '))?.replace('# ', '').trim() ?? '';
  const entries: MarkdownEntry[] = [];
  let current: MarkdownEntry | null = null;
  let currentList = '';

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('# ')) {
      currentList = '';
      continue;
    }

    if (trimmed.startsWith('## ')) {
      current = {
        title: trimmed.replace('## ', '').trim(),
        fields: {},
        paragraphs: [],
        lists: {},
      };
      entries.push(current);
      currentList = '';
      continue;
    }

    const target = current ?? {
      title,
      fields: {},
      paragraphs: [],
      lists: {},
    };

    if (!current) {
      current = target;
      entries.push(current);
    }

    if (trimmed.endsWith(':') && !trimmed.includes(' ')) {
      currentList = trimmed.slice(0, -1);
      target.lists[currentList] = [];
      continue;
    }

    if (trimmed.startsWith('- ') && currentList) {
      target.lists[currentList].push(trimmed.slice(2));
      continue;
    }

    const field = trimmed.match(/^([^:]+):\s*(.+)$/);
    if (field) {
      target.fields[field[1]] = field[2];
      currentList = '';
      continue;
    }

    target.paragraphs.push(trimmed);
    currentList = '';
  }

  return { title, entries };
};

const firstEntry = (markdown: string) => parseMarkdown(markdown).entries[0];

const projectData = parseMarkdown(projectsMarkdown);
const publicationData = parseMarkdown(publicationsMarkdown);
const experienceData = parseMarkdown(experienceMarkdown);
const educationData = parseMarkdown(educationMarkdown);
const introData = parseMarkdown(introMarkdown);
const contactData = firstEntry(contactMarkdown);

export const portfolio = {
  intro: {
    name: introData.title,
    paragraphs: introData.entries[0]?.paragraphs ?? [],
  },
  projects: {
    title: projectData.title,
    items: projectData.entries.map<Project>((entry) => ({
      title: entry.title,
      organization: entry.fields.Organization,
      dates: entry.fields.Dates,
      icon: entry.fields.Icon,
      gradient: entry.fields.Gradient,
      url: entry.fields.URL ?? '',
      urlLabel: entry.fields.URLLabel ?? 'View project',
      blogUrl: entry.fields.BlogURL ?? '',
      image: entry.fields.Image ?? '',
      imageAlt: entry.fields.ImageAlt ?? entry.title,
      imageFit: entry.fields.ImageFit ?? 'cover',
      description: entry.paragraphs.join(' '),
      tags: entry.lists.Tags ?? [],
      highlights: entry.lists.Highlights ?? [],
      links: entry.lists.Links ?? [],
    })),
  },
  publications: {
    title: publicationData.title,
    items: publicationData.entries.map<Publication>((entry) => ({
      title: entry.title,
      source: entry.fields.Source,
      year: entry.fields.Year,
      url: entry.fields.URL,
      authors: entry.fields.Authors,
    })),
  },
  experience: {
    title: experienceData.title,
    items: experienceData.entries.map<Experience>((entry) => ({
      company: entry.title,
      role: entry.fields.Role,
      dates: entry.fields.Dates,
      description: entry.paragraphs.join(' '),
      tags: entry.lists.Tags ?? [],
    })),
  },
  education: {
    title: educationData.title,
    items: educationData.entries.map<Education>((entry) => ({
      school: entry.title,
      degree: entry.fields.Degree,
      detail: entry.fields.Detail,
    })),
  },
  contact: {
    title: contactData?.title ?? '',
    message: contactData?.paragraphs.join(' ') ?? '',
    email: contactData?.fields.Email ?? '',
    phone: contactData?.fields.Phone ?? '',
    linkedin: contactData?.fields.LinkedIn ?? '',
    x: contactData?.fields.X ?? '',
    footer: contactData?.fields.Footer ?? '',
  },
};

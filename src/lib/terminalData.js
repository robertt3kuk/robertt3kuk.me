export const personalInfo = {
  name: 'Bekbolat Abaildayev',
  username: 'robertt3kuk',
  title: 'Software Engineer',
  email: 'awesome.abaildaev@yandex.kz',
  phone: '+77073137691',
  linkedin: 'https://linkedin.com/in/robertt3kuk',
  github: 'https://github.com/robertt3kuk',
  telegram: 'https://t.me/biqontie',
  location: 'Kazakhstan',
  summary: 'Skilled Go software engineer with expertise in MongoDB and PostgreSQL databases. Experienced in GraphQL, REST API, and gRPC technologies. Passionate about Linux (Unix) operating systems with strong DevOps skills.',
  skills: {
    languages: ['Go', 'JavaScript', 'Python', 'SQL'],
    databases: ['MongoDB', 'PostgreSQL', 'Redis'],
    technologies: ['gRPC', 'REST API', 'GraphQL', 'Docker', 'Kubernetes'],
    cloud: ['AWS', 'Google Cloud', 'DigitalOcean'],
    tools: ['Git', 'Linux', 'Caddy', 'Nginx', 'GrafanaLoki', 'MinIO']
  },
  experience: [
    {
      company: 'Gexabyte',
      position: 'Golang Backend Developer',
      period: 'August 2024 - Present',
      highlights: [
        'Built backend system using Ethereum Go library, integrating smart contracts',
        'Tested smart contracts on Sepolia network',
        'Utilized IPFS via Pinata for decentralized file storage',
        'Managed PostgreSQL database for secure data storage',
        'Used MinIO for off-chain storage of images'
      ]
    },
    {
      company: 'Union Strategies',
      position: 'Golang Backend Developer',
      period: 'Feb 2023 - July 2024',
      highlights: [
        'Developed and maintained backend for union\'s system',
        'Monitored system performance and implemented improvements',
        'Designed and implemented new services',
        'Stayed updated with Go programming language trends'
      ]
    },
    {
      company: 'mvp14',
      position: 'Golang Backend Developer',
      period: 'Feb 2023 - Jun 2023',
      highlights: [
        'Developed CRM system for construction workers using Golang, PostgreSQL, and S3',
        'Implemented user management, task tracking, and QR code verification'
      ]
    },
    {
      company: 'BilimX',
      position: 'Golang Backend Developer',
      period: 'Nov 2022 - Feb 2023',
      highlights: [
        'Created edtech platform for schools using Golang and PostgreSQL',
        'Implemented secure session management and licensing system'
      ]
    },
    {
      company: 'WeLoveFlutterFlow',
      position: 'Golang Backend Developer',
      period: 'Jun 2021 - Oct 2022',
      highlights: [
        'Built CRM platform using Golang & PostgreSQL',
        'Developed RESTful API and role-based visibility features',
        'Created efficient project management and collaboration solution'
      ]
    }
  ],
  projects: [
    {
      name: 'Distributed Task Queue',
      description: 'High-performance distributed task queue system built with Go',
      tech: ['Go', 'Redis', 'gRPC', 'Docker'],
      url: 'https://github.com/robertt3kuk/task-queue'
    },
    {
      name: 'Microservices Boilerplate',
      description: 'Production-ready microservices template with Go',
      tech: ['Go', 'Kubernetes', 'Prometheus', 'Jaeger'],
      url: 'https://github.com/robertt3kuk/go-microservices'
    },
    {
      name: 'Real-time Chat System',
      description: 'Scalable real-time chat application with WebSocket',
      tech: ['Go', 'WebSocket', 'MongoDB', 'React'],
      url: 'https://github.com/robertt3kuk/chat-system'
    }
  ]
};

export const commands = {
  help: {
    description: 'Show available commands',
    execute: () => {
      return [
        'Available commands:',
        '',
        '  help           - Show this help message',
        '  about          - Display personal information',
        '  skills         - List technical skills',
        '  experience     - Show work experience',
        '  projects       - Display GitHub projects',
        '  contact        - Show contact information',
        '  download       - Download CV as PDF',
        '  clear          - Clear terminal',
        '  theme [light/dark] - Change terminal theme',
        '  ls             - List available sections',
        '  cat [section]  - Display section content',
        '  whoami         - Display current user',
        '  date           - Show current date and time',
        '  echo [text]    - Echo text back',
        '  neofetch       - Display system information',
        '',
        'Pro tip: Use arrow keys to navigate command history'
      ];
    }
  },
  
  about: {
    description: 'Display personal information',
    execute: () => {
      return [
        `Name: ${personalInfo.name} (@${personalInfo.username})`,
        `Title: ${personalInfo.title}`,
        `Location: ${personalInfo.location}`,
        '',
        'Summary:',
        personalInfo.summary,
        '',
        'Type "skills" to see technical skills or "experience" for work history.'
      ];
    }
  },
  
  skills: {
    description: 'List technical skills',
    execute: () => {
      const skillsOutput = ['Technical Skills:', ''];
      Object.entries(personalInfo.skills).forEach(([category, items]) => {
        skillsOutput.push(`${category.charAt(0).toUpperCase() + category.slice(1)}:`);
        skillsOutput.push(`  ${items.join(', ')}`);
        skillsOutput.push('');
      });
      return skillsOutput;
    }
  },
  
  experience: {
    description: 'Show work experience',
    execute: () => {
      const expOutput = ['Work Experience:', ''];
      personalInfo.experience.forEach(job => {
        expOutput.push(`${job.company} | ${job.position}`);
        expOutput.push(`${job.period}`);
        job.highlights.forEach(highlight => {
          expOutput.push(`  • ${highlight}`);
        });
        expOutput.push('');
      });
      return expOutput;
    }
  },
  
  projects: {
    description: 'Display GitHub projects',
    execute: () => {
      const projOutput = ['GitHub Projects:', ''];
      personalInfo.projects.forEach(project => {
        projOutput.push(`📁 ${project.name}`);
        projOutput.push(`   ${project.description}`);
        projOutput.push(`   Tech: ${project.tech.join(', ')}`);
        projOutput.push(`   URL: ${project.url}`);
        projOutput.push('');
      });
      return projOutput;
    }
  },
  
  contact: {
    description: 'Show contact information',
    execute: () => {
      return [
        'Contact Information:',
        '',
        `📧 Email: ${personalInfo.email}`,
        `📱 Phone: ${personalInfo.phone}`,
        `💼 LinkedIn: ${personalInfo.linkedin}`,
        `🐙 GitHub: ${personalInfo.github}`,
        `💬 Telegram: ${personalInfo.telegram}`,
        '',
        'Feel free to reach out for opportunities or collaborations!'
      ];
    }
  },
  
  download: {
    description: 'Download CV as PDF',
    execute: () => {
      const link = document.createElement('a');
      link.href = '/BekbolatAbaildayev_CV.pdf';
      link.download = 'BekbolatAbaildayev_CV.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return ['Downloading CV...', 'File: BekbolatAbaildayev_CV.pdf'];
    }
  },
  
  clear: {
    description: 'Clear terminal',
    execute: (args, { setHistory }) => {
      setHistory([]);
      return null;
    }
  },
  
  theme: {
    description: 'Change terminal theme',
    execute: (args) => {
      const theme = args[0];
      if (!theme || !['light', 'dark'].includes(theme)) {
        return ['Usage: theme [light|dark]'];
      }
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('terminal-theme', theme);
      return [`Theme changed to ${theme} mode`];
    }
  },
  
  ls: {
    description: 'List available sections',
    execute: () => {
      return [
        'drwxr-xr-x  2 robertt3kuk  staff   64B  about/',
        'drwxr-xr-x  2 robertt3kuk  staff   64B  skills/',
        'drwxr-xr-x  2 robertt3kuk  staff   64B  experience/',
        'drwxr-xr-x  2 robertt3kuk  staff   64B  projects/',
        'drwxr-xr-x  2 robertt3kuk  staff   64B  contact/',
        '-rw-r--r--  1 robertt3kuk  staff  2.1M  BekbolatAbaildayev_CV.pdf',
        '',
        'Use "cat [section]" to view section content'
      ];
    }
  },
  
  cat: {
    description: 'Display section content',
    execute: (args) => {
      const section = args[0];
      if (!section) {
        return ['Usage: cat [section]', 'Available sections: about, skills, experience, projects, contact'];
      }
      
      const sectionCommands = {
        about: commands.about,
        skills: commands.skills,
        experience: commands.experience,
        projects: commands.projects,
        contact: commands.contact
      };
      
      if (sectionCommands[section]) {
        return sectionCommands[section].execute();
      }
      
      return [`cat: ${section}: No such file or directory`];
    }
  },
  
  whoami: {
    description: 'Display current user',
    execute: () => [`guest@robertt3kuk.me`]
  },
  
  date: {
    description: 'Show current date and time',
    execute: () => [new Date().toString()]
  },
  
  echo: {
    description: 'Echo text back',
    execute: (args) => [args.join(' ')]
  },
  
  neofetch: {
    description: 'Display system information',
    execute: () => {
      const asciiArt = [
        '       _._     ',
        '    .\'   `.    robertt3kuk@portfolio',
        '   /  .-.  \\   ---------------------',
        '  |  /   \\  |  OS: Terminal OS v1.0.0',
        '  | |\\_.  /| |  Host: robertt3kuk.me',
        '  |\\|  | /|/|  Kernel: 5.15.0-terminal',
        '  |  `---\'  |  Uptime: since 2021',
        '  |         |  Shell: portfolio-sh',
        '  |         |  Terminal: Web Terminal',
        '  |         |  CPU: Go @ 3.2GHz',
        '  |         |  Memory: ∞',
        '  |         |  ',
        '  `---------\'  '
      ];
      return asciiArt;
    }
  }
};

// Load theme from localStorage
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('terminal-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
}
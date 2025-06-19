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
  summary: 'Accomplished Go backend developer with over four years of experience in designing and implementing scalable systems. Proficient in MongoDB, PostgreSQL, and Kubernetes, with expertise in microservices architecture and API development using gRPC and GraphQL. Experienced in building secure internal banking systems with governmental integrations. Skilled in DevOps practices, including containerization, CI/CD pipelines, and system monitoring with tools like Grafana Loki. Passionate about writing clean, maintainable code and automating development workflows.',
  skills: {
    languages: ['Go', 'JavaScript'],
    databases: ['MongoDB', 'PostgreSQL'],
    technologies: ['gRPC', 'GraphQL', 'Docker', 'Kubernetes', 'CI/CD', 'IPFS', 'Ethereum Go library'],
    cloud: ['AWS', 'GCP', 'AZURE', 'Yandex Cloud'],
    tools: ['Grafana Loki', 'MinIO', 'Code Generation Tooling', 'Linux', 'DevOps']
  },
  experience: [
    {
      company: 'Gexabyte',
      position: 'Golang Backend Developer',
      period: 'August 2024 - Present',
      highlights: [
        'Developed blockchain-based backend using Ethereum Go library, integrating smart contracts on Sepolia network',
        'Implemented decentralized image storage with IPFS via Pinata and off-chain storage with MinIO',
        'Optimized PostgreSQL database for secure and efficient data management',
        'Collaborated with product teams to deliver scalable technical solutions'
      ],
      subProjects: [
        {
          name: 'Zaman-Bank project (via RedMadRobot)',
          period: 'November 2024 - Present',
          teams: [
            {
              name: 'Retail Platform Team',
              period: 'November 2024 - December 2024',
              highlights: [
                'Contributed to core library of internal banking system with multiple governmental integrations',
                'Developed microservices to support banking operations and ensure system scalability',
                'Implemented log monitoring in Kubernetes to enhance system observability',
                'Designed secret error case handling with numerical error identification for precise debugging'
              ]
            },
            {
              name: 'SME Platform Team',
              period: 'January 2025 - Present',
              highlights: [
                'Created bridge service to facilitate governmental integrations for internal banking system',
                'Enhanced core library with reusable components for SME banking operations',
                'Developed code generation tooling using templates to automate boilerplate code creation',
                'Streamlined internal code management and development workflows'
              ]
            }
          ]
        }
      ]
    },
    {
      company: 'Union Strategies',
      position: 'Golang Backend Developer',
      period: 'February 2023 - July 2024',
      location: 'Toronto',
      highlights: [
        'Developed microservices for union management system using Go, PostgreSQL, and gRPC',
        'Enhanced system observability with Grafana Loki for improved monitoring',
        'Collaborated with product teams to implement feature enhancements and optimize performance'
      ]
    },
    {
      company: 'mvp14',
      position: 'Golang Backend Developer',
      period: 'February 2023 - June 2023',
      location: 'Astana',
      highlights: [
        'Developed CRM system for construction workers using Golang, PostgreSQL, and GraphQL',
        'Implemented user management, task management, and QR code scanning functionality',
        'Enabled workers to scan QR codes for task location verification and capture completion proof',
        'Implemented subtask management for complex tasks and employee performance monitoring'
      ]
    },
    {
      company: 'BilimX',
      position: 'Golang Backend Developer',
      period: 'November 2022 - February 2023',
      location: 'Pavlodar',
      highlights: [
        'Created edtech platform for schools using Golang and PostgreSQL',
        'Provided accessible 3D models, study plans, and detailed descriptions for subjects like anatomy and physics',
        'Implemented secure session management, allowing only one session per user within school territory',
        'Developed licensing system to prevent unauthorized access'
      ]
    },
    {
      company: 'WeLoveFlutterFlow',
      position: 'Golang Backend Developer',
      period: 'June 2021 - October 2022',
      location: 'Astana',
      highlights: [
        'Built CRM platform using Golang and PostgreSQL',
        'Developed RESTful API, task tracking, and role-based visibility features',
        'Managed access for developers, managers, and DevOps engineers',
        'Implemented customizable layers for task and project visibility',
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
        '  message        - Send a message to me',
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
        expOutput.push(`${job.company}${job.location ? ', ' + job.location : ''} | ${job.position}`);
        expOutput.push(`${job.period}`);
        job.highlights.forEach(highlight => {
          expOutput.push(`  • ${highlight}`);
        });
        
        if (job.subProjects) {
          job.subProjects.forEach(project => {
            expOutput.push('');
            expOutput.push(`  ${project.name} (${project.period}):`);
            project.teams.forEach(team => {
              expOutput.push(`    ${team.name} (${team.period}):`);
              team.highlights.forEach(highlight => {
                expOutput.push(`      • ${highlight}`);
              });
            });
          });
        }
        
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
    execute: (args, { theme, setTheme }) => {
      const newTheme = args[0];
      if (!newTheme || !['light', 'dark'].includes(newTheme)) {
        return ['Usage: theme [light|dark]'];
      }
      setTheme(newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('terminal-theme', newTheme);
      return [`Theme changed to ${newTheme} mode`];
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
  },
  
  message: {
    description: 'Send a message to me',
    execute: async (args) => {
      if (args.length === 0) {
        return [
          'Usage: message [your message here]',
          '',
          'Example: message Hello, I would like to discuss a project opportunity',
          '',
          'For multi-line messages, just type everything in one line.'
        ];
      }
      
      const message = args.join(' ');
      
      if (message.trim().length < 10) {
        return ['Error: Please provide a more detailed message (at least 10 characters)'];
      }
      
      const timestamp = new Date().toISOString();
      
      try {
        const formData = new FormData();
        formData.append('message', message);
        formData.append('timestamp', timestamp);
        formData.append('_subject', 'New message from portfolio terminal');
        
        const response = await fetch('https://formsubmit.co/ajax/awesome.abaildaev@yandex.kz', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });
        
        if (response.ok) {
          return [
            '✅ Message sent successfully!',
            '',
            'Thank you for reaching out. I\'ll get back to you soon via:',
            `📧 Email: ${personalInfo.email}`,
            `💬 Telegram: ${personalInfo.telegram}`,
            '',
            'For urgent matters, feel free to contact me directly.'
          ];
        } else {
          throw new Error('Failed to send message');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        return [
          '❌ Failed to send message.',
          '',
          'Please try contacting me directly:',
          `📧 Email: ${personalInfo.email}`,
          `💬 Telegram: ${personalInfo.telegram}`,
          '',
          'Or try the message command again later.'
        ];
      }
    }
  }
};
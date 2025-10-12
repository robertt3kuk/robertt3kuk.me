export const personalInfo = {
  name: 'Bekbolat Abaildayev',
  username: 'robertt3kuk',
  title: 'Senior Go Backend Developer',
  email: 'awesome.abaildaev@yandex.kz',
  phone: '+7 707 313 7691',
  linkedin: 'https://linkedin.com/in/robertt3kuk',
  github: 'https://github.com/robertt3kuk',
  telegram: 'https://t.me/biqontie',
  location: 'Almaty, Kazakhstan',
  summary: 'Senior Go Backend Developer with over 4 years of experience building scalable microservices and distributed systems. Specialized in high-performance backend development, cloud architecture, and DevOps practices. Proven track record in fintech, edtech, and enterprise applications.',
  skills: {
    languages: ['Go', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'gRPC', 'GraphQL', 'Gitlab CI/CD', 'AWS', 'RabbitMQ', 'Kafka', 'Elastic Stack', 'Jaeger', 'Prometheus', 'Grafana', 'Loki', 'Github', 'Jira', 'Linux'],
    expertise: ['Microservice architecture', 'Distributed systems', 'Cloud platforms', 'DevOps & CI/CD', 'API design', 'Database optimization', 'System monitoring', 'Code generation', 'Clean code']
  },
  experience: [
    {
      company: 'Gexabyte',
      position: 'Senior Go Backend Developer',
      period: 'Aug 2024 - Present',
      location: 'Almaty, Kazakhstan',
      highlights: [
        'Developing blockchain-based backend solutions using Ethereum Go library',
        'Implementing decentralized storage with IPFS and MinIO',
        'Leading core library development for Zaman Bank project',
        'Building code generation tools for automated development',
        'Designing bridge services for governmental integrations'
      ],
      projects: [
        {
          name: 'Zaman Bank Internal System',
          role: 'Core Library Developer',
          period: 'Nov 2024 - Present',
          achievements: [
            'Contributed to core library for internal banking system',
            'Developed 15+ microservices supporting banking operations',
            'Implemented log monitoring with Kubernetes and Grafana Loki',
            'Designed error handling system with numerical codes'
          ]
        },
        {
          name: 'Blockchain Platform',
          role: 'Backend Developer',
          achievements: [
            'Integrated smart contracts on Sepolia testnet',
            'Built decentralized image storage system',
            'Optimized PostgreSQL for blockchain data',
            'Collaborated with product teams for technical delivery'
          ]
        }
      ]
    },
    {
      company: 'Union Strategies',
      position: 'Middle Go Backend Developer',
      period: 'Feb 2023 - Jul 2024',
      location: 'Toronto, Canada',
      highlights: [
        'Developed microservices for union management system',
        'Enhanced system observability with Grafana Loki',
        'Built RESTful and gRPC APIs',
        'Implemented real-time monitoring and alerting'
      ]
    },
    {
      company: 'mvp14',
      position: 'Middle Go Backend Developer',
      period: 'Feb 2023 - Jun 2023',
      location: 'Astana, Kazakhstan',
      highlights: [
        'Built CRM system for construction industry',
        'Implemented QR code scanning for task verification',
        'Created GraphQL API for mobile applications',
        'Managed PostgreSQL database optimization'
      ]
    },
    {
      company: 'BilimX',
      position: 'Middle Go Backend Developer',
      period: 'Nov 2022 - Feb 2023',
      location: 'Pavlodar, Kazakhstan',
      highlights: [
        'Developed edtech platform for schools',
        'Implemented secure session management',
        'Created 3D model delivery system',
        'Built licensing system for access control'
      ]
    },
    {
      company: 'WeLoveFlutterFlow',
      position: 'Junior Go Backend Developer',
      period: 'Jun 2021 - Oct 2022',
      location: 'Astana, Kazakhstan',
      highlights: [
        'Built CRM platform for development teams',
        'Developed RESTful API with role-based access',
        'Implemented task tracking and project management',
        'Created customizable visibility layers'
      ]
    }
  ],
  projects: [
    {
      name: 'Core Banking System',
      description: 'Internal banking system with governmental integrations and microservices architecture',
      tech: ['Go', 'PostgreSQL', 'gRPC', 'Kubernetes', 'Grafana Loki'],
      achievements: ['Core library development', '15+ microservices', 'Real-time monitoring', 'Error handling system'],
      url: 'https://github.com/robertt3kuk'
    },
    {
      name: 'Blockchain Platform',
      description: 'Decentralized platform with smart contracts and IPFS storage integration',
      tech: ['Go', 'Ethereum', 'IPFS', 'MinIO', 'Docker'],
      achievements: ['Smart contract integration', 'Decentralized storage', 'Sepolia testnet deployment'],
      url: 'https://github.com/robertt3kuk'
    },
    {
      name: 'Code Generation Tools',
      description: 'Template-based code generation system for automated development workflows',
      tech: ['Go', 'Templates', 'Automation', 'CLI'],
      achievements: ['Boilerplate reduction', 'Template system', 'Development workflow automation'],
      url: 'https://github.com/robertt3kuk'
    },
    {
      name: 'EdTech Platform',
      description: 'Educational platform with 3D models, licensing, and session management',
      tech: ['Go', 'PostgreSQL', 'GraphQL', 'QR Code'],
      achievements: ['3D content delivery', 'Secure licensing', 'Mobile app backend'],
      url: 'https://github.com/robertt3kuk'
    },
    {
      name: 'Construction CRM',
      description: 'CRM system for construction industry with task tracking and QR verification',
      tech: ['Go', 'MongoDB', 'GraphQL', 'QR Code'],
      achievements: ['Task management', 'QR verification', 'Performance monitoring'],
      url: 'https://github.com/robertt3kuk'
    }
  ],
};

export const commands = {
  help: {
    description: 'Show available commands',
    execute: () => {
      return [
        'Available commands:',
        '',
        'Personal:',
        '  about          - Display personal information',
        '  skills         - List technical skills',
        '  experience     - Show work experience',
        '  projects       - Display GitHub projects',
        '  contact        - Show contact information',
        '',
        'Actions:',
        '  download       - Download CV as PDF',
        '  message        - Send me a message',
        '',
        'System:',
        '  help           - Show this help message',
        '  clear          - Clear terminal (Ctrl+L)',
        '  theme [mode]   - Change theme (light/dark)',
        '  ls             - List available sections',
        '  cat [section]  - Display section content',
        '',
        'Shortcuts:',
        '  Tab            - Auto-complete commands',
        '  ↑/↓            - Navigate command history',
        '  Ctrl+L         - Clear screen'
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
        'about/',
        'skills/',
        'experience/',
        'projects/',
        'contact/',
        'BekbolatAbaildayev_CV.pdf',
        '',
        'Use "cat [section]" to view content'
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
        '     ___    robertt3kuk@portfolio',
        '    (.· |   ------------------',
        '    (<> |   OS: Terminal v2.0',
        '   / __  \\  Host: robertt3kuk.me',
        '  ( /  \\ /| Shell: portfolio-sh',
        ' _/\\ __)/_) Uptime: since 2021',
        ' \\|-)_)_)   Languages: Go, JS',
        '             Status: Available'
      ];
      return asciiArt;
    }
  },
  
  nav: {
    description: 'Navigate between sections',
    execute: () => {
      return [
        '╭─────────────────────────────────────────────────────────╮',
        '│                Navigation Menu                          │',
        '╰─────────────────────────────────────────────────────────╯',
        '',
        '🧭 Quick Navigation:',
        '',
        'Use these commands to explore:',
        '',
        '1️⃣  about     → Personal information & summary',
        '2️⃣  skills    → Technical skills & expertise',
        '3️⃣  experience→ Work history & achievements',
        '4️⃣  projects  → Featured projects portfolio',
        '5️⃣  contact   → Contact details & availability',
        '',
        '🎯 Recommended Path:',
        '  about → skills → experience → projects → contact',
        '',
        '💡 Pro tip: Click the section buttons for instant navigation!',
        '💡 Use Tab to auto-complete commands',
        '💡 Use ↑/↓ arrows for command history'
      ];
    }
  },
  
  message: {
    description: 'Send a message to me',
    execute: async (args) => {
      if (args.length === 0) {
        return [
          '╭─────────────────────────────────────────────────────────╮',
          '│                 Send Message                            │',
          '╰─────────────────────────────────────────────────────────╯',
          '',
          '📝 Usage: message [your message here]',
          '',
          '💬 Example: message Hello, I would like to discuss a project opportunity',
          '',
          '✨ Tips for effective messages:',
          '  • Be specific about your inquiry',
          '  • Include relevant details about the opportunity',
          '  • Mention your preferred contact method',
          '',
          '📧 I\'ll respond via email or Telegram within 24 hours'
        ];
      }
      
      const message = args.join(' ');
      
      if (message.trim().length < 10) {
        return [
          '❌ Error: Please provide a more detailed message (at least 10 characters)',
          '',
          '💡 Tip: Include specific details about your inquiry or opportunity'
        ];
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
            '🎉 Thank you for reaching out! I\'ll get back to you soon via:',
            '',
            `📧 Email: ${personalInfo.email}`,
            `💬 Telegram: ${personalInfo.telegram}`,
            '',
            '📞 For urgent matters, feel free to contact me directly:',
            `    Phone: ${personalInfo.phone}`,
            '',
            '📍 Current availability: Open to opportunities'
          ];
        } else {
          throw new Error('Failed to send message');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        return [
          '❌ Failed to send message.',
          '',
          '🔧 Technical issue detected. Please try one of these alternatives:',
          '',
          `📧 Direct Email: ${personalInfo.email}`,
          `💬 Telegram: ${personalInfo.telegram}`,
          `📞 Phone: ${personalInfo.phone}`,
          '',
          '💡 You can also try the message command again later',
          '   The form service might be temporarily unavailable'
        ];
      }
    }
  }
};
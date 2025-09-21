we have to make a node backend which will take the username as the input and return the all details about the all the repositories of that user in json format. 

format : 


[
  {
    "id": 101,
    "name": "task-manager",
    "full_name": "username/task-manager",
    "visibility": "public",
    "is_private": false,

    "description": "A task management web app with real-time collaboration.",
    "long_description": "This project is a MERN stack application that allows users to create, assign, and track tasks with real-time updates using WebSockets. Implemented JWT authentication, role-based permissions, and Dockerized deployment. Deployed on Vercel + Render.",

    "topics": ["mern", "websockets", "docker", "collaboration"],
    "tags": ["Web App", "Real-time", "Portfolio"],

    "tech_stack": {
      "frontend": ["React", "TailwindCSS", "Socket.IO"],
      "backend": ["Node.js", "Express.js"],
      "database": ["MongoDB"],
      "tools": ["Docker", "GitHub Actions", "Figma"]
    },

    "languages": {
      "JavaScript": 75,
      "CSS": 15,
      "HTML": 10
    },

    "media": {
      "screenshots": [
        "https://raw.githubusercontent.com/username/task-manager/main/screenshots/snap1.png",
        "https://raw.githubusercontent.com/username/task-manager/main/screenshots/snap2.png",
        "https://raw.githubusercontent.com/username/task-manager/main/screenshots/snap3.png"
      ],
      "video_demo": {
        "platform": "YouTube",
        "url": "https://youtu.be/demo12345",
        "embed": "https://www.youtube.com/embed/demo12345"
      }
    },

    "links": {
      "repo_url": "https://github.com/username/task-manager",
      "homepage": "https://taskmanager.vercel.app",
      "live_demo": "https://demo.taskmanager.com",
      "docs": "https://docs.taskmanager.com"
    },

    "stats": {
      "stars": 35,
      "forks": 5,
      "watchers": 10,
      "open_issues": 3,
      "last_updated": "2025-09-20T12:34:56Z",
      "created_at": "2024-02-15T10:00:00Z"
    },

    "owner": {
      "username": "username",
      "profile_url": "https://github.com/username",
      "avatar": "https://avatars.githubusercontent.com/u/987654321?v=4"
    },

    "portfolio_flags": {
      "featured": true,
      "priority": 1,
      "show_in_portfolio": true,
      "highlight_color": "#2563EB" 
    }
  },
  {
    "id": 202,
    "name": "client-dashboard",
    "full_name": "username/client-dashboard",
    "visibility": "private",
    "is_private": true,

    "description": "Internal client dashboard tool (private repo).",
    "long_description": "A private project built for freelance clients to track sales, invoices, and workflows. Built with Next.js and PostgreSQL. Includes secure authentication, charts with Recharts, and AWS S3 storage for file management.",

    "topics": ["nextjs", "postgresql", "aws", "dashboard"],
    "tags": ["Dashboard", "Freelance", "Private"],

    "tech_stack": {
      "frontend": ["Next.js", "Chakra UI"],
      "backend": ["NestJS", "Node.js"],
      "database": ["PostgreSQL"],
      "tools": ["AWS S3", "Docker"]
    },

    "languages": {
      "TypeScript": 80,
      "SQL": 15,
      "Other": 5
    },

    "media": {
      "screenshots": [
        "https://example.com/screenshots/client-dashboard-1.png",
        "https://example.com/screenshots/client-dashboard-2.png"
      ],
      "video_demo": null
    },

    "links": {
      "repo_url": "https://github.com/username/client-dashboard",
      "homepage": null,
      "live_demo": null,
      "docs": null
    },

    "stats": {
      "stars": 0,
      "forks": 0,
      "watchers": 0,
      "open_issues": 0,
      "last_updated": "2025-08-12T15:45:00Z",
      "created_at": "2024-05-01T08:00:00Z"
    },

    "owner": {
      "username": "username",
      "profile_url": "https://github.com/username",
      "avatar": "https://avatars.githubusercontent.com/u/987654321?v=4"
    },

    "portfolio_flags": {
      "featured": false,
      "priority": 3,
      "show_in_portfolio": false,
      "highlight_color": "#6B7280"
    }
  }
]

and will store this data in a separate json file in the root folder and the script will return all the private and public repositories of that user in the above mentioned format. 

for now we will add the token from my github account to access the private repositories in the env. 
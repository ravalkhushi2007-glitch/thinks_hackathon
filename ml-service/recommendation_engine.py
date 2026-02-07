import numpy as np

# Domain-specific skill sets and weights
# Each skill has a weight (impact on placement probability)
DOMAIN_SKILLS = {
    "Web Development": {
        "react": 0.9,
        "node.js": 0.85,
        "javascript": 0.9,
        "html/css": 0.7,
        "sql": 0.6,
        "tailwind": 0.5,
        "typescript": 0.75
    },
    "Full Stack Development": {
        "react/next.js": 0.9,
        "node/express": 0.85,
        "mongodb/postgresql": 0.8,
        "docker": 0.7,
        "graphql": 0.6,
        "system design": 0.85,
        "testing (jest)": 0.65
    },
    "AI/ML": {
        "python": 0.95,
        "machine learning": 0.9,
        "statistics": 0.8,
        "pytorch/tensorflow": 0.85,
        "data analysis": 0.7,
        "deep learning": 0.8,
        "scikit-learn": 0.75
    },
    "Cyber Security": {
        "networking": 0.9,
        "linux": 0.85,
        "cryptography": 0.8,
        "penetration testing": 0.9,
        "security audits": 0.7,
        "wireshark": 0.6,
        "metasploit": 0.75
    },
    "App Development": {
        "flutter/react native": 0.9,
        "dart/javascript": 0.8,
        "firebase": 0.7,
        "ui/ux design": 0.6,
        "swift/kotlin": 0.85,
        "mobile architecture": 0.75
    },
    "iOS Development": {
        "swift": 0.95,
        "swiftui": 0.9,
        "xcode": 0.85,
        "core data": 0.75,
        "ios architecture": 0.8,
        "testflight": 0.6
    },
    "Android Development": {
        "kotlin": 0.95,
        "android studio": 0.9,
        "jetpack compose": 0.85,
        "retrofit": 0.75,
        "mvvm architecture": 0.8,
        "google play services": 0.65
    },
    "Game Development": {
        "unity/unreal engine": 0.95,
        "c#/c++": 0.9,
        "computer graphics": 0.8,
        "game physics": 0.75,
        "3d modeling": 0.6,
        "animation": 0.65
    },
    "Cloud Computing": {
        "aws/azure/gcp": 0.95,
        "docker": 0.85,
        "kubernetes": 0.9,
        "cloud architecture": 0.8,
        "serverless": 0.7,
        "terraform": 0.75,
        "linux administration": 0.8
    },
    "Data Science": {
        "python/r": 0.9,
        "sql": 0.8,
        "data visualization": 0.75,
        "pandas/numpy": 0.85,
        "statistics": 0.8,
        "big data (hadoop/spark)": 0.8,
        "tableau/powerbi": 0.65
    },
    "Data Engineering": {
        "apache spark": 0.9,
        "etl pipelines": 0.9,
        "data warehousing": 0.85,
        "python/scala": 0.8,
        "airflow": 0.75,
        "snowflake/amazon redshift": 0.8
    },
    "DevOps": {
        "ci/cd": 0.9,
        "jenkins/github actions": 0.85,
        "infrastructure as code": 0.8,
        "monitoring (prometheus/grafana)": 0.75,
        "shell scripting": 0.7,
        "ansible/chef/puppet": 0.8,
        "cloud security": 0.8
    },
    "UI/UX Design": {
        "figma/adobe xd": 0.95,
        "user research": 0.85,
        "prototyping": 0.9,
        "visual design": 0.8,
        "wireframing": 0.75,
        "interaction design": 0.8,
        "case studies": 0.7
    },
    "Blockchain": {
        "solidity": 0.95,
        "ethereum": 0.9,
        "smart contracts": 0.9,
        "cryptography": 0.8,
        "dapps": 0.85,
        "web3.js": 0.75,
        "hyperledger": 0.7
    },
    "Embedded Systems/IoT": {
        "c/c++": 0.95,
        "microcontrollers": 0.9,
        "rtos": 0.85,
        "circuit design": 0.75,
        "embedded linux": 0.8,
        "mqtt/iot protocols": 0.7,
        "hardware debugging": 0.65
    },
    "Software Testing/QA": {
        "selenium/cypress": 0.95,
        "unit testing": 0.9,
        "automation testing": 0.9,
        "manual testing": 0.7,
        "bug tracking (jira)": 0.75,
        "load testing": 0.8,
        "api testing (postman)": 0.7
    },
    "AR/VR Development": {
        "unity/unreal": 0.95,
        "c#/c++": 0.9,
        "3d graphics": 0.85,
        "oculus/vive SDK": 0.9,
        "spatial computing": 0.8,
        "blender": 0.7
    },
    "Site Reliability Engineering (SRE)": {
        "system administration": 0.9,
        "incident response": 0.9,
        "automation": 0.85,
        "distributed systems": 0.8,
        "performance tuning": 0.8,
        "networking": 0.75
    },
    "General": {
        "python": 0.8,
        "java": 0.8,
        "sql": 0.7,
        "c++": 0.7,
        "data structures": 0.9,
        "algorithms": 0.9
    }
}

# Domain-specific hiring companies with career URLs
DOMAIN_COMPANIES = {
    "Web Development": [
        {"name": "Google", "avg_salary": "25-35 LPA", "skills": ["React/Angular", "Node.js", "System Design"], "url": "https://www.google.com/about/careers/applications/jobs/results/?q=Web%20Developer"},
        {"name": "Meta", "avg_salary": "30-45 LPA", "skills": ["React", "JavaScript", "GraphQL"], "url": "https://www.metacareers.com/jobs"},
        {"name": "Amazon", "avg_salary": "22-32 LPA", "skills": ["Java/C++", "React", "Cloud Basics"], "url": "https://www.amazon.jobs/en/job_categories/software-development"}
    ],
    "Full Stack Development": [
        {"name": "Uber", "avg_salary": "28-40 LPA", "skills": ["Node.js", "React", "Distributed Systems"], "url": "https://www.uber.com/us/en/careers/list/?u=Engineering"},
        {"name": "Zomato", "avg_salary": "18-28 LPA", "skills": ["Next.js", "Express", "MongoDB"], "url": "https://www.zomato.com/careers"},
        {"name": "Paytm", "avg_salary": "15-25 LPA", "skills": ["MERN/MEAN Stack", "Redis", "Kafka"], "url": "https://paytm.com/careers"}
    ],
    "AI/ML": [
        {"name": "NVIDIA", "avg_salary": "35-50 LPA", "skills": ["Python", "PyTorch", "CUDA"], "url": "https://www.nvidia.com/en-us/about-nvidia/careers/"},
        {"name": "DeepMind", "avg_salary": "40-65 LPA", "skills": ["Reinforcement Learning", "JAX", "Research Experience"], "url": "https://www.deepmind.com/careers"},
        {"name": "Adobe", "avg_salary": "25-35 LPA", "skills": ["Computer Vision", "Python", "MLOps"], "url": "https://www.adobe.com/careers.html"}
    ],
    "Cyber Security": [
        {"name": "Palo Alto Networks", "avg_salary": "22-35 LPA", "skills": ["Network Security", "Cloud Security", "Go/Python"], "url": "https://www.paloaltonetworks.com/about-us/careers"},
        {"name": "CrowdStrike", "avg_salary": "20-30 LPA", "skills": ["Kernel Development", "Security Analysis", "C/C++"], "url": "https://www.crowdstrike.com/careers/"},
        {"name": "Cisco", "avg_salary": "18-28 LPA", "skills": ["TCP/IP", "VPN", "Ethical Hacking"], "url": "https://jobs.cisco.com/"}
    ],
    "App Development": [
        {"name": "Swiggy", "avg_salary": "20-30 LPA", "skills": ["Android/iOS", "React Native", "Firebase"], "url": "https://www.swiggy.com/careers"},
        {"name": "CRED", "avg_salary": "25-40 LPA", "skills": ["Flutter", "Advanced UI", "Design Systems"], "url": "https://careers.cred.club/"},
        {"name": "Ola", "avg_salary": "16-24 LPA", "skills": ["Kotlin/Swift", "Memory Management", "Maps SDK"], "url": "https://www.ola.com/careers"}
    ],
    "Cloud Computing": [
        {"name": "Microsoft (Azure)", "avg_salary": "25-40 LPA", "skills": ["Azure Architecture", "Terraform", "Kubernetes"], "url": "https://careers.microsoft.com/"},
        {"name": "IBM Cloud", "avg_salary": "20-30 LPA", "skills": ["IBM Cloud Platform", "Containers", "DevSecOps"], "url": "https://www.ibm.com/it-infrastructure/cloud/careers"},
        {"name": "Google Cloud", "avg_salary": "30-50 LPA", "skills": ["GCP", "GKE", "Anthos"], "url": "https://www.google.com/about/careers/applications/jobs/results/?q=Cloud"}
    ],
    "Data Science": [
        {"name": "Walmart Global Tech", "avg_salary": "22-32 LPA", "skills": ["Python", "Statistics", "Pyspark"], "url": "https://careers.walmart.com/technology"},
        {"name": "Fractal Analytics", "avg_salary": "12-20 LPA", "skills": ["Data Modeling", "SQL", "Tableau"], "url": "https://fractal.ai/careers/"},
        {"name": "Mu Sigma", "avg_salary": "8-15 LPA", "skills": ["Data Wrangling", "R", "Decision Sciences"], "url": "https://www.mu-sigma.com/careers"}
    ],
    "Data Engineering": [
        {"name": "Airbnb", "avg_salary": "35-50 LPA", "skills": ["Airflow", "Spark", "Hive"], "url": "https://www.airbnb.com/careers"},
        {"name": "Netflix", "avg_salary": "40-60 LPA", "skills": ["Real-time Data Processing", "Flink", "Kafka"], "url": "https://jobs.netflix.com/"},
        {"name": "Spotify", "avg_salary": "30-45 LPA", "skills": ["Scala", "BigQuery", "Data Governance"], "url": "https://www.lifeatspotify.com/"}
    ]
}

def is_skill_present(target_skill, student_skills):
    """Smart skill matching considering variations and exact matches."""
    target = target_skill.lower().strip()
    
    # Check for direct match or slash variations (e.g. "React/Next.js" matches if student has "React")
    targets = [t.strip() for t in target.split('/')]
    
    for s in student_skills:
        student_s = s.lower().strip()
        
        # 1. Direct match with any part of the target (e.g. "React" matches "react/next.js")
        for t in targets:
            if t == student_s:
                return True
            # Strip .js suffix
            if t.replace(".js", "") == student_s.replace(".js", ""):
                return True
            # Handle common abbreviations
            if t == "ml" and student_s == "machine learning": return True
            if t == "machine learning" and student_s == "ml": return True
            if t == "ai" and student_s == "artificial intelligence": return True
            
        # 2. If student skill contains the target (e.g. "learning react" contains "react")
        if any(t in student_s for t in targets):
            return True
            
    return False

def analyze_student(profile):
    domain = profile.domain if profile.domain in DOMAIN_SKILLS else "General"
    target_skills = DOMAIN_SKILLS[domain]
    
    student_skills = [s.lower().strip() for s in profile.skills]
    gpa = profile.gpa or 0
    
    missing_skills = []
    current_skill_score = 0
    
    for skill, demand in target_skills.items():
        if is_skill_present(skill, student_skills):
            current_skill_score += demand
        else:
            missing_skills.append(skill)
            
    # Normalize score
    max_score = sum(target_skills.values())
    skill_match_ratio = current_skill_score / max_score if max_score > 0 else 0
    
    # Probability Algorithm
    prob = 30 + (min(gpa, 10)/10 * 30) + (skill_match_ratio * 40)
    prob = min(round(prob, 2), 99.0)
    
    if current_skill_score == 0 and domain != "General":
        prob = min(prob, 45.0) 
    
    recommendations = missing_skills[:4]
    suggested_courses = [f"Mastering {s.title()} for {domain}" for s in recommendations]
    
    # Get Hiring Companies
    hiring_companies = DOMAIN_COMPANIES.get(domain, [
        {"name": "Infosys", "avg_salary": "4-8 LPA", "skills": ["Java", "SQL", "DBMS"], "url": "https://www.infosys.com/careers/"},
        {"name": "TCS", "avg_salary": "4-9 LPA", "skills": ["Python", "Algorithms", "Logical Reasoning"], "url": "https://www.tcs.com/careers"},
        {"name": "Wipro", "avg_salary": "3-7 LPA", "skills": ["C++", "Fundamentals", "Soft Skills"], "url": "https://careers.wipro.com/global-india"}
    ])
    
    return {
        "recommended_skills": recommendations,
        "placement_probability": prob,
        "suggested_courses": suggested_courses,
        "domain_analyzed": domain,
        "hiring_companies": hiring_companies
    }

# Cron Job 
---
This project is a cron job that verifies email spam for ACECOM, a peruvian college asocciation.

**Update November 2024:** An AI spam verification first implementation was added, for low rate of emails per day.

## Project structure

```
├── package.json
├── package-lock.json
├── README.md
├── src
│   ├── api
│   │   ├── gmail
│   │   │   ├── connection.ts
│   │   │   └── index.ts
│   │   ├── groq
│   │   │   ├── connection.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── app.ts
│   ├── database
│   │   ├── index.ts
│   │   └── redis
│   │       ├── connection.ts
│   │       ├── index.ts
│   │       └── queries
│   │           ├── blacklist.ts
│   │           ├── index.ts
│   │           ├── lastdate.ts
│   │           └── refresh_token.ts
│   ├── index.ts
│   ├── jobs
│   │   ├── gmail
│   │   │   ├── index.ts
│   │   │   └── spamEmails.ts
│   │   └── index.ts
│   └── services
│       ├── gmail
│       │   ├── index.ts
│       │   └── spamEmails.ts
│       └── index.ts
└── tsconfig.json
```

## Pre Requisites

To use this project you will need Node 22.0.0, and some API keys. Check the [.env.example](./.env.example) file.

## Script

To run this project without the AI spam checker, execute:

```bash
npm run start
```

## Pricing and Constraints

We use [Groq](https://groq.com) as our AI provider due to its excellent inference performance and current free beta access. While in beta, consider the following pricing estimates:

- Model used: **Llama 3.2 1B (Preview) 8k**
- Cost: *$0.04* per million tokens
- Average email check: 2000 tokens
- Worst case scenario (100 emails/day): 200,000 tokens

### Estimated costs

In the worst case

- Daily: $0.008
- Monthly: $0.024

### Important considerations

1. Groq has [consumption limits](https://console.groq.com/settings/limits)
2. Each Gmail request is processed individually
3. To optimize token usage:
    - Send only relevant email content
    - Remove HTML formatting
    - Include only text that helps determine spam status

Remember to monitor Groq API limits and adjust email processing accordingly.


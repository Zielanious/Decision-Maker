This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy to Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template-nextjs&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F%5BUSER_NAME%5D%2Fdecision-mirror&env=OPENROUTER_API_KEY,NEXT_PUBLIC_SITE_URL&envDescription=Add%20your%20OpenRouter%20API%20key%20and%20public%20site%20URL&envLink=https%3A%2F%2Fopenrouter.ai%2Fkeys)

### Manual Deployment Steps

1.  **Push to GitHub/GitLab/Bitbucket**: Ensure your repository is pushed to a Git provider.
2.  **Import to Vercel**: Go to [vercel.com/new](https://vercel.com/new) and select your repository.
3.  **Configure Environment Variables**:
    *   `OPENROUTER_API_KEY`: Your OpenRouter API key.
    *   `NEXT_PUBLIC_SITE_URL`: Your production URL (e.g., `https://your-app.vercel.app`).
4.  **Deploy**: Click "Deploy". Vercel will automatically detect the Next.js settings and handle the build.

### Environment Variables

Ensure you have the following environment variables configured in your Vercel project:

| Variable | Description |
| :--- | :--- |
| `OPENROUTER_API_KEY` | Your OpenRouter API key found in your [OpenRouter Dashboard](https://openrouter.ai/keys). |
| `NEXT_PUBLIC_SITE_URL` | The public URL of your application (used for API referrers). |
| `OPENROUTER_MODEL` | (Optional) The specific model you want to use (e.g., `openai/gpt-4o-mini`). |


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

It is recommended to use Docker to run the project as it will automatically set up the environment for you.  
The steps to run the project using Docker in the [README.md](
  https://github.com/Build-Squad/influencer-marketplace/blob/main/README.md) file in the root directory.

To run the project locally without Docker, follow the steps below:

### Pre-requisites
1. Node.js installed on your machine. [Node.js](https://nodejs.org/en/download/)
2. (Optional) Yarn installed on your machine. [Yarn](https://classic.yarnpkg.com/en/docs/install/)  
Note: You can use npm instead of yarn if you prefer.

### Setting up the project

1. Git clone the repository -   
```bash
git clone https://github.com/Build-Squad/influencer-marketplace
```

2. Change into the project directory -  
```bash
cd influencer-marketplace/src/ui
```

3. Install the dependencies:

```bash
npm install
# or
yarn install
```

4. Create env file based on .env.example -  
```bash
cp .env.example .env
```

5. Fill in the environment variables in the .env file according to your local environment.

6. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://127.0.0.1:3000/](http://127.0.0.1:3000/) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

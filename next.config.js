/** @type {import('next').NextConfig} */
const dotenv = require('dotenv');
const path = require('path');

const { MODE } = process.env;

const { parsed: env } = dotenv.config({
  path: path.resolve(process.cwd(), `.env.${MODE}`),
});

const nextConfig = {
  env,
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;

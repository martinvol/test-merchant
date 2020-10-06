# Description
Creating a test merchant website heavily based on [Stripe's demo](https://github.com/stripe-samples/nextjs-typescript-react-stripe-js)

# Setup
See demo above; populate  `cp .env.local.example .env.local` and then fill in private/public Stripe developer keys accordingly.
Note: if you pull changes in the `.env.local.example`, make sure to update your `.env.local` accordingly and rerun `yarn`, otherwise API keys won't be available and nothing will update properly.
After cloning:
```
yarn
yarn dev
```
OR 
```
yarn
yarn build
yarn start
```

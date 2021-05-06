import Stripe from 'stripe';

console.log('stripe secret', process.env.STRIPE_SECRET);

const stripeConfig = new Stripe(process.env.STRIPE_SECRET || '', {
  apiVersion: '2020-08-27',
});

export default stripeConfig;

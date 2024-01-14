## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Stripe

Create a webhook for development

```shell
stripe listen --forward-to localhost:3000/api/webhook
```

and send a test event

```shell
stripe trigger payment_intent.succeeded
```

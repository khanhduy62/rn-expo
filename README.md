# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Test on a development build

```
npx uri-scheme open rnexpo://deeplinking/2 --ios
```

## API routes

API routes are files ending in `+api.ts` inside the **app** directory (e.g. [app/api/hello+api.ts](app/api/hello+api.ts) is served at `/api/hello`). They require `web.output` to be `"server"` in [app.config.js](app.config.js).

To run the demo:

1. Start the dev server with a cleared bundler cache (needed after adding/changing API routes):

   ```bash
   yarn start --reset-cache
   ```

2. Call the route:

   ```bash
   curl http://localhost:8081/api/hello
   # {"hello":"world"}
   ```

## Deploy the web app to EAS Hosting

Follows [EAS Hosting — Get started](https://docs.expo.dev/eas/hosting/get-started/). This deploys the web bundle **and** the API routes together, onto Cloudflare Workers.

One-time setup:

```bash
npm install --global eas-cli
eas login
eas whoami
```

`expo.web.output` must be set — this project uses `"server"` in [app.config.js](app.config.js), which is what enables API routes and server functions.

Then, for every deploy:

1. Export the web bundle (must be re-run before each deploy — `eas deploy` only uploads `dist`):

   ```bash
   npx expo export --platform web
   ```

2. Deploy a preview. On the first run the CLI prompts you to link an EAS project and pick a subdomain:

   ```bash
   eas deploy
   ```

   Gives a per-deploy URL: `https://{subdomain}--{hash}.expo.app/`

3. Promote to production once the preview looks right:

   ```bash
   eas deploy --prod
   ```

   Serves at `https://{subdomain}.expo.app/`

### Environment variables

Two separate mechanisms, easy to mix up:

- **`EXPO_PUBLIC_*`** are inlined at **export** time, so they come from the local `.env*` files. Step 1 runs with `NODE_ENV=production`, meaning only `.env.production.local`, `.env.local`, `.env.production` and `.env` are read. A file like `.env.staging` is never picked up — `NODE_ENV` only accepts `development`, `test` or `production`. To export with a different set of values, load them into the shell first (real env vars take priority over `.env*` files):

  ```bash
  set -a; . ./.env.staging; set +a
  npx expo export --platform web
  ```

- **Server-side secrets** read via `process.env` inside `+api.ts` are resolved at **runtime** on the Worker, from EAS environment variables — not from any local `.env` file:

  ```bash
  eas env:create --environment production --name MY_SECRET --value "..." --type secret
  eas env:pull --environment production   # mirror them locally into .env.local
  ```

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

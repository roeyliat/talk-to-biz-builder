# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## One-command local deploy

If you work with the two-worktree setup in this repo, you can deploy everything with one command from the main project folder:

```sh
npm run deploy:live -- --message "Describe your change"
```

What it does:

- creates a commit in the current worktree if you still have local changes
- cherry-picks that commit into the clean `main` worktree at `../talk-to-biz-builder-main`
- runs `npm run build`
- deploys to Firebase Hosting with `npx firebase-tools`
- pushes `main` to `origin/main`

Helpful options:

```sh
# Preview the commands without changing anything
npm run deploy:dry -- --message "Preview deploy"

# If your clean main worktree lives somewhere else
MAIN_WORKTREE=/absolute/path/to/talk-to-biz-builder-main npm run deploy:live -- --message "Deploy latest fixes"
```

Notes:

- The script automatically ignores local-only paths like `.firebase/`, `.continue/`, `supabase/.temp/`, and `tmp-check-admin-reset.cjs`.
- Keep the clean worktree on the `main` branch.
- If `firebase` is not installed globally, that is fine: the script uses `npx firebase-tools`.

## Local AAC images

- Add local AAC images to `src/assets/aac-local/`.
- Name the file after the term you want to match, for example `תות.png`, `strawberry.png`, or `קפה.svg`.
- The app now scans filenames automatically and uses a local image first.
- Multi-word labels also work better now, for example `שוקולד צ'יפס`, `אגוז לוז`, or `טעם תות`.
- If you only have one big collage image with many flavors together, split it into separate files first; matching works per image file.
- If no local filename matches the AAC label, it falls back to the cloud `ARASAAC` search.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

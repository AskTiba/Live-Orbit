# Collaborative Git Workflow for Linear History

This document outlines a recommended Git workflow for teams aiming to maintain a clean, linear commit history, especially when integrating feature branches into a main development branch (e.g., `main` or `develop`).

## Goal

To ensure the `main` branch (and feature branches before integration) has a straight, easy-to-follow commit history, avoiding unnecessary merge commits.

## Key Tools

*   `git pull --rebase`: Fetches remote changes and reapplies your local commits on top, maintaining linearity.
*   `git push --force-with-lease`: Safely force pushes changes after a rebase, preventing accidental overwrites of others' work.

## Workflow Steps

### 1. Start a New Feature Branch

Always ensure your `main` branch is up-to-date before creating a new feature branch.

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### 2. Work and Commit on Your Feature Branch

Make your changes and commit them regularly as you develop your feature.

```bash
git add .
git commit -m "Descriptive commit message for your changes"
```

### 3. Regularly Update Your Feature Branch with `main`'s Changes

Before pushing your feature branch, or when you need to incorporate the latest changes from `main`, use `git pull --rebase`. This is crucial to avoid large merge conflicts later and to keep your history linear.

```bash
git checkout feature/your-feature-name
git pull --rebase origin main
```

*   **Conflict Resolution:** If conflicts occur during the rebase, Git will pause.
    1.  Resolve the conflicts in your files.
    2.  Stage the resolved files: `git add .`
    3.  Continue the rebase: `git rebase --continue`
    *   To abort the rebase: `git rebase --abort`

### 4. Push Your Feature Branch

*   **First push of a new branch:**
    ```bash
git push -u origin feature/your-feature-name
    ```
*   **Subsequent pushes after a rebase:**
    Since `git rebase` rewrites history, you will need to force push. Use `--force-with-lease` for safety.
    ```bash
git push --force-with-lease
    ```
    *   `--force-with-lease` is safer than `--force` because it will only force push if the remote branch hasn't been updated by someone else since you last pulled. This prevents you from accidentally overwriting a collaborator's work.

### 5. Integrate Your Feature Branch into `main` (via Pull Request/Merge Request)

When your feature is complete and reviewed, you'll typically create a Pull Request (PR) or Merge Request (MR).

*   **Before creating the PR:** Ensure your feature branch is fully rebased onto the latest `main` and passes all tests.
*   **Merging the PR:** Configure your repository's settings (e.g., GitHub, GitLab) to use a "Squash and Merge" or "Rebase and Merge" strategy for PRs into `main`.
    *   **Squash and Merge:** All commits from your feature branch are combined into a single commit on `main`. This keeps `main`'s history very clean.
    *   **Rebase and Merge:** Your feature branch's commits are replayed directly onto `main`, maintaining individual commits but ensuring a linear history.

## Important Considerations and Warnings

*   **`git rebase` rewrites history:** Understand that `git rebase` changes the commit IDs of your commits.
*   **Avoid rebasing shared branches:** Never rebase a branch that others have already pulled and are actively working on, unless you have explicitly coordinated with them. Rebase only your local, unpushed commits or your own feature branch before it's merged.
*   **Communication is Key:** Ensure your team is aware of and agrees upon this workflow.
*   **Repository Settings:** Leverage your Git hosting platform's settings to enforce linear history (e.g., disallow regular merges, enable "Squash and Merge" or "Rebase and Merge" for PRs).

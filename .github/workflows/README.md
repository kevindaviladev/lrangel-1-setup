# GitHub Actions Workflows

This directory contains automated workflows for managing the `profileID` in environment files.

## 📋 Available Workflows

### 1. Auto Increment Profile ID (Automatic)
**File:** `increment-profile-id.yml`

**Triggers:** Automatically on every push to any branch (except environment file changes)

**What it does:**
- Reads the current `profileID` from `environment.ts`
- Increments the value by 1
- Updates both `environment.ts` and `environment.development.ts`
- Commits and pushes the changes automatically with `[skip ci]` to avoid infinite loops

**Configuration:**
```yaml
on:
  push:
    branches:
      - '**'  # All branches
    paths:
      - '1 - setup/src/**'  # Only source code changes
      - '!1 - setup/src/environments/**'  # Exclude environment files
```

**Safeguards:**
- Skips if commit message contains `[skip ci]`
- Skips if commit was made by `github-actions[bot]`
- Only triggers on source code changes (not environment files)

---

### 2. Manual Increment Profile ID (Manual)
**File:** `manual-increment-profile-id.yml`

**Triggers:** Manually via GitHub Actions UI

**What it does:**
- Allows you to manually trigger the workflow
- You can specify how much to increment (default: 1)
- Updates both environment files
- Commits and pushes the changes

**How to use:**
1. Go to your GitHub repository
2. Click on **Actions** tab
3. Select **Manual Increment Profile ID** workflow
4. Click **Run workflow**
5. Optionally, enter a custom increment value (e.g., 5, 10)
6. Click **Run workflow** button

---

## 🚀 Setup Instructions

### Prerequisites
1. Push these workflow files to your GitHub repository
2. Ensure GitHub Actions is enabled in your repository settings

### First-time setup
```bash
# Navigate to your repository
cd "/Users/kevindavilabenavides/Documents/mentorias/luis rangel"

# Add the workflow files to git
git add .github/workflows/

# Commit
git commit -m "chore: add GitHub Actions for profile ID management"

# Push to GitHub
git push origin master
```

---

## 📊 How it works

### Automatic Workflow Flow:
```
Push to repo
    ↓
Trigger workflow (if conditions met)
    ↓
Read current profileID
    ↓
Increment by 1
    ↓
Update environment files
    ↓
Commit & push with [skip ci]
    ↓
Done ✓
```

### Manual Workflow Flow:
```
Manual trigger (via GitHub UI)
    ↓
Optional: specify increment amount
    ↓
Read current profileID
    ↓
Increment by specified amount
    ↓
Update environment files
    ↓
Commit & push
    ↓
Done ✓
```

---

## 🔍 Monitoring

After each workflow run, you can:
1. Go to **Actions** tab in GitHub
2. Click on the workflow run
3. View the summary with:
   - Previous Profile ID
   - New Profile ID
   - Branch name
   - Commit SHA

---

## ⚠️ Important Notes

1. **Infinite Loop Prevention**: The automatic workflow includes `[skip ci]` in commit messages to prevent triggering itself
2. **Permissions**: Workflows use `GITHUB_TOKEN` which has default permissions
3. **Branch Protection**: If you have branch protection rules, you may need to adjust settings to allow the bot to push
4. **Conflicts**: If multiple pushes happen simultaneously, the workflow might face merge conflicts

---

## 🛠 Customization

### Change trigger conditions:
Edit `increment-profile-id.yml` line 4-8:
```yaml
on:
  push:
    branches:
      - main  # Only trigger on main branch
```

### Change increment amount (automatic):
Edit the increment step to use a different value:
```bash
NEW_ID=$((CURRENT_ID + 5))  # Increment by 5
```

### Disable auto-increment:
Simply delete or rename `increment-profile-id.yml`

---

## 🐛 Troubleshooting

**Workflow not triggering?**
- Check that the push modified files in `1 - setup/src/` (excluding environments)
- Verify commit message doesn't contain `[skip ci]`
- Check GitHub Actions is enabled

**Permission errors?**
- Ensure `GITHUB_TOKEN` has write permissions in repository settings
- Check branch protection rules

**Wrong profileID?**
- Manually run the workflow with a specific increment
- Or use the bash script locally to set a specific value

---

## 📞 Support

For issues or questions, check the workflow logs in the Actions tab of your GitHub repository.


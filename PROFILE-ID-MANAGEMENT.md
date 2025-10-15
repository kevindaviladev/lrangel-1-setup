# Profile ID Management Guide

This repository includes tools to manage the `profileID` value in environment files.

## 🎯 Quick Reference

| Method | When to Use | How to Execute |
|--------|-------------|----------------|
| **Bash Script** | Local development, specific value needed | `./1\ -\ setup/update-profile-id.sh <value>` |
| **Auto GitHub Action** | Automatic increment on every push | Pushes automatically |
| **Manual GitHub Action** | Manual control, custom increment | Via GitHub Actions UI |

---

## 🖥️ Local: Bash Script

### Set a specific Profile ID value

```bash
# Navigate to setup folder
cd "1 - setup"

# Set profileID to any value
./update-profile-id.sh 100
```

**Features:**
- ✅ Set specific value
- ✅ Input validation
- ✅ Automatic backups
- ✅ Updates both environment files

**Files updated:**
- `src/environments/environment.ts`
- `src/environments/environment.development.ts`

---

## ☁️ Cloud: GitHub Actions

### Option 1: Automatic (On Push)

**What happens:**
- Every time you push code changes
- Profile ID automatically increments by 1
- Changes are committed back automatically

**Example:**
```bash
# Current profileID: 51

# You make a code change and push
git add src/app/app.ts
git commit -m "feat: add new feature"
git push

# GitHub Action runs automatically
# profileID is now: 52 (incremented and committed)
```

### Option 2: Manual Trigger

**Steps:**
1. Go to your GitHub repository
2. Click **Actions** tab
3. Select **"Manual Increment Profile ID"**
4. Click **"Run workflow"**
5. Enter increment amount (or leave default: 1)
6. Click **"Run workflow"** button

**Example scenarios:**
- Increment by 1 (default)
- Increment by 10 (for major releases)
- Increment by 5 (for version jumps)

---

## 📁 Files Structure

```
.
├── 1 - setup/
│   ├── src/
│   │   └── environments/
│   │       ├── environment.ts              ← Production profileID
│   │       └── environment.development.ts  ← Development profileID
│   └── update-profile-id.sh                ← Bash script
│
└── .github/
    └── workflows/
        ├── increment-profile-id.yml        ← Auto increment
        ├── manual-increment-profile-id.yml ← Manual increment
        └── README.md                        ← Detailed docs
```

---

## 🔄 Workflow Comparison

### Bash Script (Local)
```bash
./update-profile-id.sh 75
```
- ✅ Immediate execution
- ✅ Set any specific value
- ✅ No internet needed
- ✅ Runs locally
- ❌ Manual execution required

### Auto GitHub Action (Cloud)
```yaml
Trigger: push to repository
```
- ✅ Fully automated
- ✅ Consistent increments
- ✅ No manual intervention
- ✅ Tracked in git history
- ❌ Only increments by 1
- ❌ Requires push to trigger

### Manual GitHub Action (Cloud)
```yaml
Trigger: workflow_dispatch (manual)
```
- ✅ On-demand execution
- ✅ Custom increment amount
- ✅ Tracked in git history
- ✅ Can run from anywhere
- ❌ Requires GitHub access
- ❌ Internet connection needed

---

## 💡 Common Use Cases

### Scenario 1: Set initial Profile ID
```bash
# Use bash script for precision
cd "1 - setup"
./update-profile-id.sh 1000
```

### Scenario 2: Regular development
```bash
# Let auto-increment handle it
git add .
git commit -m "feat: new feature"
git push
# profileID increments automatically ✨
```

### Scenario 3: Major version bump
```
# Use manual GitHub Action
# Go to Actions → Manual Increment → Run with increment_by: 100
```

### Scenario 4: Fix wrong Profile ID
```bash
# Use bash script to set correct value
cd "1 - setup"
./update-profile-id.sh 555
```

---

## ⚙️ Setup Requirements

### Bash Script
- ✅ Already executable
- ✅ Works immediately
- ✅ No setup needed

### GitHub Actions
1. Push workflow files to GitHub:
   ```bash
   git add .github/workflows/
   git commit -m "chore: add profile ID workflows"
   git push
   ```

2. Ensure GitHub Actions is enabled in repository settings

3. That's it! Workflows are now active 🎉

---

## 🔍 Verification

### Check current Profile ID
```bash
# View production environment
cat "1 - setup/src/environments/environment.ts"

# View development environment  
cat "1 - setup/src/environments/environment.development.ts"
```

### View GitHub Action runs
1. Go to GitHub repository
2. Click **Actions** tab
3. View recent workflow runs
4. Check logs and summaries

---

## 🛡️ Safety Features

### Bash Script
- Input validation (numbers only)
- Automatic backups (`.backup` files)
- File existence checks

### GitHub Actions
- `[skip ci]` prevents infinite loops
- Only triggers on source code changes
- Bot detection to avoid self-triggering
- Git conflict handling

---

## 📞 Quick Help

**Command not found?**
```bash
chmod +x "1 - setup/update-profile-id.sh"
```

**GitHub Action not running?**
- Check Actions tab for errors
- Verify GitHub Actions is enabled
- Check branch protection rules

**Need to rollback?**
```bash
# Restore from backup (bash script)
cd "1 - setup/src/environments"
cp environment.ts.backup environment.ts
cp environment.development.ts.backup environment.development.ts
```

---

## 📚 Additional Resources

- **Detailed Workflows Documentation**: `.github/workflows/README.md`
- **Bash Script**: `1 - setup/update-profile-id.sh`
- **GitHub Actions Docs**: https://docs.github.com/en/actions


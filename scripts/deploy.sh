#!/bin/zsh

set -euo pipefail

SCRIPT_DIR=${0:A:h}
SOURCE_REPO=${SOURCE_REPO:-${SCRIPT_DIR:h}}
MAIN_WORKTREE=${MAIN_WORKTREE:-${SOURCE_REPO}-main}
DEPLOY_BRANCH=${DEPLOY_BRANCH:-main}
DRY_RUN=0
COMMIT_MESSAGE=""

typeset -a EXCLUDED_PATHS=(
  ".continue"
  "supabase/.temp"
  "tmp-check-admin-reset.cjs"
  ".firebase"
)

usage() {
  cat <<'EOF'
Usage: ./scripts/deploy.sh [options]

Creates a commit from the current worktree (if needed), cherry-picks it into the clean main worktree,
builds, deploys to Firebase Hosting, and pushes origin/main.

Options:
  -m, --message <msg>       Commit message to use when the source worktree has uncommitted changes
  -n, --dry-run             Print the commands without executing the mutating steps
      --source-repo <path>  Override the source repo path
      --main-worktree <path>
                            Override the clean main worktree path
  -h, --help                Show this help message

Environment overrides:
  SOURCE_REPO, MAIN_WORKTREE, DEPLOY_BRANCH

Examples:
  ./scripts/deploy.sh -m "Fix board header"
  MAIN_WORKTREE=/Users/you/talk-to-biz-builder-main ./scripts/deploy.sh -m "Deploy latest AAC fix"
  ./scripts/deploy.sh --dry-run -m "Preview deploy"
EOF
}

log() {
  print -P "%F{cyan}==>%f $*"
}

die() {
  print -P "%F{red}Error:%f $*" >&2
  exit 1
}

run() {
  print -r -- "+ $*"
  if (( ! DRY_RUN )); then
    "$@"
  fi
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || die "Missing required command: $1"
}

require_git_worktree() {
  local repo_path="$1"
  git -C "$repo_path" rev-parse --is-inside-work-tree >/dev/null 2>&1 || die "Git worktree not found at $repo_path"
}

filtered_status() {
  local repo_path="$1"
  local raw_status
  raw_status=$(git -C "$repo_path" status --short)

  if [[ -z "$raw_status" ]]; then
    return 0
  fi

  print -r -- "$raw_status" | while IFS= read -r line; do
    [[ "$line" == *" .firebase/"* ]] && continue
    print -r -- "$line"
  done
}

while (( $# > 0 )); do
  case "$1" in
    -m|--message)
      [[ $# -ge 2 ]] || die "Missing value for $1"
      COMMIT_MESSAGE="$2"
      shift 2
      ;;
    -n|--dry-run)
      DRY_RUN=1
      shift
      ;;
    --source-repo)
      [[ $# -ge 2 ]] || die "Missing value for $1"
      SOURCE_REPO="$2"
      shift 2
      ;;
    --main-worktree)
      [[ $# -ge 2 ]] || die "Missing value for $1"
      MAIN_WORKTREE="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      die "Unknown argument: $1"
      ;;
  esac
done

SOURCE_REPO=${SOURCE_REPO:A}
MAIN_WORKTREE=${MAIN_WORKTREE:A}

require_command git
require_command npm
require_command npx
require_command node

require_git_worktree "$SOURCE_REPO"
require_git_worktree "$MAIN_WORKTREE"
[[ -f "$MAIN_WORKTREE/firebase.json" ]] || die "firebase.json not found in $MAIN_WORKTREE"
[[ -f "$SOURCE_REPO/.firebaserc" ]] || die ".firebaserc not found in $SOURCE_REPO"
[[ -f "$MAIN_WORKTREE/.firebaserc" ]] || die ".firebaserc not found in $MAIN_WORKTREE"

current_branch=$(git -C "$SOURCE_REPO" branch --show-current)
[[ -n "$current_branch" ]] || die "Unable to determine source branch"

main_branch=$(git -C "$MAIN_WORKTREE" branch --show-current)
[[ "$main_branch" == "$DEPLOY_BRANCH" ]] || die "Expected $MAIN_WORKTREE to be on $DEPLOY_BRANCH, found $main_branch"

firebase_project=$(node -e "const fs=require('fs'); const path='$SOURCE_REPO/.firebaserc'; const data=JSON.parse(fs.readFileSync(path,'utf8')); if (!data.projects?.default) process.exit(1); process.stdout.write(data.projects.default);") || die "Could not read default Firebase project from $SOURCE_REPO/.firebaserc"

log "Preparing source worktree at $SOURCE_REPO"
run git -C "$SOURCE_REPO" add --all
for excluded_path in "${EXCLUDED_PATHS[@]}"; do
  if (( DRY_RUN )); then
    print -r -- "+ git -C $SOURCE_REPO reset HEAD -- $excluded_path"
  else
    git -C "$SOURCE_REPO" reset HEAD -- "$excluded_path" >/dev/null 2>&1 || true
  fi
done

source_commit=""
if git -C "$SOURCE_REPO" diff --cached --quiet; then
  source_commit=$(git -C "$SOURCE_REPO" rev-parse HEAD)
  log "No staged source changes after exclusions; using HEAD $source_commit"
else
  if [[ -z "$COMMIT_MESSAGE" ]]; then
    COMMIT_MESSAGE="Deploy update $(date '+%Y-%m-%d %H:%M:%S')"
  fi

  log "Creating source commit on $current_branch"
  run git -C "$SOURCE_REPO" commit -m "$COMMIT_MESSAGE"
  if (( DRY_RUN )); then
    source_commit="DRY_RUN_COMMIT"
  else
    source_commit=$(git -C "$SOURCE_REPO" rev-parse HEAD)
  fi
fi

if [[ -z "$source_commit" ]]; then
  die "Unable to determine source commit"
fi

log "Checking clean main worktree at $MAIN_WORKTREE"
main_status=$(filtered_status "$MAIN_WORKTREE" || true)
[[ -z "$main_status" ]] || die "Main worktree has local changes:\n$main_status"

log "Updating $DEPLOY_BRANCH in the clean worktree"
run git -C "$MAIN_WORKTREE" pull --ff-only origin "$DEPLOY_BRANCH"

log "Cherry-picking $source_commit into $DEPLOY_BRANCH"
if (( DRY_RUN )); then
  print -r -- "+ git -C $MAIN_WORKTREE cherry-pick $source_commit"
else
  if ! git -C "$MAIN_WORKTREE" cherry-pick "$source_commit"; then
    if git -C "$MAIN_WORKTREE" rev-parse -q --verify CHERRY_PICK_HEAD >/dev/null 2>&1; then
      cherry_pick_status=$(git -C "$MAIN_WORKTREE" status --short)
      if [[ -z "$cherry_pick_status" ]]; then
        log "Cherry-pick is empty; skipping because the changes are already present in $DEPLOY_BRANCH"
        git -C "$MAIN_WORKTREE" cherry-pick --skip >/dev/null 2>&1 || true
      else
        git -C "$MAIN_WORKTREE" cherry-pick --abort >/dev/null 2>&1 || true
        die "Cherry-pick failed. Resolve conflicts in $MAIN_WORKTREE and retry."
      fi
    else
      die "Cherry-pick failed. Resolve conflicts in $MAIN_WORKTREE and retry."
    fi
  fi
fi

log "Building production bundle"
run npm --prefix "$MAIN_WORKTREE" run build

log "Deploying to Firebase Hosting"
run npx firebase-tools deploy --only hosting --project "$firebase_project"

log "Pushing $DEPLOY_BRANCH to origin"
run git -C "$MAIN_WORKTREE" push origin "$DEPLOY_BRANCH"

if (( ! DRY_RUN )) && [[ -d "$MAIN_WORKTREE/.firebase" ]]; then
  rm -rf "$MAIN_WORKTREE/.firebase"
  git -C "$MAIN_WORKTREE" restore .firebase >/dev/null 2>&1 || true
fi

log "Verifying sync status"
run git -C "$MAIN_WORKTREE" status --short
run git -C "$MAIN_WORKTREE" rev-list --left-right --count "origin/$DEPLOY_BRANCH...$DEPLOY_BRANCH"

log "Done. Live deploy was triggered from $MAIN_WORKTREE"

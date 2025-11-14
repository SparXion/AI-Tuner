#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST_DIR="${ROOT_DIR}/related-repos"

mkdir -p "${DEST_DIR}"
cd "${DEST_DIR}"

clone_repo() {
    local url="$1"
    local dir="$2"
    if [ -d "$dir/.git" ]; then
        echo "[skip] $dir already exists"
    else
        echo "[clone] $url -> $dir"
        git clone "$url" "$dir"
    fi
}

clone_repo "https://github.com/SparXion/AI-Tuner.git" "ai-tuner-v2-v3"
clone_repo "https://github.com/SparXion/AI-Tuner-v3.0.git" "ai-tuner-v3-baseline"
clone_repo "https://github.com/SparXion/AI-Tuner-Creative.git" "ai-tuner-creative"
clone_repo "https://github.com/SparXion/AI-Tuner-Portal.git" "ai-tuner-portal"

echo "All repositories are ready in ${DEST_DIR}"

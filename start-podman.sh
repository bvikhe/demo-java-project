#!/bin/bash
set -e

# Podman rootless build on this WSL environment needs chroot isolation
# to avoid runc/systemd cgroup scope errors.
export BUILDAH_ISOLATION=chroot

# Start the full stack. Images are built if needed; subsequent starts use cache.
podman-compose up --build -d

echo "Demo started on http://localhost:8080"

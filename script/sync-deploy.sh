#!/usr/bin/env bash
#
# sync-deploy.sh — knou-interactive-site 소스를 대상 디렉토리로 동기화
# 빌드 산출물·의존성·환경파일 등을 제외하고 rsync로 복사
#
# Usage: ./sync-deploy.sh /absolute/path/to/dest
# ./sync-deploy.sh /Users/st/code-space/knou/knou-study-code

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly SOURCE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
readonly PROGNAME="$(basename "$0")"

# ── 색상 (터미널이 아니면 비활성) ──────────────────────────
if [[ -t 1 ]]; then
  RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[0;33m'; NC='\033[0m'
else
  RED=''; GREEN=''; YELLOW=''; NC=''
fi

log_info()  { printf "${GREEN}[INFO]${NC}  %s\n" "$*"; }
log_warn()  { printf "${YELLOW}[WARN]${NC}  %s\n" "$*" >&2; }
log_error() { printf "${RED}[ERROR]${NC} %s\n" "$*" >&2; }

usage() {
  cat <<EOF
Usage: ${PROGNAME} <destination_absolute_path>

  대상 경로는 반드시 절대경로('/'로 시작)여야 합니다.
  빌드 산출물(node_modules, .next, out, build, dist 등)을 제외하고 동기화합니다.

Options:
  -n, --dry-run   실제 복사 없이 변경 사항만 표시
  -h, --help      이 도움말 표시
EOF
}

# ── 인자 파싱 ──────────────────────────────────────────────
DRY_RUN=false
DEST_DIR=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    -n|--dry-run) DRY_RUN=true; shift ;;
    -h|--help)    usage; exit 0 ;;
    -*)           log_error "알 수 없는 옵션: $1"; usage; exit 1 ;;
    *)
      if [[ -z "${DEST_DIR}" ]]; then
        DEST_DIR="$1"; shift
      else
        log_error "대상 경로가 이미 지정되었습니다: ${DEST_DIR}"; usage; exit 1
      fi
      ;;
  esac
done

# ── 입력 검증 ──────────────────────────────────────────────
if [[ -z "${DEST_DIR}" ]]; then
  log_error "대상 경로를 지정해주세요."
  usage
  exit 1
fi

# 절대경로 검증
if [[ "${DEST_DIR}" != /* ]]; then
  log_error "대상 경로는 절대경로여야 합니다: ${DEST_DIR}"
  exit 1
fi

# 경로 정규화 — 심볼릭 링크·상대 요소(..) 해소
DEST_DIR="$(python3 -c "import os,sys; print(os.path.realpath(sys.argv[1]))" "${DEST_DIR}")"

# 위험 경로 차단 (시스템 루트·홈 직접 덮어쓰기 방지)
case "${DEST_DIR}" in
  /|/bin|/sbin|/usr|/usr/bin|/usr/sbin|/etc|/var|/tmp|/System|/Library|/private)
    log_error "시스템 디렉토리로의 동기화는 허용되지 않습니다: ${DEST_DIR}"
    exit 1
    ;;
esac

if [[ "${DEST_DIR}" == "${HOME}" ]]; then
  log_error "홈 디렉토리 루트로의 동기화는 허용되지 않습니다."
  exit 1
fi

# 소스와 대상이 같은 경로인지 확인
REAL_SOURCE="$(python3 -c "import os,sys; print(os.path.realpath(sys.argv[1]))" "${SOURCE_DIR}")"
if [[ "${DEST_DIR}" == "${REAL_SOURCE}" ]]; then
  log_error "소스와 대상 경로가 동일합니다: ${DEST_DIR}"
  exit 1
fi

# 대상이 소스 하위인지 확인 (순환 복사 방지)
if [[ "${DEST_DIR}" == "${REAL_SOURCE}"/* ]]; then
  log_error "대상 경로가 소스 하위에 있습니다 (순환 복사 위험): ${DEST_DIR}"
  exit 1
fi

# rsync 존재 확인
if ! command -v rsync &>/dev/null; then
  log_error "rsync가 설치되어 있지 않습니다."
  exit 1
fi

# ── 대상 디렉토리 준비 ────────────────────────────────────
if [[ ! -d "${DEST_DIR}" ]]; then
  log_info "대상 디렉토리 생성: ${DEST_DIR}"
  mkdir -p "${DEST_DIR}"
fi

# 쓰기 권한 확인
if [[ ! -w "${DEST_DIR}" ]]; then
  log_error "대상 디렉토리에 쓰기 권한이 없습니다: ${DEST_DIR}"
  exit 1
fi

# ── 제외 목록 ──────────────────────────────────────────────
EXCLUDES=(
  # 의존성
  "node_modules/"
  # 빌드 산출물
  ".next/"
  "out/"
  "build/"
  "dist/"
  "*.tsbuildinfo"
  # 환경·시크릿
  ".env"
  ".env.*"
  # 디버그 로그
  "npm-debug.log*"
  "yarn-debug.log*"
  "yarn-error.log*"
  ".pnpm-debug.log*"
  # OS 메타데이터
  ".DS_Store"
  "Thumbs.db"
  # IDE
  ".vscode/"
  ".idea/"
  # Git
  ".git/"
  # 이 스크립트 자체 디렉토리는 포함 (필요 시 제외 가능)
)

RSYNC_ARGS=(
  -av
  --delete
  --checksum
)

for pattern in "${EXCLUDES[@]}"; do
  RSYNC_ARGS+=( --exclude="${pattern}" )
done

if [[ "${DRY_RUN}" == true ]]; then
  RSYNC_ARGS+=( --dry-run )
  log_warn "드라이런 모드 — 실제 파일은 변경되지 않습니다."
fi

# ── 동기화 실행 ────────────────────────────────────────────
log_info "소스: ${SOURCE_DIR}/"
log_info "대상: ${DEST_DIR}/"
log_info "동기화 시작..."

rsync "${RSYNC_ARGS[@]}" "${SOURCE_DIR}/" "${DEST_DIR}/"
RSYNC_EXIT=$?

if [[ ${RSYNC_EXIT} -eq 0 ]]; then
  log_info "동기화 완료."
else
  log_error "rsync 실패 (exit code: ${RSYNC_EXIT})"
  exit ${RSYNC_EXIT}
fi

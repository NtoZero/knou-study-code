# KNOU Interactive Study Site

KNOU(한국방송통신대학교) 인터랙티브 학습 사이트.
Next.js 15 + React 19 + Tailwind CSS 4 기반.

---

## 1. Node.js 설치

### Mac

**방법 A — Homebrew (권장)**

```bash
# Homebrew 미설치 시
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.js LTS 설치
brew install node@22
```

**방법 B — 공식 설치 파일**

[https://nodejs.org](https://nodejs.org) 에서 LTS(.pkg) 다운로드 후 실행.

### Windows

**방법 A — 공식 설치 파일 (권장)**

1. [https://nodejs.org](https://nodejs.org) 에서 LTS(.msi) 다운로드
2. 설치 중 "Add to PATH" 체크 확인
3. 설치 완료 후 **PowerShell** 또는 **명령 프롬프트** 재시작

**방법 B — winget**

```powershell
winget install OpenJS.NodeJS.LTS
```

### 설치 확인 (공통)

```bash
node -v   # v22.x.x
npm -v    # 10.x.x
```

---

## 2. 프로젝트 실행

### Mac (터미널)

```bash
# 프로젝트 디렉토리로 이동
cd knou-interactive-site

# 의존성 설치 (최초 1회)
npm install

# 개발 서버 실행
npm run dev
```

### Windows (PowerShell)

```powershell
# 프로젝트 디렉토리로 이동
cd knou-interactive-site

# 의존성 설치 (최초 1회)
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속.

---

## 3. 주요 명령어

| 명령어 | 설명 |
|---|---|
| `npm install` | 의존성 설치 (최초 1회, package.json 변경 시 재실행) |
| `npm run dev` | 개발 서버 실행 (Turbopack, 핫 리로드 지원) |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 빌드된 앱 실행 |
| `npm run lint` | 코드 린트 검사 |

---

## 4. 문제 해결

| 증상 | 해결 |
|---|---|
| `node: command not found` | Node.js 미설치 또는 PATH 미등록. 터미널 재시작 후 재시도 |
| `npm install` 에러 | `node_modules` 삭제 후 재설치: `rm -rf node_modules && npm install` (Windows: `rmdir /s /q node_modules`) |
| 포트 3000 사용 중 | `npm run dev -- -p 3001` 로 다른 포트 사용 |
| 권한 에러 (Mac) | `sudo chown -R $(whoami) ~/.npm` 실행 |

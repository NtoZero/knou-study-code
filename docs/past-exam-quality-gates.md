# Past Exam Quality Gates

기출분석 페이지는 UI보다 데이터 품질이 먼저다. 정답 공개 박스와 선택지별 해설은 학습자가 바로 이해할 수 있는 문장이어야 하며, 제작용 근거 라벨이 해설처럼 보이면 실패로 본다.

## 필드 분리

- `answerExplanation`: 학습자에게 보여줄 정답 해설. 정답 선택지의 `choices[].explanation.reason`과 일치해야 한다.
- `choices[].explanation.reason`: 선택지 본문이 왜 맞거나 틀렸는지 설명하는 문장.
- `answerSourceInternal`, `questionSourceInternal`, `sourceBasisInternal`: 정답표와 원자료 대조용 내부 필드. 화면에 직접 렌더링하지 않는다.
- `basis`: past-exam 문항의 학습자용 해설 필드로 쓰지 않는다. 내부 근거와 화면 문장을 혼동시킨다.

## 자동 감사

Java 기출분석은 다음 명령으로 감사한다.

```bash
npm run audit:java-past-exam
```

감사 항목:

- 2017-2019년 총 75문항, 연도별 25문항 존재
- 문항 id, 선택지 key, concept tag 중복 없음
- 선택지 본문이 번호만 남지 않음
- 코드 라벨형 선택지(`a`, `b, d`)는 코드 블록에 해당 라벨 맥락이 있을 때만 허용
- `answerExplanation`이 정답 선택지의 직접 해설과 일치
- `교재 대응 장`, `문항 초점`, `sourceBasis`, `conceptBasis` 같은 내부 라벨이 학습자 해설에 없음
- `기준을 충족하므로`, `정답 후보에서 제외` 같은 상용구 없음
- `correctReasonFor`, `wrongReasonFor`, `basisFor`, `wrongRule` 같은 해설 생성 helper 없음

`package.json`의 `prebuild`가 이 감사를 실행하므로 `npm run build` 전에 같은 문제가 다시 들어오면 빌드가 실패한다.

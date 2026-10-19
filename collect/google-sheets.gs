/**
 * DEADLY SINS — 결과 기록용 구글 시트 (무료)
 *
 * 설치 (5분, 한 번만)
 *   1. sheets.new 로 빈 구글 시트를 하나 만든다 (이름은 아무거나, 예: DEADLY SINS 기록)
 *   2. 메뉴 확장 프로그램 → Apps Script → 기본 코드를 지우고 이 파일 내용을 통째로 붙여 넣기 → 저장
 *   3. 오른쪽 위 배포 → 새 배포 → 유형 선택(톱니) → 웹 앱
 *        다음 사용자 인증 정보로 실행: 나
 *        액세스 권한이 있는 사용자: 모든 사용자
 *      → 배포 → 권한 검토 → 내 구글 계정 선택 → (경고가 나오면) 고급 → 이동 → 허용
 *   4. 나오는 "웹 앱 URL" (https://script.google.com/macros/s/…/exec) 을 복사
 *   5. 그 주소를 public/data.js 의 collect.sheet 에 넣고 푸시 (또는 Claude 에게 전달)
 *
 * 시트에는 "기록" 탭(한 줄 = 손님 행동 하나, "결과" 는 세션마다 마지막 것 한 줄)과 "요약" 탭(죄별 분포, 완주율)이 자동으로 생긴다.
 * 이름 · 전화번호 · IP 같은 개인 정보는 오지 않는다. 세션은 퀴즈를 시작할 때마다 새로 만드는 임의 문자열.
 *
 * 이 웹 앱 주소는 누구나 POST 할 수 있다(사이트가 로그인 없이 보내야 하므로).
 * 그래서 들어오는 값의 종류와 길이를 아래에서 제한한다.
 */

const LOG = '기록';
const SUMMARY = '요약';
const HEAD = ['시간', '세션', '종류', '언어', '죄', '2위', '동점', '점수', '고른 보기', '기타', '버전'];
const TYPES = {
  start: '시작', result: '결과', signature: '시그니처', order: '바텐더 화면',
  menu: '메뉴', share: '이미지 저장', restart: '다시 하기', lang: '언어 변경', error: '오류'
};
const SINS = ['교만', '질투', '분노', '나태', '탐욕', '탐식', '색욕'];

function doPost(e) {
  let d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return ok_(); }
  if (!d || !TYPES[d.type]) return ok_();

  // = + - @ 로 시작하면 시트가 수식으로 실행하므로 글자로 고정한다
  const cut = (v, n) => {
    if (v === undefined || v === null) return '';
    const t = String(v).slice(0, n);
    return /^[=+\-@]/.test(t) ? "'" + t : t;
  };
  const sin = (v) => SINS.indexOf(v) >= 0 ? v : '';
  if (d.type === 'result' && !sin(d.sin)) return ok_();
  const known = ['sid', 'type', 'lang', 'v', 'sin', 'second', 'tie', 'points', 'picks'];
  const rest = {};
  Object.keys(d).forEach((k) => { if (known.indexOf(k) < 0) rest[k] = d[k]; });

  const row = [
    new Date(),
    cut(d.sid, 16),
    TYPES[d.type],
    d.lang === 'en' ? 'EN' : 'KO',
    sin(d.sin),
    sin(d.second),
    d.tie === true ? '동점' : '',
    cut(d.points, 120),
    cut(d.picks, 60),
    Object.keys(rest).length ? cut(JSON.stringify(rest), 500) : '',
    cut(d.v, 20)
  ];

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const sh = log_();
    // 같은 세션의 "결과" 는 한 줄만: 손님이 뒤로 가서 답을 바꾸면 마지막 결과로 덮어쓴다
    if (d.type === 'result' && !replaceResult_(sh, row)) sh.appendRow(row);
    else if (d.type !== 'result') sh.appendRow(row);
  } catch (err) {
    // 기록 실패는 손님 화면에 영향이 없다
  } finally {
    lock.releaseLock();
  }
  return ok_();
}

function replaceResult_(sh, row) {
  const last = sh.getLastRow();
  const from = Math.max(2, last - 300);          // 최근 300줄만 본다 (한 세션은 몇 분 안에 끝난다)
  if (last < from) return false;
  const vals = sh.getRange(from, 2, last - from + 1, 2).getValues();   // [세션, 종류]
  for (let i = vals.length - 1; i >= 0; i--) {
    if (vals[i][0] === row[1] && vals[i][1] === TYPES.result) {
      sh.getRange(from + i, 1, 1, row.length).setValues([row]);
      return true;
    }
  }
  return false;
}

// 브라우저로 주소를 열어 보면 살아 있는지 확인할 수 있다
function doGet() {
  return ContentService.createTextOutput('DEADLY SINS 기록용 웹 앱이 동작 중입니다.');
}

function ok_() {
  return ContentService.createTextOutput('ok');
}

function log_() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sh = book.getSheetByName(LOG);
  if (!sh) {
    sh = book.insertSheet(LOG, 0);
    sh.appendRow(HEAD);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEAD.length).setFontWeight('bold');
    sh.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm');
    summary_(book);
    const blank = book.getSheetByName('시트1') || book.getSheetByName('Sheet1');
    if (blank && blank.getLastRow() === 0 && book.getSheets().length > 1) book.deleteSheet(blank);
  }
  return sh;
}

// "요약" 탭: 수식이라 기록이 쌓이면 저절로 갱신된다
function summary_(book) {
  if (book.getSheetByName(SUMMARY)) return;
  const sh = book.insertSheet(SUMMARY, 0);
  const L = "'" + LOG + "'!";
  sh.getRange('A1').setValue('결과 분포 (끝까지 푼 사람, 세션당 1번)').setFontWeight('bold');
  sh.getRange('A2:C2').setValues([['죄', '명', '비율']]).setFontWeight('bold');
  SINS.forEach((name, i) => {
    const r = 3 + i;
    sh.getRange(r, 1).setValue(name);
    sh.getRange(r, 2).setFormula('=COUNTIFS(' + L + 'C:C,"결과",' + L + 'E:E,A' + r + ')');
    sh.getRange(r, 3).setFormula('=IFERROR(B' + r + '/SUM(B$3:B$9),0)').setNumberFormat('0.0%');
  });
  sh.getRange('A10').setValue('합계');
  sh.getRange('B10').setFormula('=SUM(B3:B9)');

  sh.getRange('A12').setValue('손님 흐름').setFontWeight('bold');
  const flow = [['퀴즈 시작', '시작'], ['끝까지 풂', '결과'], ['시그니처 술 봄', '시그니처'],
    ['바텐더 화면 엶', '바텐더 화면'], ['결과 이미지 저장', '이미지 저장'], ['오류', '오류']];
  flow.forEach(([label, type], i) => {
    const r = 13 + i;
    sh.getRange(r, 1).setValue(label);
    sh.getRange(r, 2).setFormula('=COUNTIF(' + L + 'C:C,"' + type + '")');
    if (i > 0 && i < 5) sh.getRange(r, 3).setFormula('=IFERROR(B' + r + '/B$13,0)').setNumberFormat('0%');
  });
  sh.getRange('A20').setValue('※ 비율 = 퀴즈 시작 대비. 완전히 고르면 죄마다 약 14%.');
  sh.setColumnWidth(1, 150);
}

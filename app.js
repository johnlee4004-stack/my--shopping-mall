/* =====================================================
   회의록 작성기 — app.js
   Pure JS, no frameworks. PWA-ready.
   ===================================================== */

'use strict';

// ── Constants ──────────────────────────────────────────
const LS_KEY = 'meeting-minutes-data';
const AUTOSAVE_DELAY = 800; // ms debounce

// ── State ──────────────────────────────────────────────
let autosaveTimer = null;
let currentTab = 'form';

// ── DOM Refs ───────────────────────────────────────────
const tabForm       = document.getElementById('tab-form');
const tabPreview    = document.getElementById('tab-preview');
const viewForm      = document.getElementById('view-form');
const viewPreview   = document.getElementById('view-preview');
const formActionBar = document.getElementById('form-action-bar');
const prevActionBar = document.getElementById('preview-action-bar');
const previewContent = document.getElementById('preview-content');
const toast         = document.getElementById('toast');
const saveIndicator = document.getElementById('save-indicator');

// ── Tab Switching ──────────────────────────────────────
function switchTab(tab) {
  currentTab = tab;

  tabForm.classList.toggle('active', tab === 'form');
  tabPreview.classList.toggle('active', tab === 'preview');
  tabForm.setAttribute('aria-selected', tab === 'form');
  tabPreview.setAttribute('aria-selected', tab === 'preview');

  viewForm.classList.toggle('active', tab === 'form');
  viewPreview.classList.toggle('active', tab === 'preview');

  formActionBar.classList.toggle('hidden', tab !== 'form');
  prevActionBar.classList.toggle('hidden', tab !== 'preview');

  if (tab === 'preview') {
    renderPreview();
  }

  // Scroll to top on tab switch
  window.scrollTo({ top: 0, behavior: 'instant' });
}

tabForm.addEventListener('click', () => switchTab('form'));
tabPreview.addEventListener('click', () => switchTab('preview'));

// ── Dynamic List Builder ───────────────────────────────

/**
 * Create an attendee row element
 */
function createAttendeeItem(data = {}) {
  const item = document.createElement('div');
  item.className = 'dynamic-item';
  item.innerHTML = `
    <div class="dynamic-item-fields">
      <div class="dynamic-item-row">
        <div class="sub-field">
          <div class="sub-field-label">이름</div>
          <input type="text" class="att-name" placeholder="홍길동" value="${esc(data.name || '')}" autocomplete="off" />
        </div>
        <div class="sub-field">
          <div class="sub-field-label">직책</div>
          <input type="text" class="att-role" placeholder="팀장" value="${esc(data.role || '')}" autocomplete="off" />
        </div>
      </div>
      <div class="sub-field">
        <div class="sub-field-label">역할</div>
        <input type="text" class="att-duty" placeholder="회의 주관 / 기록 / 참여" value="${esc(data.duty || '')}" autocomplete="off" />
      </div>
    </div>
    <button class="btn-remove" type="button" aria-label="삭제">✕</button>
  `;
  item.querySelector('.btn-remove').addEventListener('click', () => {
    item.remove();
    scheduleAutosave();
  });
  item.querySelectorAll('input').forEach(el =>
    el.addEventListener('input', scheduleAutosave)
  );
  return item;
}

/**
 * Create a simple single-text dynamic item (for discussions / decisions)
 */
function createTextItem(data = {}, placeholder = '') {
  const item = document.createElement('div');
  item.className = 'dynamic-item';
  item.innerHTML = `
    <div class="dynamic-item-fields">
      <textarea class="item-text" rows="2" placeholder="${esc(placeholder)}">${esc(data.text || '')}</textarea>
    </div>
    <button class="btn-remove" type="button" aria-label="삭제">✕</button>
  `;
  item.querySelector('.btn-remove').addEventListener('click', () => {
    item.remove();
    scheduleAutosave();
  });
  item.querySelector('textarea').addEventListener('input', scheduleAutosave);
  return item;
}

/**
 * Create an action item row (내용 / 담당자 / 마감일)
 */
function createActionItem(data = {}) {
  const item = document.createElement('div');
  item.className = 'dynamic-item';
  item.innerHTML = `
    <div class="dynamic-item-fields">
      <div class="sub-field">
        <div class="sub-field-label">내용</div>
        <textarea class="act-content" rows="2" placeholder="예) 기획서 최종본 작성">${esc(data.content || '')}</textarea>
      </div>
      <div class="dynamic-item-row">
        <div class="sub-field">
          <div class="sub-field-label">담당자</div>
          <input type="text" class="act-owner" placeholder="홍길동" value="${esc(data.owner || '')}" autocomplete="off" />
        </div>
        <div class="sub-field">
          <div class="sub-field-label">마감일</div>
          <input type="date" class="act-due" value="${esc(data.due || '')}" />
        </div>
      </div>
    </div>
    <button class="btn-remove" type="button" aria-label="삭제">✕</button>
  `;
  item.querySelector('.btn-remove').addEventListener('click', () => {
    item.remove();
    scheduleAutosave();
  });
  item.querySelectorAll('input, textarea').forEach(el =>
    el.addEventListener('input', scheduleAutosave)
  );
  return item;
}

// Add-button handlers
document.getElementById('add-attendee').addEventListener('click', () => {
  document.getElementById('attendees-list').appendChild(createAttendeeItem());
  scheduleAutosave();
  focusLast('attendees-list', '.att-name');
});

document.getElementById('add-discussion').addEventListener('click', () => {
  document.getElementById('discussions-list').appendChild(
    createTextItem({}, '예) 현재 개발 진행 상황 공유')
  );
  scheduleAutosave();
  focusLast('discussions-list', 'textarea');
});

document.getElementById('add-decision').addEventListener('click', () => {
  document.getElementById('decisions-list').appendChild(
    createTextItem({}, '예) 다음 주 목요일까지 베타 출시 진행')
  );
  scheduleAutosave();
  focusLast('decisions-list', 'textarea');
});

document.getElementById('add-action').addEventListener('click', () => {
  document.getElementById('actions-list').appendChild(createActionItem());
  scheduleAutosave();
  focusLast('actions-list', '.act-content');
});

function focusLast(listId, selector) {
  const list = document.getElementById(listId);
  const items = list.querySelectorAll(selector);
  if (items.length > 0) {
    const last = items[items.length - 1];
    last.focus();
    last.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// ── Core Form Fields Auto-save ─────────────────────────
['purpose', 'meeting-date', 'start-time', 'end-time', 'location', 'summary']
  .forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', scheduleAutosave);
  });

// ── LocalStorage ───────────────────────────────────────
function getFormData() {
  return {
    purpose:      getVal('purpose'),
    meetingDate:  getVal('meeting-date'),
    startTime:    getVal('start-time'),
    endTime:      getVal('end-time'),
    location:     getVal('location'),
    summary:      getVal('summary'),
    attendees:    collectAttendees(),
    discussions:  collectTextList('discussions-list'),
    decisions:    collectTextList('decisions-list'),
    actions:      collectActions(),
  };
}

function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function collectAttendees() {
  return [...document.querySelectorAll('#attendees-list .dynamic-item')].map(item => ({
    name:  item.querySelector('.att-name')?.value.trim() || '',
    role:  item.querySelector('.att-role')?.value.trim() || '',
    duty:  item.querySelector('.att-duty')?.value.trim() || '',
  }));
}

function collectTextList(listId) {
  return [...document.querySelectorAll(`#${listId} .dynamic-item`)].map(item => ({
    text: item.querySelector('.item-text')?.value.trim() || '',
  }));
}

function collectActions() {
  return [...document.querySelectorAll('#actions-list .dynamic-item')].map(item => ({
    content: item.querySelector('.act-content')?.value.trim() || '',
    owner:   item.querySelector('.act-owner')?.value.trim()   || '',
    due:     item.querySelector('.act-due')?.value            || '',
  }));
}

function saveToLocalStorage() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(getFormData()));
    showSaveIndicator();
  } catch (e) {
    console.warn('LocalStorage write failed:', e);
  }
}

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    restoreFormData(data);
  } catch (e) {
    console.warn('LocalStorage read failed:', e);
  }
}

function restoreFormData(data) {
  setVal('purpose',      data.purpose      || '');
  setVal('meeting-date', data.meetingDate  || '');
  setVal('start-time',   data.startTime    || '');
  setVal('end-time',     data.endTime      || '');
  setVal('location',     data.location     || '');
  setVal('summary',      data.summary      || '');

  const attendeesList  = document.getElementById('attendees-list');
  const discussionList = document.getElementById('discussions-list');
  const decisionsList  = document.getElementById('decisions-list');
  const actionsList    = document.getElementById('actions-list');

  attendeesList.innerHTML  = '';
  discussionList.innerHTML = '';
  decisionsList.innerHTML  = '';
  actionsList.innerHTML    = '';

  (data.attendees   || []).forEach(d => attendeesList.appendChild(createAttendeeItem(d)));
  (data.discussions || []).forEach(d => discussionList.appendChild(createTextItem(d, '예) 현재 개발 진행 상황 공유')));
  (data.decisions   || []).forEach(d => decisionsList.appendChild(createTextItem(d, '예) 다음 주 목요일까지 베타 출시 진행')));
  (data.actions     || []).forEach(d => actionsList.appendChild(createActionItem(d)));
}

function setVal(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

function scheduleAutosave() {
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(saveToLocalStorage, AUTOSAVE_DELAY);
}

function showSaveIndicator() {
  saveIndicator.classList.add('visible');
  clearTimeout(showSaveIndicator._timer);
  showSaveIndicator._timer = setTimeout(() => {
    saveIndicator.classList.remove('visible');
  }, 2000);
}

// ── Save / Reset Buttons ───────────────────────────────
function handleSave() {
  saveToLocalStorage();
  showToast('저장되었습니다 ✓', 'success');
}

function handleReset() {
  if (!confirm('모든 내용을 초기화할까요?\n작성한 내용이 모두 사라집니다.')) return;

  setVal('purpose',      '');
  setVal('meeting-date', '');
  setVal('start-time',   '');
  setVal('end-time',     '');
  setVal('location',     '');
  setVal('summary',      '');

  document.getElementById('attendees-list').innerHTML  = '';
  document.getElementById('discussions-list').innerHTML = '';
  document.getElementById('decisions-list').innerHTML  = '';
  document.getElementById('actions-list').innerHTML    = '';

  localStorage.removeItem(LS_KEY);
  switchTab('form');
  showToast('초기화되었습니다', 'success');
}

document.getElementById('btn-save').addEventListener('click', handleSave);
document.getElementById('btn-reset').addEventListener('click', handleReset);
document.getElementById('btn-bar-reset').addEventListener('click', handleReset);

// ── Preview Button ─────────────────────────────────────
document.getElementById('btn-preview').addEventListener('click', () => switchTab('preview'));

// ── Preview Renderer ───────────────────────────────────
function renderPreview() {
  const data = getFormData();
  const hasContent = data.purpose || data.meetingDate || data.attendees.length ||
    data.discussions.length || data.decisions.length || data.actions.length || data.summary;

  if (!hasContent) {
    previewContent.innerHTML = `
      <div class="preview-empty">
        <span class="preview-empty-icon">📄</span>
        <p class="preview-empty-text">
          입력 탭에서 회의 내용을 작성하면<br>여기에 미리보기가 표시됩니다.
        </p>
      </div>`;
    return;
  }

  previewContent.innerHTML = buildPreviewHTML(data);
}

function buildPreviewHTML(data) {
  const dateStr = formatDateKo(data.meetingDate);
  const timeStr = formatTimeRange(data.startTime, data.endTime);

  let html = `<div class="minutes-doc">`;
  html += `<div class="doc-title">📋 회의록</div>`;

  // 회의 목적
  if (data.purpose) {
    html += section('🎯 회의 목적', `<p class="section-text">${escHtml(data.purpose)}</p>`);
  }

  // 일시 및 장소
  if (data.meetingDate || data.startTime || data.endTime || data.location) {
    let meta = `<div class="meta-grid">`;
    if (dateStr) meta += `<span class="meta-label">날짜</span><span>${escHtml(dateStr)}</span>`;
    if (timeStr) meta += `<span class="meta-label">시간</span><span>${escHtml(timeStr)}</span>`;
    if (data.location) meta += `<span class="meta-label">장소</span><span>${escHtml(data.location)}</span>`;
    meta += `</div>`;
    html += section('📅 일시 및 장소', meta);
  }

  // 참석자
  const attendees = data.attendees.filter(a => a.name || a.role || a.duty);
  if (attendees.length > 0) {
    let tbl = `<div class="table-wrap"><table>
      <thead><tr><th>이름</th><th>직책</th><th>역할</th></tr></thead>
      <tbody>`;
    attendees.forEach(a => {
      tbl += `<tr>
        <td>${escHtml(a.name)}</td>
        <td>${escHtml(a.role)}</td>
        <td>${escHtml(a.duty)}</td>
      </tr>`;
    });
    tbl += `</tbody></table></div>`;
    html += section('👥 참석자', tbl);
  }

  // 주요 논의 내용
  const discussions = data.discussions.filter(d => d.text);
  if (discussions.length > 0) {
    html += section('💬 주요 논의 내용', bulletList(discussions.map(d => d.text)));
  }

  // 결정 사항
  const decisions = data.decisions.filter(d => d.text);
  if (decisions.length > 0) {
    html += section('✅ 결정 사항', bulletList(decisions.map(d => d.text)));
  }

  // 액션 아이템
  const actions = data.actions.filter(a => a.content || a.owner || a.due);
  if (actions.length > 0) {
    let tbl = `<div class="table-wrap"><table>
      <thead><tr><th>내용</th><th>담당자</th><th>마감일</th></tr></thead>
      <tbody>`;
    actions.forEach(a => {
      tbl += `<tr>
        <td>${escHtml(a.content)}</td>
        <td>${escHtml(a.owner)}</td>
        <td>${escHtml(formatDateKo(a.due))}</td>
      </tr>`;
    });
    tbl += `</tbody></table></div>`;
    html += section('⚡ 액션 아이템', tbl);
  }

  // 전체 요약
  if (data.summary) {
    html += section('📝 전체 요약', `<p class="section-text">${escHtml(data.summary)}</p>`);
  }

  html += `</div>`;
  return html;
}

function section(heading, bodyHTML) {
  return `
    <div class="doc-section">
      <div class="section-heading">${heading}</div>
      <div class="section-body">${bodyHTML}</div>
    </div>`;
}

function bulletList(items) {
  const lis = items.map(t => `<li>${escHtml(t)}</li>`).join('');
  return `<ul class="bullet-list">${lis}</ul>`;
}

// ── Plain-text Generator (for copy/share) ─────────────
function buildPlainText(data) {
  const lines = [];
  lines.push('===== 회의록 =====\n');

  if (data.purpose)     lines.push(`[회의 목적]\n${data.purpose}\n`);

  const dateStr = formatDateKo(data.meetingDate);
  const timeStr = formatTimeRange(data.startTime, data.endTime);
  if (dateStr || timeStr || data.location) {
    lines.push('[일시 및 장소]');
    if (dateStr)      lines.push(`날짜: ${dateStr}`);
    if (timeStr)      lines.push(`시간: ${timeStr}`);
    if (data.location) lines.push(`장소: ${data.location}`);
    lines.push('');
  }

  const attendees = data.attendees.filter(a => a.name || a.role || a.duty);
  if (attendees.length > 0) {
    lines.push('[참석자]');
    const colW = [12, 12, 20];
    lines.push(padRow(['이름', '직책', '역할'], colW));
    lines.push(padRow(['────', '────', '──────────────'], colW));
    attendees.forEach(a => lines.push(padRow([a.name, a.role, a.duty], colW)));
    lines.push('');
  }

  const discussions = data.discussions.filter(d => d.text);
  if (discussions.length > 0) {
    lines.push('[주요 논의 내용]');
    discussions.forEach(d => lines.push(`• ${d.text}`));
    lines.push('');
  }

  const decisions = data.decisions.filter(d => d.text);
  if (decisions.length > 0) {
    lines.push('[결정 사항]');
    decisions.forEach(d => lines.push(`• ${d.text}`));
    lines.push('');
  }

  const actions = data.actions.filter(a => a.content || a.owner || a.due);
  if (actions.length > 0) {
    lines.push('[액션 아이템]');
    const colW = [28, 12, 16];
    lines.push(padRow(['내용', '담당자', '마감일'], colW));
    lines.push(padRow(['──────────────────────────', '────', '──────────'], colW));
    actions.forEach(a =>
      lines.push(padRow([a.content, a.owner, formatDateKo(a.due)], colW))
    );
    lines.push('');
  }

  if (data.summary) lines.push(`[전체 요약]\n${data.summary}\n`);

  return lines.join('\n');
}

function padRow(cells, widths) {
  return cells.map((c, i) => (c || '').padEnd(widths[i] || 0)).join('  ');
}

// ── Copy & Share ───────────────────────────────────────
async function copyMinutes() {
  const data = getFormData();
  const text = buildPlainText(data);
  try {
    await navigator.clipboard.writeText(text);
    showToast('클립보드에 복사되었습니다 ✓', 'success');
  } catch {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity  = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast('클립보드에 복사되었습니다 ✓', 'success');
    } catch {
      showToast('복사에 실패했습니다. 직접 선택 후 복사해 주세요.', 'error');
    }
    document.body.removeChild(ta);
  }
}

async function shareMinutes() {
  const data = getFormData();
  const text = buildPlainText(data);
  const dateStr = formatDateKo(data.meetingDate);
  const title   = `회의록${dateStr ? ' — ' + dateStr : ''}`;

  if (navigator.share) {
    try {
      await navigator.share({ title, text });
    } catch (e) {
      if (e.name !== 'AbortError') {
        showToast('공유에 실패했습니다.', 'error');
      }
    }
  } else {
    // Fallback: copy instead
    await copyMinutes();
    showToast('공유를 지원하지 않는 환경입니다. 클립보드에 복사했습니다.', 'success');
  }
}

document.getElementById('btn-copy').addEventListener('click', copyMinutes);
document.getElementById('btn-share').addEventListener('click', shareMinutes);
document.getElementById('btn-bar-copy').addEventListener('click', copyMinutes);
document.getElementById('btn-bar-share').addEventListener('click', shareMinutes);

// ── Toast ──────────────────────────────────────────────
let toastTimer = null;
function showToast(msg, type = '') {
  toast.textContent = msg;
  toast.className = `toast${type ? ' ' + type : ''}`;
  clearTimeout(toastTimer);
  // Force reflow to restart animation if toast is already showing
  void toast.offsetWidth;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

// ── Date/Time Formatters ───────────────────────────────
function formatDateKo(isoDate) {
  if (!isoDate) return '';
  try {
    const [y, m, d] = isoDate.split('-');
    return `${y}년 ${parseInt(m, 10)}월 ${parseInt(d, 10)}일`;
  } catch {
    return isoDate;
  }
}

function formatTimeRange(start, end) {
  if (!start && !end) return '';
  if (start && end)  return `${start} – ${end}`;
  if (start)         return `${start} ~`;
  return `~ ${end}`;
}

// ── HTML Escape ────────────────────────────────────────
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── CSS hidden helper ──────────────────────────────────
// Add .hidden to action bars we want to hide dynamically
(function injectStyle() {
  const s = document.createElement('style');
  s.textContent = '.hidden { display: none !important; }';
  document.head.appendChild(s);
})();

// ── Service Worker Registration ────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.warn('SW registration failed:', err);
    });
  });
}

// ── Init ───────────────────────────────────────────────
(function init() {
  // Load saved data from localStorage
  loadFromLocalStorage();

  // Set today's date as default if none saved
  if (!document.getElementById('meeting-date').value) {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('meeting-date').value = today;
  }

  // Ensure at least one attendee row exists
  if (document.getElementById('attendees-list').children.length === 0) {
    document.getElementById('attendees-list').appendChild(createAttendeeItem());
  }

  // Ensure at least one discussion row exists
  if (document.getElementById('discussions-list').children.length === 0) {
    document.getElementById('discussions-list').appendChild(
      createTextItem({}, '예) 현재 개발 진행 상황 공유')
    );
  }
})();

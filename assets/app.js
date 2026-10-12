/* 体能小屋 · Train Your Body */
(function () {
  'use strict';

  const STORAGE_KEY = 'tyb_rein_v1';

  const PLANS = {
    A: {
      title: 'A · 推+核心',
      short: '推+核心',
      desc: '胸/肩/三头为主，收尾核心。健身房器械优先，动作可控、重量渐进。',
      tags: ['推', '核心', '胸肩'],
      colorClass: '',
      exercises: [
        { id: 'a1', name: '杠铃卧推 / 器械推胸', sets: '4 × 8–12', tip: '肩胛后收下沉，触胸即推；新手可用史密斯或器械' },
        { id: 'a2', name: '哑铃肩上推举', sets: '3 × 8–12', tip: '核心绷紧，避免过度仰腰' },
        { id: 'a3', name: '双杠臂屈伸 / 器械双杠', sets: '3 × 8–12', tip: '肘贴近身体，幅度可控；不够力可用辅助机' },
        { id: 'a4', name: '俯卧撑（辅助热身/力竭）', sets: '2 × 尽量多次', tip: '卧推后做，标准或跪姿均可' },
        { id: 'a5', name: '臀桥 / 髋推（器械或垫上）', sets: '3 × 12', tip: '顶峰收缩臀，别用腰硬顶' },
        { id: 'a6', name: '死虫 Dead Bug', sets: '3 × 8/侧', tip: '下背贴地，对侧手脚慢伸' },
        { id: 'a7', name: '平板支撑', sets: '3 × 20–40 秒', tip: '骨盆中立，臀微收，别塌腰' }
      ]
    },
    B: {
      title: 'B · 拉+核心（冲引体）',
      short: '拉+引体',
      desc: '背与拉力日，专攻引体向上进阶。优先：辅助引体机、高位下拉、绳索/坐姿划船。',
      tags: ['拉', '引体', '背'],
      colorClass: 'B',
      exercises: [
        { id: 'b1', name: '单杠悬垂（Dead Hang）', sets: '3 × 20–40 秒', tip: '肩下沉激活，握距略宽于肩' },
        { id: 'b2', name: '肩胛引体 Scapular Pull', sets: '3 × 8', tip: '手臂伸直，只做肩胛下沉上提' },
        { id: 'b3', name: '辅助引体机 / 弹力带引体', sets: '4 × 5–8', tip: '能做完整幅度优先；重量逐步减辅助' },
        { id: 'b4', name: '高位下拉 Lat Pulldown', sets: '3 × 8–12', tip: '肘向髋拉，下巴略过杠即可，别后仰猛甩' },
        { id: 'b5', name: '坐姿划船 / 绳索划船', sets: '3 × 8–12', tip: '替代桌下划船；胸挺、肩胛后收' },
        { id: 'b6', name: '离心引体（Negatives）', sets: '3 × 3–5', tip: '跳上或踩辅助到顶，再 3–5 秒慢下放' },
        { id: 'b7', name: '鸟狗 Bird Dog', sets: '3 × 8/侧', tip: '骨盆稳定，对侧手脚伸直停 1 秒' },
        { id: 'b8', name: '侧平板', sets: '2 × 20 秒/侧', tip: '肩肘垂直，髋上顶成一条线' }
      ]
    },
    C: {
      title: 'C · 腿+核心',
      short: '腿+核心',
      desc: '下肢力量日，腿举/深蹲/弓步为主，收尾核心。保护膝盖，动作质量优先。',
      tags: ['腿', '核心', '臀'],
      colorClass: 'C',
      exercises: [
        { id: 'c1', name: '杠铃深蹲 / 箱式深蹲 / 史密斯', sets: '4 × 8–10', tip: '膝朝脚尖方向，深度舒适即可' },
        { id: 'c2', name: '腿举 Leg Press', sets: '3 × 10–12', tip: '下背贴靠垫，别完全锁死膝盖' },
        { id: 'c3', name: '弓步蹲 / 保加利亚分腿蹲', sets: '3 × 8/腿', tip: '哑铃或史密斯；前膝稳定不内扣' },
        { id: 'c4', name: '腿弯举 / 罗马尼亚硬拉（轻）', sets: '3 × 10–12', tip: '腘绳肌与臀链；RDL 保持背直' },
        { id: 'c5', name: '臀桥 / 器械髋推', sets: '3 × 12', tip: '顶峰挤臀 1 秒' },
        { id: 'c6', name: '死虫 或 卷腹', sets: '3 × 10', tip: '任选其一，质量优先' },
        { id: 'c7', name: '平板支撑', sets: '3 组', tip: '20–40 秒，或力竭前停' }
      ]
    },
    R: {
      title: '有氧恢复日',
      short: '有氧',
      desc: '快走、慢跑、椭圆机或动感单车 30–40 分钟，心率舒适可交谈。每周建议 2 次。',
      tags: ['有氧', '恢复'],
      colorClass: 'R',
      exercises: [
        { id: 'r1', name: '快走 / 慢跑 / 椭圆机', sets: '30–40 分钟', tip: '中低强度，别影响次日力量' },
        { id: 'r2', name: '轻度核心或拉伸', sets: '5–10 分钟', tip: '髋屈肌、胸椎、腘绳肌放松' }
      ]
    }
  };

  const PULL_STAGES = [
    { id: 0, title: '悬垂稳定', tip: '单杠死挂 30–40 秒 ×3，肩下沉不耸肩' },
    { id: 1, title: '肩胛激活', tip: 'Scapular pull 能轻松做 8–10 次 ×3' },
    { id: 2, title: '辅助 / 离心', tip: '辅助引体机或弹力带 5–8 次；或慢下放 3–5 秒' },
    { id: 3, title: '完整引体', tip: '标准引体至少 1–3 个，再冲击 5+' }
  ];

  const DEFAULTS = {
    profile: {
      name: 'Rein',
      height: 174.5,
      bmr: 1750,
      goalWeight: 77,
      goalFat: 20,
      startWeight: 87.3,
      startFat: 26.8
    },
    metrics: [
      { date: '2026-10-12', weight: 87.3, fat: 26.8, muscle: 60.6, visceral: 14 }
    ],
    workouts: [],
    checks: {},
    progress: {
      pullStage: 0,
      hangSec: 0,
      pullups: 0,
      plankSec: 0,
      sidePlankSec: 0
    },
    chartMode: 'weight',
    lastPlan: null
  };

  const CHECK_SVG = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-6"/></svg>';

  function cssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function todayStr() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(DEFAULTS);
      const data = JSON.parse(raw);
      return {
        ...structuredClone(DEFAULTS),
        ...data,
        profile: { ...DEFAULTS.profile, ...(data.profile || {}) },
        progress: { ...DEFAULTS.progress, ...(data.progress || {}) },
        metrics: Array.isArray(data.metrics) && data.metrics.length ? data.metrics : structuredClone(DEFAULTS.metrics),
        workouts: Array.isArray(data.workouts) ? data.workouts : [],
        checks: data.checks || {}
      };
    } catch (e) {
      return structuredClone(DEFAULTS);
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  let state = load();
  let currentPlan = suggestPlan();

  function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('on');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('on'), 2200);
  }

  function latestMetric() {
    if (!state.metrics.length) return null;
    return [...state.metrics].sort((a, b) => a.date.localeCompare(b.date)).at(-1);
  }

  function calcStreak() {
    const days = new Set(state.workouts.map(w => w.date));
    let streak = 0;
    const d = new Date();
    const t = todayStr();
    if (!days.has(t)) d.setDate(d.getDate() - 1);
    while (true) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const key = y + '-' + m + '-' + day;
      if (days.has(key)) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    return streak;
  }

  function weekBounds() {
    const now = new Date();
    const day = (now.getDay() + 6) % 7;
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(now.getDate() - day);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      days.push({
        key: y + '-' + m + '-' + dd,
        label: ['一', '二', '三', '四', '五', '六', '日'][i],
        dateNum: d.getDate(),
        isToday: y + '-' + m + '-' + dd === todayStr()
      });
    }
    return days;
  }

  function suggestPlan() {
    const t = todayStr();
    const todayW = state.workouts.find(w => w.date === t);
    if (todayW) return todayW.plan;
    if (state.lastPlan && state.lastPlan.date === t) return state.lastPlan.plan;

    const week = weekBounds().map(d => d.key);
    const weekWorkouts = state.workouts.filter(w => week.includes(w.date));
    const order = ['A', 'B', 'C'];
    const last = [...state.workouts].sort((a, b) => a.date.localeCompare(b.date)).at(-1);
    if (!last) return 'A';
    const cardioCount = weekWorkouts.filter(w => w.plan === 'R').length;
    const lastIdx = order.indexOf(last.plan);
    if (last.plan === 'R') {
      const lastStrength = [...state.workouts].reverse().find(w => order.includes(w.plan));
      if (!lastStrength) return 'A';
      const i = order.indexOf(lastStrength.plan);
      return order[(i + 1) % 3];
    }
    if (cardioCount < 2 && weekWorkouts.length >= 2) {
      const recent = weekWorkouts.slice(-2);
      if (recent.every(w => order.includes(w.plan))) {
        if (last.plan === 'C') return 'R';
      }
    }
    if (lastIdx >= 0) return order[(lastIdx + 1) % 3];
    return 'A';
  }

  function tagClass(plan) {
    if (plan === 'B') return 'blue';
    if (plan === 'C') return 'orange';
    if (plan === 'R') return 'muted';
    return 'green';
  }

  function switchView(name) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + name).classList.add('active');
    document.querySelectorAll('.tabbar button').forEach(b => {
      b.classList.toggle('on', b.dataset.view === name);
    });
    if (name === 'home') renderHome();
    if (name === 'workout') renderWorkout();
    if (name === 'metrics') renderMetrics();
    if (name === 'progress') renderProgress();
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  function renderHome() {
    currentPlan = suggestPlan();
    const plan = PLANS[currentPlan];
    const streak = calcStreak();
    document.getElementById('streakChip').innerHTML =
      '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v3M8 6.5c-2.5 1.5-4 4-4 7a8 8 0 0016 0c0-3-1.5-5.5-4-7M9 14h6"/></svg>' +
      '连续 <strong>' + streak + '</strong> 天';

    document.getElementById('todayLetter').textContent = currentPlan;
    document.getElementById('todayLetter').className = 'letter ' + (plan.colorClass || '');
    document.getElementById('todayTitle').textContent = plan.title;
    document.getElementById('todayDesc').textContent = plan.desc;
    document.getElementById('todayTags').innerHTML = plan.tags.map(t =>
      '<span class="tag ' + tagClass(currentPlan) + '">' + t + '</span>'
    ).join('');

    const m = latestMetric();
    if (m) {
      document.getElementById('statWeight').innerHTML = m.weight + '<span class="unit">kg</span>';
      document.getElementById('statFat').innerHTML = (m.fat != null ? m.fat : '—') + '<span class="unit">%</span>';
      document.getElementById('statMuscle').innerHTML = (m.muscle != null ? m.muscle : '—') + '<span class="unit">kg</span>';
    }

    const startW = state.profile.startWeight;
    const goalW = state.profile.goalWeight;
    const startF = state.profile.startFat;
    const goalF = state.profile.goalFat;
    const curW = m ? m.weight : startW;
    const curF = m && m.fat != null ? m.fat : startF;
    const wDone = Math.min(100, Math.max(0, ((startW - curW) / (startW - goalW)) * 100));
    const fDone = Math.min(100, Math.max(0, ((startF - curF) / (startF - goalF)) * 100));
    document.getElementById('wProgBar').style.width = wDone.toFixed(1) + '%';
    document.getElementById('fProgBar').style.width = fDone.toFixed(1) + '%';
    document.getElementById('wProgText').textContent = curW + ' → ' + goalW + ' kg';
    document.getElementById('fProgText').textContent = curF + '% → ' + goalF + '%';

    const map = {};
    state.workouts.forEach(w => { map[w.date] = w.plan; });
    const grid = document.getElementById('weekGrid');
    grid.innerHTML = weekBounds().map(d => {
      const planCode = map[d.key];
      const cls = planCode ? 'done' + planCode : '';
      return '<div class="day-cell ' + cls + (d.isToday ? ' today' : '') + '">' +
        '<div class="d">周' + d.label + '</div>' +
        '<div class="mark">' + (planCode || d.dateNum) + '</div></div>';
    }).join('');
  }

  function getChecks(plan) {
    const key = todayStr() + '_' + plan;
    if (!state.checks[key]) state.checks[key] = {};
    return state.checks[key];
  }

  function renderWorkout() {
    const plan = PLANS[currentPlan];
    document.querySelectorAll('#planSeg button').forEach(b => {
      b.classList.toggle('on', b.dataset.plan === currentPlan);
    });
    document.getElementById('planTitle').textContent = plan.title;
    document.getElementById('planDesc').textContent = plan.desc;
    const checks = getChecks(currentPlan);
    const list = document.getElementById('exerciseList');
    list.innerHTML = plan.exercises.map(ex => {
      const done = !!checks[ex.id];
      return '<div class="ex-item' + (done ? ' done' : '') + '" data-id="' + ex.id + '">' +
        '<div class="check">' + (done ? CHECK_SVG : '') + '</div>' +
        '<div class="ex-meta"><div class="name">' + ex.name + '</div>' +
        '<div class="sets">' + ex.sets + '</div>' +
        '<div class="tip">' + ex.tip + '</div></div></div>';
    }).join('');

    list.querySelectorAll('.ex-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        const c = getChecks(currentPlan);
        c[id] = !c[id];
        save();
        renderWorkout();
      });
    });

    const existing = state.workouts.find(w => w.date === todayStr() && w.plan === currentPlan);
    document.getElementById('workoutNote').value = existing ? (existing.note || '') : '';
  }

  function completeWorkout() {
    const note = document.getElementById('workoutNote').value.trim();
    const checks = getChecks(currentPlan);
    const plan = PLANS[currentPlan];
    const doneCount = plan.exercises.filter(e => checks[e.id]).length;
    const idx = state.workouts.findIndex(w => w.date === todayStr());
    const entry = {
      date: todayStr(),
      plan: currentPlan,
      note,
      doneCount,
      total: plan.exercises.length,
      at: new Date().toISOString()
    };
    if (idx >= 0) state.workouts[idx] = entry;
    else state.workouts.push(entry);
    state.lastPlan = { date: todayStr(), plan: currentPlan };
    save();
    toast('已保存 · ' + plan.short + '（' + doneCount + '/' + plan.exercises.length + '）');
    switchView('home');
  }

  function renderMetrics() {
    const m = latestMetric();
    if (m) {
      document.getElementById('inWeight').value = m.weight;
      document.getElementById('inFat').value = m.fat != null ? m.fat : '';
      document.getElementById('inVisceral').value = m.visceral != null ? m.visceral : '';
      document.getElementById('inMuscle').value = m.muscle != null ? m.muscle : '';
    }
    document.getElementById('cfgHeight').value = state.profile.height;
    document.getElementById('cfgGoalW').value = state.profile.goalWeight;
    document.getElementById('cfgGoalF').value = state.profile.goalFat;
    document.getElementById('cfgBmr').value = state.profile.bmr;

    const hist = [...state.metrics].sort((a, b) => b.date.localeCompare(a.date));
    const box = document.getElementById('metricsHistory');
    if (!hist.length) box.innerHTML = '<div class="empty">暂无记录</div>';
    else box.innerHTML = hist.slice(0, 12).map(h =>
      '<div class="list-item"><span>' + h.date + '</span><span>' +
      h.weight + ' kg · 体脂 ' + (h.fat != null ? h.fat + '%' : '—') +
      (h.visceral != null ? ' · 内脏 ' + h.visceral : '') +
      '</span></div>'
    ).join('');

    document.getElementById('chartW').classList.toggle('on', state.chartMode === 'weight');
    document.getElementById('chartF').classList.toggle('on', state.chartMode === 'fat');
    drawChart();
  }

  function drawChart() {
    const canvas = document.getElementById('metricsChart');
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const key = state.chartMode === 'fat' ? 'fat' : 'weight';
    const pts = [...state.metrics]
      .filter(m => m[key] != null)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14);

    document.getElementById('chartHint').textContent =
      pts.length < 2 ? '至少 2 条记录后显示趋势' :
      (key === 'weight' ? '体重趋势（近 ' + pts.length + ' 次）' : '体脂趋势（近 ' + pts.length + ' 次）');

    const muted = cssVar('--tx3', '#8c8279');
    const line = cssVar('--line2', 'rgba(96,80,64,.09)');
    const color = key === 'fat' ? cssVar('--blue', '#6f8494') : cssVar('--dn', '#6a8b72');

    if (pts.length < 2) {
      ctx.fillStyle = muted;
      ctx.font = '13px ' + cssVar('--font', 'sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('数据不足', w / 2, h / 2);
      return;
    }

    const vals = pts.map(p => p[key]);
    const min = Math.min(...vals) - 0.5;
    const max = Math.max(...vals) + 0.5;
    const pad = { l: 36, r: 10, t: 14, b: 24 };
    const iw = w - pad.l - pad.r;
    const ih = h - pad.t - pad.b;

    ctx.strokeStyle = line;
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const y = pad.t + (ih / 3) * i;
      ctx.beginPath();
      ctx.moveTo(pad.l, y);
      ctx.lineTo(w - pad.r, y);
      ctx.stroke();
    }

    // soft fill under line
    ctx.beginPath();
    pts.forEach((p, i) => {
      const x = pad.l + (iw * i) / (pts.length - 1);
      const y = pad.t + ih - ((p[key] - min) / (max - min)) * ih;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    const lastX = pad.l + iw;
    const firstX = pad.l;
    ctx.lineTo(lastX, pad.t + ih);
    ctx.lineTo(firstX, pad.t + ih);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.12;
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.beginPath();
    pts.forEach((p, i) => {
      const x = pad.l + (iw * i) / (pts.length - 1);
      const y = pad.t + ih - ((p[key] - min) / (max - min)) * ih;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    pts.forEach((p, i) => {
      const x = pad.l + (iw * i) / (pts.length - 1);
      const y = pad.t + ih - ((p[key] - min) / (max - min)) * ih;
      ctx.beginPath();
      ctx.arc(x, y, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = cssVar('--card', '#fbf9f6');
      ctx.fill();
    });

    ctx.fillStyle = muted;
    ctx.font = '10px ' + cssVar('--font', 'sans-serif');
    ctx.textAlign = 'left';
    ctx.fillText(max.toFixed(1), 4, pad.t + 4);
    ctx.fillText(min.toFixed(1), 4, pad.t + ih);
    ctx.textAlign = 'center';
    ctx.fillText(pts[0].date.slice(5), pad.l, h - 6);
    ctx.fillText(pts[pts.length - 1].date.slice(5), pad.l + iw, h - 6);
  }

  function saveMetrics() {
    const weight = parseFloat(document.getElementById('inWeight').value);
    const fat = parseFloat(document.getElementById('inFat').value);
    const visceral = parseFloat(document.getElementById('inVisceral').value);
    const muscle = parseFloat(document.getElementById('inMuscle').value);
    if (!weight || isNaN(weight)) {
      toast('请填写体重');
      return;
    }
    const entry = {
      date: todayStr(),
      weight,
      fat: isNaN(fat) ? null : fat,
      visceral: isNaN(visceral) ? null : visceral,
      muscle: isNaN(muscle) ? null : muscle
    };
    const idx = state.metrics.findIndex(m => m.date === entry.date);
    if (idx >= 0) state.metrics[idx] = entry;
    else state.metrics.push(entry);
    save();
    toast('体测已保存');
    renderMetrics();
    renderHome();
  }

  function renderProgress() {
    const stageBox = document.getElementById('pullStages');
    const cur = state.progress.pullStage || 0;
    stageBox.innerHTML = PULL_STAGES.map(s => {
      let cls = '';
      if (s.id < cur) cls = 'done';
      else if (s.id === cur) cls = 'active';
      return '<div class="stage-item ' + cls + '" data-stage="' + s.id + '">' +
        '<div class="stage-dot">' + (s.id < cur ? '✓' : (s.id + 1)) + '</div>' +
        '<div><div style="font-weight:500;font-size:14px">' + s.title + '</div>' +
        '<div class="muted" style="font-size:12px;margin:0">' + s.tip + '</div></div></div>';
    }).join('');

    stageBox.querySelectorAll('.stage-item').forEach(el => {
      el.addEventListener('click', () => {
        state.progress.pullStage = parseInt(el.dataset.stage, 10);
        save();
        renderProgress();
        toast('当前阶段：' + PULL_STAGES[state.progress.pullStage].title);
      });
    });

    document.getElementById('inHang').value = state.progress.hangSec || '';
    document.getElementById('inPullups').value = state.progress.pullups || '';
    document.getElementById('inPlank').value = state.progress.plankSec || '';
    document.getElementById('inSidePlank').value = state.progress.sidePlankSec || '';
    document.getElementById('prHang').innerHTML = (state.progress.hangSec || 0) + '<span class="unit">s</span>';
    document.getElementById('prPlank').innerHTML = (state.progress.plankSec || 0) + '<span class="unit">s</span>';
    document.getElementById('statTotal').textContent = state.workouts.length;
    const weekKeys = new Set(weekBounds().map(d => d.key));
    document.getElementById('statWeek').textContent = state.workouts.filter(w => weekKeys.has(w.date)).length;
    document.getElementById('statStreak').textContent = calcStreak();
  }

  // Events
  document.querySelectorAll('.tabbar button').forEach(b => {
    b.addEventListener('click', () => switchView(b.dataset.view));
  });
  document.getElementById('btnStartWorkout').addEventListener('click', () => {
    currentPlan = suggestPlan();
    switchView('workout');
  });
  document.querySelectorAll('#planSeg button').forEach(b => {
    b.addEventListener('click', () => {
      currentPlan = b.dataset.plan;
      state.lastPlan = { date: todayStr(), plan: currentPlan };
      save();
      renderWorkout();
    });
  });
  document.getElementById('btnCompleteWorkout').addEventListener('click', completeWorkout);
  document.getElementById('btnResetChecks').addEventListener('click', () => {
    state.checks[todayStr() + '_' + currentPlan] = {};
    save();
    renderWorkout();
    toast('已重置勾选');
  });
  document.getElementById('btnSaveMetrics').addEventListener('click', saveMetrics);
  document.getElementById('chartW').addEventListener('click', () => { state.chartMode = 'weight'; save(); renderMetrics(); });
  document.getElementById('chartF').addEventListener('click', () => { state.chartMode = 'fat'; save(); renderMetrics(); });
  document.getElementById('btnSaveCfg').addEventListener('click', () => {
    state.profile.height = parseFloat(document.getElementById('cfgHeight').value) || state.profile.height;
    state.profile.goalWeight = parseFloat(document.getElementById('cfgGoalW').value) || state.profile.goalWeight;
    state.profile.goalFat = parseFloat(document.getElementById('cfgGoalF').value) || state.profile.goalFat;
    state.profile.bmr = parseFloat(document.getElementById('cfgBmr').value) || state.profile.bmr;
    save();
    toast('设定已保存');
    renderHome();
  });
  document.getElementById('btnSavePull').addEventListener('click', () => {
    const hang = parseInt(document.getElementById('inHang').value, 10);
    const pu = parseInt(document.getElementById('inPullups').value, 10);
    if (!isNaN(hang)) state.progress.hangSec = Math.max(state.progress.hangSec || 0, hang);
    if (!isNaN(pu)) state.progress.pullups = Math.max(state.progress.pullups || 0, pu);
    if ((state.progress.pullups || 0) >= 1) state.progress.pullStage = Math.max(state.progress.pullStage, 3);
    else if ((state.progress.hangSec || 0) >= 30 && state.progress.pullStage < 1) state.progress.pullStage = 1;
    save();
    renderProgress();
    toast('引体数据已更新');
  });
  document.getElementById('btnSaveCore').addEventListener('click', () => {
    const p = parseInt(document.getElementById('inPlank').value, 10);
    const s = parseInt(document.getElementById('inSidePlank').value, 10);
    if (!isNaN(p)) state.progress.plankSec = Math.max(state.progress.plankSec || 0, p);
    if (!isNaN(s)) state.progress.sidePlankSec = Math.max(state.progress.sidePlankSec || 0, s);
    save();
    renderProgress();
    toast('核心数据已更新');
  });
  document.getElementById('btnExport').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'train-your-body-backup-' + todayStr() + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
    toast('已导出备份');
  });
  document.getElementById('btnImport').addEventListener('click', () => {
    document.getElementById('importFile').click();
  });
  document.getElementById('importFile').addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data || typeof data !== 'object') throw new Error('bad');
        state = {
          ...structuredClone(DEFAULTS),
          ...data,
          profile: { ...DEFAULTS.profile, ...(data.profile || {}) },
          progress: { ...DEFAULTS.progress, ...(data.progress || {}) },
          metrics: Array.isArray(data.metrics) ? data.metrics : structuredClone(DEFAULTS.metrics),
          workouts: Array.isArray(data.workouts) ? data.workouts : [],
          checks: data.checks || {}
        };
        save();
        currentPlan = suggestPlan();
        renderHome();
        toast('导入成功');
      } catch (err) {
        toast('导入失败：JSON 无效');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });
  document.getElementById('btnClearData').addEventListener('click', () => {
    if (!confirm('确定清空全部本地数据？此操作不可撤销。')) return;
    localStorage.removeItem(STORAGE_KEY);
    state = structuredClone(DEFAULTS);
    currentPlan = 'A';
    renderHome();
    toast('已清空并恢复默认基线');
  });

  window.addEventListener('resize', () => {
    if (document.getElementById('view-metrics').classList.contains('active')) drawChart();
  });
  window.addEventListener('scroll', () => {
    document.body.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

  // theme-color follows scheme
  function syncThemeColor() {
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? '#1c1a18' : '#f3efe9';
  }
  syncThemeColor();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncThemeColor);

  renderHome();
})();

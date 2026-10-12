/* 体能小屋 · Train Your Body */
(function () {
  'use strict';

  const STORAGE_KEY = 'tyb_rein_v1';
  const KCAL_CIRC = 2 * Math.PI * 52; // ~326.73
  const WATER_TICKS = 4;

  const PLANS = {
    A: {
      title: 'A · 推+核心',
      short: '推+核心',
      desc: '胸/肩/三头为主，收尾核心。健身房器械优先，动作可控、重量渐进。',
      tags: ['推', '核心', '胸肩'],
      colorClass: '',
      exercises: [
        { id: 'a1', name: '杠铃卧推 / 器械推胸', sets: '4 × 8–12', setCount: 4, tip: '肩胛后收下沉，触胸即推；新手可用史密斯或器械' },
        { id: 'a2', name: '哑铃肩上推举', sets: '3 × 8–12', setCount: 3, tip: '核心绷紧，避免过度仰腰' },
        { id: 'a3', name: '双杠臂屈伸 / 器械双杠', sets: '3 × 8–12', setCount: 3, tip: '肘贴近身体，幅度可控；不够力可用辅助机' },
        { id: 'a4', name: '俯卧撑（辅助热身/力竭）', sets: '2 × 尽量多次', setCount: 2, tip: '卧推后做，标准或跪姿均可' },
        { id: 'a5', name: '臀桥 / 髋推（器械或垫上）', sets: '3 × 12', setCount: 3, tip: '顶峰收缩臀，别用腰硬顶' },
        { id: 'a6', name: '死虫 Dead Bug', sets: '3 × 8/侧', setCount: 3, tip: '下背贴地，对侧手脚慢伸' },
        { id: 'a7', name: '平板支撑', sets: '3 × 20–40 秒', setCount: 3, tip: '骨盆中立，臀微收，别塌腰' }
      ]
    },
    B: {
      title: 'B · 拉+核心（冲引体）',
      short: '拉+引体',
      desc: '背与拉力日，专攻引体向上进阶。优先：辅助引体机、高位下拉、绳索/坐姿划船。',
      tags: ['拉', '引体', '背'],
      colorClass: 'B',
      exercises: [
        { id: 'b1', name: '单杠悬垂（Dead Hang）', sets: '3 × 20–40 秒', setCount: 3, tip: '肩下沉激活，握距略宽于肩' },
        { id: 'b2', name: '肩胛引体 Scapular Pull', sets: '3 × 8', setCount: 3, tip: '手臂伸直，只做肩胛下沉上提' },
        { id: 'b3', name: '辅助引体机 / 弹力带引体', sets: '4 × 5–8', setCount: 4, tip: '能做完整幅度优先；重量逐步减辅助' },
        { id: 'b4', name: '高位下拉 Lat Pulldown', sets: '3 × 8–12', setCount: 3, tip: '肘向髋拉，下巴略过杠即可，别后仰猛甩' },
        { id: 'b5', name: '坐姿划船 / 绳索划船', sets: '3 × 8–12', setCount: 3, tip: '替代桌下划船；胸挺、肩胛后收' },
        { id: 'b6', name: '离心引体（Negatives）', sets: '3 × 3–5', setCount: 3, tip: '跳上或踩辅助到顶，再 3–5 秒慢下放' },
        { id: 'b7', name: '鸟狗 Bird Dog', sets: '3 × 8/侧', setCount: 3, tip: '骨盆稳定，对侧手脚伸直停 1 秒' },
        { id: 'b8', name: '侧平板', sets: '2 × 20 秒/侧', setCount: 2, tip: '肩肘垂直，髋上顶成一条线' }
      ]
    },
    C: {
      title: 'C · 腿+核心',
      short: '腿+核心',
      desc: '下肢力量日，腿举/深蹲/弓步为主，收尾核心。保护膝盖，动作质量优先。',
      tags: ['腿', '核心', '臀'],
      colorClass: 'C',
      exercises: [
        { id: 'c1', name: '杠铃深蹲 / 箱式深蹲 / 史密斯', sets: '4 × 8–10', setCount: 4, tip: '膝朝脚尖方向，深度舒适即可' },
        { id: 'c2', name: '腿举 Leg Press', sets: '3 × 10–12', setCount: 3, tip: '下背贴靠垫，别完全锁死膝盖' },
        { id: 'c3', name: '弓步蹲 / 保加利亚分腿蹲', sets: '3 × 8/腿', setCount: 3, tip: '哑铃或史密斯；前膝稳定不内扣' },
        { id: 'c4', name: '腿弯举 / 罗马尼亚硬拉（轻）', sets: '3 × 10–12', setCount: 3, tip: '腘绳肌与臀链；RDL 保持背直' },
        { id: 'c5', name: '臀桥 / 器械髋推', sets: '3 × 12', setCount: 3, tip: '顶峰挤臀 1 秒' },
        { id: 'c6', name: '死虫 或 卷腹', sets: '3 × 10', setCount: 3, tip: '任选其一，质量优先' },
        { id: 'c7', name: '平板支撑', sets: '3 组', setCount: 3, tip: '20–40 秒，或力竭前停' }
      ]
    },
    R: {
      title: '有氧恢复日',
      short: '有氧',
      desc: '快走、慢跑、椭圆机或动感单车 30–40 分钟，心率舒适可交谈。目标消耗约 300 kcal。',
      tags: ['有氧', '恢复'],
      colorClass: 'R',
      exercises: [
        { id: 'r1', name: '快走 / 慢跑 / 椭圆机', sets: '30–40 分钟 · ~300 kcal', setCount: 1, tip: '中低强度，别影响次日力量' },
        { id: 'r2', name: '轻度核心或拉伸', sets: '5–10 分钟', setCount: 1, tip: '髋屈肌、胸椎、腘绳肌放松' }
      ]
    },
    X: {
      title: '休息日',
      short: '休息',
      desc: '主动恢复：睡眠、散步、拉伸。饮食与饮水照常打卡，不必进健身房。',
      tags: ['休息', '恢复'],
      colorClass: 'R',
      exercises: []
    }
  };

  /* ===== Meal catalog & picker ===== */
  const RICE_ADDON = { id: 'addon-rice', name: '米饭（主食搭配）', kcal: 200, protein: 4 };
  const PROTEIN_ADDONS = [
    { id: 'eggs', name: '鸡蛋×2', protein: 12, kcal: 140 },
    { id: 'yogurt', name: '无糖酸奶', protein: 10, kcal: 80 },
    { id: 'powder', name: '蛋白粉一勺', protein: 20, kcal: 100 }
  ];
  const LOW_PROTEIN_BF_IDS = ['bf-aircook', 'bf-zajiang'];
  const LOW_PROTEIN_BF_G = 25;
  const MEAL_SLOTS = [
    { id: 'breakfast', name: '早餐', required: true, mode: 'single', source: 'breakfast', max: 1 },
    { id: 'lunch', name: '午餐', required: true, mode: 'multi', source: 'lunchDinner', max: 2, allowRice: true },
    { id: 'dinner', name: '晚餐', required: true, mode: 'multi', source: 'lunchDinner', max: 2, allowRice: true },
    { id: 'snack', name: '加餐 / 饮品', required: false, mode: 'multi', source: 'drinks', max: 2 }
  ];

  const FALLBACK_CATALOG = {"version":1,"updatedAt":"2026-10-11T04:49:53.358Z","breakfast":[{"id":"bf-jiaozi","name":"饺子","kcal":520,"protein":22,"note":"约一盘/一袋速冻煮熟","category":"早餐","source":"常用","meal":"breakfast"},{"id":"bf-sanjin","name":"三津汤包盲盒套餐","kcal":480,"protein":20,"note":"两包子+烧卖+豆浆","category":"早餐","source":"常用","meal":"breakfast"},{"id":"bf-aircook","name":"空刻意面","kcal":650,"protein":18,"note":"整份意面（看包装略浮动）","category":"早餐","source":"常用","meal":"breakfast"},{"id":"bf-zajiang","name":"楼下粉面馆·杂酱面","kcal":620,"protein":24,"note":"","category":"早餐","source":"常用","meal":"breakfast"},{"id":"bf-lajiao","name":"楼下粉面馆·辣椒炒肉粉","kcal":680,"protein":28,"note":"","category":"早餐","source":"常用","meal":"breakfast"}],"lunchDinner":[{"id":"seed-01","name":"辣椒炒肉","category":"荤菜炒菜","rating":3,"kcal":420,"protein":32,"source":"小锅小灶","meal":"lunch_dinner"},{"id":"seed-02","name":"韭黄炒蛋炒肉","category":"荤菜炒菜","rating":4,"kcal":420,"protein":32,"source":"小锅小灶","meal":"lunch_dinner"},{"id":"seed-03","name":"农家一碗香","category":"荤菜炒菜","rating":2.5,"kcal":420,"protein":32,"source":"小锅小灶","meal":"lunch_dinner"},{"id":"seed-04","name":"生烧排骨","category":"荤菜炒菜","rating":4,"kcal":480,"protein":30,"source":"小锅小灶","meal":"lunch_dinner"},{"id":"seed-05","name":"西芹炒牛肉","category":"荤菜炒菜","rating":3.5,"kcal":420,"protein":32,"source":"小锅小灶","meal":"lunch_dinner"},{"id":"seed-06","name":"香菜泡椒牛肉","category":"荤菜炒菜","rating":3,"kcal":420,"protein":32,"source":"小锅小灶","meal":"lunch_dinner"},{"id":"seed-07","name":"豪牌鸡公煲","category":"荤菜炒菜","rating":2.5,"kcal":420,"protein":32,"source":"小锅小灶","meal":"lunch_dinner"},{"id":"seed-08","name":"衡阳茶油小炒鸡","category":"荤菜炒菜","rating":2.5,"kcal":420,"protein":32,"source":"小锅小灶","meal":"lunch_dinner"},{"id":"seed-09","name":"临沂炒鸡","category":"荤菜炒菜","rating":3.5,"kcal":420,"protein":32,"source":"小锅小灶","meal":"lunch_dinner"},{"id":"seed-10","name":"可乐鸡翅","category":"荤菜炒菜","rating":4,"kcal":5,"protein":0,"source":"小锅小灶","meal":"lunch_dinner"},{"id":"seed-11","name":"红烧肉","category":"荤菜炒菜","rating":4,"kcal":550,"protein":28,"source":"小锅小灶","meal":"lunch_dinner"},{"id":"seed-12","name":"丝瓜蛋汤","category":"小菜素菜","rating":3,"kcal":150,"protein":10,"source":"小锅小灶","meal":"lunch_dinner"},{"id":"seed-13","name":"炒时蔬","category":"小菜素菜","rating":2.5,"kcal":90,"protein":3,"source":"小锅小灶","meal":"lunch_dinner"},{"id":"seed-14","name":"豪牌炒方便面","category":"特色主食","rating":3,"kcal":520,"protein":16,"source":"小锅小灶","meal":"lunch_dinner"},{"id":"seed-15","name":"豪牌蛋炒饭","category":"特色主食","rating":3,"kcal":520,"protein":16,"source":"小锅小灶","meal":"lunch_dinner"},{"id":"d-muzcmww1-mx3h1j","name":"罐焖牛肉（隋坡版）","category":"荤菜炒菜","rating":3.5,"kcal":420,"protein":32,"source":"小锅小灶","meal":"lunch_dinner"},{"id":"d-mv3bi83c-06dz47","name":"青椒炒肉","category":"荤菜炒菜","rating":3.5,"kcal":420,"protein":32,"source":"小锅小灶","meal":"lunch_dinner"}],"drinks":[{"id":"seed-16","name":"胖东来葡萄汁","category":"饮品","rating":3.5,"kcal":90,"protein":1,"source":"小锅小灶","meal":"drink"},{"id":"seed-17","name":"胖东来橙汁","category":"饮品","rating":2.5,"kcal":90,"protein":1,"source":"小锅小灶","meal":"drink"},{"id":"seed-18","name":"港版可乐","category":"饮品","rating":3,"kcal":5,"protein":0,"source":"小锅小灶","meal":"drink"},{"id":"seed-19","name":"保拉纳白啤","category":"饮品","rating":3,"kcal":80,"protein":1,"source":"小锅小灶","meal":"drink"}],"note":"热量/蛋白为估测，仅供打卡参考"};

  let mealCatalog = FALLBACK_CATALOG;
  let pickerState = null; // { mealId, dishIds:[], rice:bool, filter, q }

  function emptyMealSlot(mealId) {
    const def = MEAL_SLOTS.find(m => m.id === mealId);
    const slot = {
      dishIds: [],
      rice: !!(def && def.allowRice),
      done: false
    };
    if (mealId === 'breakfast') slot.proteinAddons = {};
    return slot;
  }

  function normalizeMealSlot(raw, mealId) {
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      const slot = {
        dishIds: Array.isArray(raw.dishIds) ? raw.dishIds.slice() : [],
        rice: typeof raw.rice === 'boolean' ? raw.rice : emptyMealSlot(mealId).rice,
        done: !!raw.done
      };
      if (mealId === 'breakfast') {
        slot.proteinAddons = (raw.proteinAddons && typeof raw.proteinAddons === 'object')
          ? Object.assign({}, raw.proteinAddons)
          : {};
      }
      return slot;
    }
    // legacy boolean — discard (no dish info)
    return emptyMealSlot(mealId);
  }

  function ensureMeals(day) {
    if (!day.meals || typeof day.meals !== 'object') day.meals = {};
    MEAL_SLOTS.forEach(m => {
      day.meals[m.id] = normalizeMealSlot(day.meals[m.id], m.id);
    });
    return day.meals;
  }

  function catalogList(source) {
    if (!mealCatalog) return [];
    return mealCatalog[source] || [];
  }

  function findDish(id) {
    if (id === RICE_ADDON.id) return RICE_ADDON;
    const pools = [
      ...(mealCatalog.breakfast || []),
      ...(mealCatalog.lunchDinner || []),
      ...(mealCatalog.drinks || [])
    ];
    return pools.find(d => d.id === id) || null;
  }

  function resolveDishes(ids) {
    return (ids || []).map(findDish).filter(Boolean);
  }

  function needsRiceHint(dishIds) {
    const dishes = resolveDishes(dishIds);
    if (!dishes.length) return false;
    const hasStaple = dishes.some(d => d.category === '特色主食');
    const hasStir = dishes.some(d => d.category === '荤菜炒菜');
    return hasStir && !hasStaple;
  }

  function mealSlotMacros(slot, mealId) {
    let kcal = 0;
    let protein = 0;
    resolveDishes(slot.dishIds).forEach(d => {
      kcal += Number(d.kcal) || 0;
      protein += Number(d.protein) || 0;
    });
    const def = MEAL_SLOTS.find(m => m.id === mealId);
    if (def && def.allowRice && slot.rice) {
      kcal += RICE_ADDON.kcal;
      protein += RICE_ADDON.protein;
    }
    if (mealId === 'breakfast' && slot.proteinAddons) {
      PROTEIN_ADDONS.forEach(a => {
        if (slot.proteinAddons[a.id]) {
          kcal += a.kcal;
          protein += a.protein;
        }
      });
    }
    return { kcal: Math.round(kcal), protein: Math.round(protein) };
  }

  function breakfastDishProtein(slot) {
    let protein = 0;
    resolveDishes(slot.dishIds).forEach(d => { protein += Number(d.protein) || 0; });
    return protein;
  }

  function needsProteinNudge(slot) {
    if (!mealHasSelection(slot)) return false;
    const dishes = resolveDishes(slot.dishIds);
    const lowId = dishes.some(d => LOW_PROTEIN_BF_IDS.indexOf(d.id) >= 0);
    return lowId || breakfastDishProtein(slot) < LOW_PROTEIN_BF_G;
  }

  function mealHasSelection(slot) {
    return !!(slot && slot.dishIds && slot.dishIds.length);
  }

  function mealLabelLines(slot, mealId) {
    const dishes = resolveDishes(slot.dishIds);
    if (!dishes.length) {
      return { sub: '点此选菜', meta: '未选择 · 选好后再勾选计入热量' };
    }
    const names = dishes.map(d => d.name);
    const def = MEAL_SLOTS.find(m => m.id === mealId);
    if (def && def.allowRice && slot.rice) names.push('米饭');
    if (mealId === 'breakfast' && slot.proteinAddons) {
      PROTEIN_ADDONS.forEach(a => {
        if (slot.proteinAddons[a.id]) names.push(a.name);
      });
    }
    const macros = mealSlotMacros(slot, mealId);
    return {
      sub: names.join(' · '),
      meta: '估 ' + macros.kcal + ' kcal · 蛋白 ' + macros.protein + ' g'
    };
  }

  async function loadMealCatalog() {
    try {
      const r = await fetch('data/meal-catalog.json', { cache: 'no-cache' });
      if (r.ok) {
        const data = await r.json();
        if (data && (data.breakfast || data.lunchDinner)) {
          mealCatalog = data;
          return;
        }
      }
    } catch (e) { /* use fallback */ }
    mealCatalog = FALLBACK_CATALOG;
  }

  function closeMealSheet() {
    const el = document.getElementById('mealSheet');
    if (el) el.hidden = true;
    pickerState = null;
    document.body.classList.remove('sheet-open');
  }

  function openMealSheet(mealId) {
    const def = MEAL_SLOTS.find(m => m.id === mealId);
    if (!def) return;
    const day = getDay();
    ensureMeals(day);
    const slot = day.meals[mealId];
    pickerState = {
      mealId,
      dishIds: slot.dishIds.slice(),
      rice: !!slot.rice,
      filter: '全部',
      q: ''
    };
    // default rice on when stir-fry without staple
    if (def.allowRice && needsRiceHint(pickerState.dishIds) && slot.dishIds.length === 0) {
      pickerState.rice = true;
    }
    document.getElementById('mealSheetTitle').textContent = '选' + def.name;
    document.getElementById('mealSheetSearch').value = '';
    document.body.classList.add('sheet-open');
    const el = document.getElementById('mealSheet');
    el.hidden = false;
    renderMealSheet();
  }

  function pickerCategories(def) {
    const list = catalogList(def.source);
    const cats = [];
    list.forEach(d => {
      if (d.category && cats.indexOf(d.category) < 0) cats.push(d.category);
    });
    return ['全部'].concat(cats);
  }

  function renderMealSheet() {
    if (!pickerState) return;
    const def = MEAL_SLOTS.find(m => m.id === pickerState.mealId);
    const filters = document.getElementById('mealSheetFilters');
    const cats = pickerCategories(def);
    filters.innerHTML = cats.map(c =>
      '<button type="button" class="chip-filter' + (pickerState.filter === c ? ' on' : '') +
      '" data-cat="' + escapeHtml(c) + '">' + escapeHtml(c) + '</button>'
    ).join('');
    filters.querySelectorAll('[data-cat]').forEach(btn => {
      btn.addEventListener('click', () => {
        pickerState.filter = btn.dataset.cat;
        renderMealSheet();
      });
    });

    let list = catalogList(def.source).slice();
    if (pickerState.filter && pickerState.filter !== '全部') {
      list = list.filter(d => d.category === pickerState.filter);
    }
    const q = (pickerState.q || '').trim().toLowerCase();
    if (q) list = list.filter(d => (d.name || '').toLowerCase().indexOf(q) >= 0);

    const root = document.getElementById('mealSheetList');
    if (!list.length) {
      root.innerHTML = '<div class="sheet-empty muted">没有匹配的菜品</div>';
    } else {
      root.innerHTML = list.map(d => {
        const on = pickerState.dishIds.indexOf(d.id) >= 0;
        const rating = d.rating != null ? (' · ★' + d.rating) : '';
        return '<button type="button" class="dish-card' + (on ? ' on' : '') + '" data-dish="' + d.id + '">' +
          '<div class="dish-check">' + (on ? CHECK_SVG : '') + '</div>' +
          '<div class="dish-body">' +
          '<div class="dish-name">' + escapeHtml(d.name) + '</div>' +
          '<div class="dish-meta"><span class="est">估</span> ' + d.kcal + ' kcal · 蛋白 ' + d.protein + ' g' +
          (d.note ? ' · ' + escapeHtml(d.note) : '') + rating + '</div>' +
          '<div class="dish-cat">' + escapeHtml(d.category || '') + '</div>' +
          '</div></button>';
      }).join('');
      root.querySelectorAll('[data-dish]').forEach(btn => {
        btn.addEventListener('click', () => togglePickerDish(btn.dataset.dish));
      });
    }

    // rice row
    const riceEl = document.getElementById('mealSheetRice');
    if (def.allowRice) {
      const showHint = needsRiceHint(pickerState.dishIds) || pickerState.rice;
      riceEl.hidden = !showHint && pickerState.dishIds.length === 0;
      if (!riceEl.hidden) {
        riceEl.innerHTML =
          '<button type="button" class="rice-chip' + (pickerState.rice ? ' on' : '') + '" id="btnToggleRice">' +
          (pickerState.rice ? '✓ ' : '') + '主食搭配 · 米饭 +' + RICE_ADDON.kcal + ' kcal / ' + RICE_ADDON.protein + ' g 蛋白</button>' +
          (needsRiceHint(pickerState.dishIds) && !pickerState.rice
            ? '<div class="rice-hint muted">只点了炒菜的话，建议加一碗米饭</div>' : '');
        const b = document.getElementById('btnToggleRice');
        if (b) b.addEventListener('click', () => {
          pickerState.rice = !pickerState.rice;
          renderMealSheet();
        });
      }
    } else {
      riceEl.hidden = true;
      riceEl.innerHTML = '';
    }

    const macros = mealSlotMacros(
      { dishIds: pickerState.dishIds, rice: pickerState.rice, done: false },
      pickerState.mealId
    );
    const n = pickerState.dishIds.length;
    const maxHint = def.mode === 'single' ? '选 1 份' : ('已选 ' + n + '/' + def.max);
    document.getElementById('mealSheetSum').innerHTML =
      '<span>' + maxHint + '</span><span class="num">估 ' + macros.kcal + ' kcal · ' + macros.protein + ' g 蛋白</span>';
  }

  function togglePickerDish(id) {
    if (!pickerState) return;
    const def = MEAL_SLOTS.find(m => m.id === pickerState.mealId);
    const idx = pickerState.dishIds.indexOf(id);
    if (def.mode === 'single') {
      pickerState.dishIds = idx >= 0 ? [] : [id];
    } else {
      if (idx >= 0) {
        pickerState.dishIds.splice(idx, 1);
      } else {
        if (pickerState.dishIds.length >= def.max) {
          toast('最多选 ' + def.max + ' 道');
          return;
        }
        pickerState.dishIds.push(id);
      }
    }
    // auto-enable rice when stir-fry without staple
    if (def.allowRice && needsRiceHint(pickerState.dishIds)) {
      pickerState.rice = true;
    }
    if (def.allowRice && !needsRiceHint(pickerState.dishIds)) {
      // keep user's rice choice; if they picked 特色主食, optionally turn off
      const dishes = resolveDishes(pickerState.dishIds);
      if (dishes.some(d => d.category === '特色主食')) pickerState.rice = false;
    }
    renderMealSheet();
  }

  function confirmMealSheet() {
    if (!pickerState) return;
    const def = MEAL_SLOTS.find(m => m.id === pickerState.mealId);
    if (def.required && pickerState.dishIds.length === 0) {
      toast('请先选一道菜');
      return;
    }
    const day = getDay();
    ensureMeals(day);
    const slot = day.meals[pickerState.mealId];
    slot.dishIds = pickerState.dishIds.slice();
    slot.rice = !!pickerState.rice;
    if (pickerState.mealId === 'breakfast') {
      if (!slot.proteinAddons) slot.proteinAddons = {};
      // keep existing protein addon toggles across dish changes
    }
    // selecting dishes marks ready; auto-check if has selection
    slot.done = mealHasSelection(slot) || (!def.required && slot.dishIds.length > 0);
    if (!def.required && slot.dishIds.length === 0) slot.done = false;
    if (def.required) slot.done = mealHasSelection(slot);
    save();
    closeMealSheet();
    afterCheck(day);
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function bindMealSheet() {
    const sheet = document.getElementById('mealSheet');
    if (!sheet) return;
    sheet.querySelectorAll('[data-close-sheet]').forEach(el => {
      el.addEventListener('click', closeMealSheet);
    });
    document.getElementById('mealSheetConfirm').addEventListener('click', confirmMealSheet);
    document.getElementById('mealSheetSearch').addEventListener('input', (e) => {
      if (!pickerState) return;
      pickerState.q = e.target.value || '';
      renderMealSheet();
    });
  }

  const CARDIO = {
    id: 'cardio',
    name: '有氧训练',
    minutes: 35,
    kcal: 300,
    hint: '椭圆机 / 慢跑 / 快走 30–40 分钟，目标消耗约 300 kcal'
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
      goalWeight: 80,
      goalFat: 20,
      startWeight: 87.3,
      startFat: 26.8,
      dailyKcal: 2000,
      trainingKcal: 2100,
      restKcal: 1900,
      dailyProtein: 140,
      waterMl: 2800
    },
    metrics: [
      { date: '2026-10-12', weight: 87.3, fat: 26.8, muscle: 60.6, visceral: 14 }
    ],
    workouts: [],
    checks: {},
    daily: {},
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

  function prefersReducedMotion() {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  }

  function hapticLight() {
    if (prefersReducedMotion()) return;
    if (navigator.vibrate) {
      try { navigator.vibrate(10); } catch (e) { /* ignore */ }
    }
  }

  function popCheckEl(el) {
    if (!el || prefersReducedMotion()) return;
    const row = el.closest ? (el.closest('.cl-item') || el.closest('.ex-item') || el) : el;
    row.classList.remove('check-pop');
    void row.offsetWidth;
    row.classList.add('check-pop');
    clearTimeout(row._popT);
    row._popT = setTimeout(() => row.classList.remove('check-pop'), 480);
  }

  function findNextTodo(day) {
    const plan = day.plan || 'A';
    ensureMeals(day);
    // First-run / morning: pick breakfast before anything else
    const bf = day.meals.breakfast;
    if (bf && !mealHasSelection(bf)) {
      return { kind: 'meal-pick', id: 'breakfast', label: '先选早餐', act: 'meal-pick' };
    }
    // water
    if ((day.waterTicks || 0) < WATER_TICKS) {
      return { kind: 'water', label: '喝水 · 再加一格', act: 'water' };
    }
    // meals in order
    for (const m of MEAL_SLOTS.filter(x => x.required)) {
      const slot = day.meals[m.id];
      if (!mealHasSelection(slot)) {
        return { kind: 'meal-pick', id: m.id, label: '先选' + m.name, act: 'meal-pick' };
      }
      if (!slot.done) {
        return { kind: 'meal-check', id: m.id, label: '勾选' + m.name, act: 'meal-toggle' };
      }
    }
    if (plan === 'R') {
      if (!day.cardio) return { kind: 'cardio', label: '完成有氧 ~300 kcal', act: 'cardio' };
    } else if (plan !== 'X' && PLANS[plan]) {
      for (const ex of PLANS[plan].exercises) {
        if (!day.exercises[ex.id]) {
          return { kind: 'ex', id: ex.id, label: '完成 ' + ex.name + ' · ' + ex.setCount + ' 组', act: 'ex' };
        }
      }
    }
    return { kind: 'done', label: '今日全勤 · 真棒', act: null };
  }


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

  function formatDateLabel(iso) {
    const d = new Date(iso + 'T12:00:00');
    const wd = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
    return (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日 · 周' + wd;
  }

  /** Default weekday rotation: Mon A, Tue R, Wed B, Thu R, Fri C, Sat R, Sun rest */
  function weekdayDefaultPlan(dateIso) {
    const d = new Date((dateIso || todayStr()) + 'T12:00:00');
    const map = { 0: 'X', 1: 'A', 2: 'R', 3: 'B', 4: 'R', 5: 'C', 6: 'R' };
    return map[d.getDay()] || 'A';
  }

  function emptyDay(plan) {
    const meals = {};
    MEAL_SLOTS.forEach(m => { meals[m.id] = emptyMealSlot(m.id); });
    return {
      plan: plan || weekdayDefaultPlan(),
      waterTicks: 0,
      meals,
      exercises: {},
      cardio: false,
      kcalOverride: null,
      celebrated: false,
      celebrateSeen: false
    };
  }

  function getDay(dateIso) {
    const key = dateIso || todayStr();
    if (!state.daily[key]) {
      const planned = (state.lastPlan && state.lastPlan.date === key)
        ? state.lastPlan.plan
        : weekdayDefaultPlan(key);
      state.daily[key] = emptyDay(planned);
    }
    const day = state.daily[key];
    ensureMeals(day);
    if (!day.exercises) day.exercises = {};
    if (typeof day.waterTicks !== 'number') day.waterTicks = 0;
    if (day.kcalOverride === undefined) day.kcalOverride = null;
    return day;
  }

  function migrate(data) {
    const base = structuredClone(DEFAULTS);
    const merged = {
      ...base,
      ...data,
      profile: { ...base.profile, ...(data.profile || {}) },
      progress: { ...base.progress, ...(data.progress || {}) },
      metrics: Array.isArray(data.metrics) && data.metrics.length ? data.metrics : base.metrics,
      workouts: Array.isArray(data.workouts) ? data.workouts : [],
      checks: data.checks || {},
      daily: data.daily && typeof data.daily === 'object' ? data.daily : {}
    };
    if (!merged.profile.dailyKcal) merged.profile.dailyKcal = 2000;
    if (!merged.profile.trainingKcal) {
      merged.profile.trainingKcal = merged.profile.dailyKcal >= 2050
        ? merged.profile.dailyKcal
        : 2100;
    }
    if (!merged.profile.restKcal) {
      merged.profile.restKcal = merged.profile.dailyKcal <= 1950
        ? merged.profile.dailyKcal
        : 1900;
    }
    if (!merged.profile.dailyProtein) merged.profile.dailyProtein = 140;
    if (!merged.profile.waterMl) merged.profile.waterMl = 2800;
    // Soft hint: aggressive scale-style goal (~减20kg → ~66.5) → first-stage ~80
    const gw = Number(merged.profile.goalWeight);
    if (gw && gw <= 68 && !merged.profile.goalWeightSoftFixed) {
      merged.profile.goalWeight = 80;
      merged.profile.goalWeightSoftFixed = true;
    }
    return merged;
  }

  function isTrainingPlan(plan) {
    return plan === 'A' || plan === 'B' || plan === 'C' || plan === 'R';
  }

  function autoKcalForPlan(plan) {
    if (isTrainingPlan(plan)) return state.profile.trainingKcal || 2100;
    return state.profile.restKcal || 1900;
  }

  function dayKcalTarget(day) {
    if (day && day.kcalOverride != null && !isNaN(Number(day.kcalOverride))) {
      return Math.round(Number(day.kcalOverride));
    }
    return autoKcalForPlan((day && day.plan) || 'A');
  }

  function kcalModeLabel(day) {
    const target = dayKcalTarget(day);
    if (day && day.kcalOverride != null && !isNaN(Number(day.kcalOverride))) {
      return '自定 ' + target;
    }
    return isTrainingPlan(day.plan) ? ('训练日 ' + target) : ('休息日 ' + target);
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(DEFAULTS);
      return migrate(JSON.parse(raw));
    } catch (e) {
      return structuredClone(DEFAULTS);
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  let state = load();
  let currentPlan = suggestPlan();
  let celebrateArmed = false;

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
    // also count full daily completions
    Object.keys(state.daily || {}).forEach(k => {
      const d = state.daily[k];
      if (d && d.celebrated) days.add(k);
    });
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
    const day = getDay(t);
    if (day.plan) return day.plan;
    const todayW = state.workouts.find(w => w.date === t);
    if (todayW) return todayW.plan;
    if (state.lastPlan && state.lastPlan.date === t) return state.lastPlan.plan;
    return weekdayDefaultPlan(t);
  }

  function setTodayPlan(plan) {
    const day = getDay();
    day.plan = plan;
    // clear exercise checks when switching session type
    day.exercises = {};
    day.cardio = false;
    state.lastPlan = { date: todayStr(), plan };
    currentPlan = plan;
    save();
  }

  function tagClass(plan) {
    if (plan === 'B') return 'blue';
    if (plan === 'C') return 'orange';
    if (plan === 'R' || plan === 'X') return 'muted';
    return 'green';
  }

  function mealTotals(day) {
    ensureMeals(day);
    let kcal = 0;
    let protein = 0;
    MEAL_SLOTS.forEach(m => {
      const slot = day.meals[m.id];
      if (slot && slot.done && mealHasSelection(slot)) {
        const t = mealSlotMacros(slot, m.id);
        kcal += t.kcal;
        protein += t.protein;
      }
    });
    return { kcal, protein };
  }

  function requiredTasks(day) {
    const plan = day.plan || 'A';
    const tasks = [];

    // water: complete when all ticks
    tasks.push({
      id: 'water',
      done: (day.waterTicks || 0) >= WATER_TICKS
    });

    // required meals: done only when selected + checked
    ensureMeals(day);
    MEAL_SLOTS.filter(m => m.required).forEach(m => {
      const slot = day.meals[m.id];
      tasks.push({
        id: 'meal_' + m.id,
        done: !!(slot && slot.done && mealHasSelection(slot))
      });
    });

    if (plan === 'R') {
      tasks.push({ id: 'cardio', done: !!day.cardio });
    } else if (plan !== 'X' && PLANS[plan]) {
      PLANS[plan].exercises.forEach(ex => {
        tasks.push({ id: 'ex_' + ex.id, done: !!day.exercises[ex.id] });
      });
    }
    return tasks;
  }

  function checklistStats(day) {
    const tasks = requiredTasks(day);
    const done = tasks.filter(t => t.done).length;
    return { done, total: tasks.length, complete: tasks.length > 0 && done === tasks.length };
  }

  function syncWorkoutFromDay(day) {
    const plan = day.plan;
    if (!plan || plan === 'X') return;
    const p = PLANS[plan];
    if (!p) return;
    let doneCount = 0;
    let total = 0;
    if (plan === 'R') {
      total = 1;
      doneCount = day.cardio ? 1 : 0;
    } else {
      total = p.exercises.length;
      doneCount = p.exercises.filter(e => day.exercises[e.id]).length;
    }
    if (doneCount === 0) return;
    const entry = {
      date: todayStr(),
      plan,
      note: '',
      doneCount,
      total,
      at: new Date().toISOString()
    };
    const idx = state.workouts.findIndex(w => w.date === todayStr());
    if (idx >= 0) {
      // keep existing note
      entry.note = state.workouts[idx].note || '';
      state.workouts[idx] = entry;
    } else {
      state.workouts.push(entry);
    }
    // sync legacy checks
    const key = todayStr() + '_' + plan;
    if (!state.checks[key]) state.checks[key] = {};
    if (plan !== 'R') {
      p.exercises.forEach(ex => {
        state.checks[key][ex.id] = !!day.exercises[ex.id];
      });
    }
  }

  function maybeCelebrate(day) {
    const stats = checklistStats(day);
    if (!stats.complete) {
      celebrateArmed = true; // re-arm if user unchecks
      return;
    }
    if (day.celebrated && day.celebrateSeen) return;
    if (!day.celebrated) {
      day.celebrated = true;
      syncWorkoutFromDay(day);
      save();
    }
    if (!day.celebrateSeen) {
      showCelebration();
    }
  }

  function showCelebration() {
    const el = document.getElementById('celebrate');
    const day = getDay();
    document.getElementById('celMsg').textContent =
      '今日清单 ' + checklistStats(day).done + '/' + checklistStats(day).total + ' · 全部完成';
    el.hidden = false;
    // restart animations
    el.querySelectorAll('.cel-bloom, .cel-seal, .seal-outer').forEach(node => {
      node.style.animation = 'none';
      void node.offsetWidth;
      node.style.animation = '';
    });
    if (navigator.vibrate) {
      try { navigator.vibrate([12, 40, 18]); } catch (e) { /* ignore */ }
    }
    toast('今日全勤 · 打卡成功');
  }

  function dismissCelebration() {
    const day = getDay();
    day.celebrateSeen = true;
    day.celebrated = true;
    save();
    document.getElementById('celebrate').hidden = true;
    renderHome();
  }

  function switchView(name) {
    // map legacy names
    if (name === 'progress' || name === 'settings') name = 'me';
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const view = document.getElementById('view-' + name);
    if (!view) name = 'home';
    document.getElementById('view-' + name).classList.add('active');
    document.querySelectorAll('.tabbar button').forEach(b => {
      b.classList.toggle('on', b.dataset.view === name);
    });
    if (name === 'home') renderHome();
    if (name === 'workout') renderWorkout();
    if (name === 'metrics') renderMetrics();
    if (name === 'me') renderProgress();
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  function updateKcalHero(day) {
    const target = dayKcalTarget(day);
    const proTarget = state.profile.dailyProtein || 140;
    const waterTarget = state.profile.waterMl || 2800;
    const totals = mealTotals(day);
    const remain = Math.max(0, target - totals.kcal);
    const stats = checklistStats(day);
    const wDone = day.waterTicks || 0;

    document.getElementById('kcalRemain').textContent = String(remain);
    const proStrip = document.getElementById('proStrip');
    if (proStrip) {
      proStrip.innerHTML = totals.protein + '<span class="prog-den">/' + proTarget + '</span>';
    }
    const waterStrip = document.getElementById('waterStrip');
    if (waterStrip) {
      waterStrip.innerHTML = wDone + '<span class="prog-den">/' + WATER_TICKS + '</span>';
    }
    const checkStrip = document.getElementById('checkStrip');
    if (checkStrip) {
      checkStrip.innerHTML = stats.done + '<span class="prog-den">/' + stats.total + '</span>';
    }

    const modeChip = document.getElementById('kcalModeChip');
    if (modeChip) {
      modeChip.textContent = kcalModeLabel(day);
      modeChip.classList.toggle('override', day.kcalOverride != null && !isNaN(Number(day.kcalOverride)));
    }

    const proBar = document.getElementById('proBar');
    if (proBar) {
      proBar.style.width = Math.min(100, (totals.protein / proTarget) * 100).toFixed(1) + '%';
    }
    const waterBar = document.getElementById('waterBar');
    if (waterBar) {
      waterBar.style.width = Math.min(100, (wDone / WATER_TICKS) * 100).toFixed(1) + '%';
    }

    const wLiters = (waterTarget / 1000).toFixed(1).replace(/\.0$/, '');
    const trainK = state.profile.trainingKcal || 2100;
    const restK = state.profile.restKcal || 1900;
    const noteKcal = document.getElementById('noteKcal');
    if (noteKcal) noteKcal.textContent = '训 ' + trainK + ' / 休 ' + restK;
    const notePro = document.getElementById('notePro');
    if (notePro) notePro.textContent = proTarget + ' g';
    const noteWater = document.getElementById('noteWater');
    if (noteWater) noteWater.textContent = wLiters + ' L';
  }

  function promptKcalOverride() {
    const day = getDay();
    const cur = dayKcalTarget(day);
    const auto = autoKcalForPlan(day.plan);
    const msg = '今日热量目标（kcal）\n当前自动：' + auto +
      (day.kcalOverride != null ? '\n已覆盖：' + day.kcalOverride : '') +
      '\n留空或输入 auto 恢复自动';
    const raw = window.prompt(msg, String(day.kcalOverride != null ? day.kcalOverride : cur));
    if (raw === null) return;
    const trimmed = String(raw).trim().toLowerCase();
    if (trimmed === '' || trimmed === 'auto' || trimmed === '自动') {
      day.kcalOverride = null;
      toast('已恢复自动 · ' + kcalModeLabel(day));
    } else {
      const n = parseInt(trimmed, 10);
      if (isNaN(n) || n < 800 || n > 5000) {
        toast('请输入 800–5000 之间的整数');
        return;
      }
      day.kcalOverride = n;
      toast('今日覆盖 · ' + n + ' kcal');
    }
    save();
    renderHome();
  }

  function renderChecklist(day) {
    const root = document.getElementById('checklistRoot');
    const plan = day.plan || 'A';
    const perTick = Math.round((state.profile.waterMl || 2800) / WATER_TICKS);
    const stats = checklistStats(day);
    document.getElementById('checkProgress').textContent = stats.done + '/' + stats.total;

    ensureMeals(day);

    // --- Diet group: water + meals; incomplete first ---
    const dietItems = [];

    // Water
    const waterDone = (day.waterTicks || 0) >= WATER_TICKS;
    let waterHtml = '<div class="cl-item water-row' + (waterDone ? ' done' : '') + '" data-sort="' + (waterDone ? '1' : '0') + '">';
    waterHtml += '<div class="water-top" data-act="water-toggle" role="button" tabindex="0" aria-label="饮水全部完成或重置" aria-pressed="' + (waterDone ? 'true' : 'false') + '">';
    waterHtml += '<div class="check" aria-hidden="true">' + (waterDone ? CHECK_SVG : '') + '</div>';
    waterHtml += '<div class="cl-body"><div class="cl-title">喝水 ' +
      ((state.profile.waterMl || 2800) / 1000).toFixed(1).replace(/\.0$/, '') + ' L</div>';
    waterHtml += '<div class="cl-sub">分 ' + WATER_TICKS + ' 次 · 每次约 ' + perTick + ' ml</div></div></div>';
    waterHtml += '<div class="water-ticks" role="group" aria-label="饮水格">';
    for (let i = 1; i <= WATER_TICKS; i++) {
      const on = i <= (day.waterTicks || 0);
      waterHtml += '<button type="button" class="water-tick' + (on ? ' on' : '') +
        '" data-tick="' + i + '" aria-label="饮水第 ' + i + ' 格" aria-pressed="' + (on ? 'true' : 'false') + '">' + i + '</button>';
    }
    waterHtml += '</div></div>';
    dietItems.push({ done: waterDone, html: waterHtml, after: '' });

    // Meals
    let breakfastNeedsPick = false;
    MEAL_SLOTS.forEach(m => {
      const slot = day.meals[m.id];
      const has = mealHasSelection(slot);
      const on = !!(slot.done && has);
      if (m.id === 'breakfast' && !has) breakfastNeedsPick = true;
      const lines = mealLabelLines(slot, m.id);
      const primary = (m.id === 'breakfast' && !has);
      let html = '<div class="cl-item meal-item' + (on ? ' done' : '') + (!has ? ' need-pick' : '') +
        (primary ? ' primary-pick' : '') + '" data-meal="' + m.id + '" data-sort="' + (on ? '1' : '0') + '">';
      html += '<button type="button" class="check meal-check" data-act="meal-toggle" data-id="' + m.id +
        '" aria-label="' + (on ? '取消勾选' : '勾选') + m.name + '" aria-checked="' + (on ? 'true' : 'false') + '" role="checkbox">' +
        (on ? CHECK_SVG : '') + '</button>';
      html += '<button type="button" class="cl-body meal-pick" data-act="meal-pick" data-id="' + m.id + '" aria-label="选择' + m.name + '菜品">';
      html += '<div class="cl-title">' + m.name +
        (m.required ? '' : ' <span class="opt-tag">可选</span>') + '</div>';
      html += '<div class="cl-sub' + (!has ? ' pick-cta' : '') + '">' +
        escapeHtml(!has && m.id === 'breakfast' ? '先选早餐' : lines.sub) + '</div>';
      html += '<div class="cl-meta">' + escapeHtml(lines.meta) + '</div>';
      html += '</button></div>';
      let after = '';
      if (m.id === 'breakfast' && has && needsProteinNudge(slot)) {
        if (!slot.proteinAddons) slot.proteinAddons = {};
        after += '<div class="protein-nudge">';
        after += '<div class="protein-nudge-title">蛋白偏低，建议加一份 <span class="est">估</span></div>';
        after += '<div class="protein-nudge-chips">';
        PROTEIN_ADDONS.forEach(a => {
          const onA = !!slot.proteinAddons[a.id];
          after += '<button type="button" class="protein-chip' + (onA ? ' on' : '') +
            '" data-act="protein-addon" data-id="' + a.id + '" aria-pressed="' + (onA ? 'true' : 'false') + '">' +
            (onA ? '✓ ' : '') + escapeHtml(a.name) +
            ' <span class="muted">+' + a.protein + 'g / +' + a.kcal + 'kcal</span></button>';
        });
        after += '</div></div>';
      }
      dietItems.push({ done: on || (!m.required && !has), html: html, after: after, optionalEmpty: (!m.required && !has) });
    });

    // sort: incomplete first (done=false), then done; keep relative order within
    // optional empty snack: treat as neither blocking — sink mildly if unchecked without selection
    dietItems.sort((a, b) => (a.done ? 1 : 0) - (b.done ? 1 : 0));

    let html = '';
    html += '<div class="cl-group"><div class="cl-head"><h3>饮食</h3>';
    html += '<span class="muted" style="font-size:11px">点行勾选 · 点菜名选菜</span></div>';
    html += '<div class="cl-list">';
    dietItems.forEach(it => { html += it.html + it.after; });
    html += '</div></div>';

    // --- Training group ---
    const trainItems = [];
    if (plan === 'X') {
      trainItems.push({
        done: true,
        html: '<div class="cl-item done" style="cursor:default"><div class="check" aria-hidden="true">' + CHECK_SVG + '</div>' +
          '<div class="cl-body"><div class="cl-title">今日休息</div>' +
          '<div class="cl-sub">无需进馆；保持饮食与饮水即可全勤</div></div></div>'
      });
    } else if (plan === 'R') {
      const on = !!day.cardio;
      trainItems.push({
        done: on,
        html: '<div class="cl-item' + (on ? ' done' : '') + '" data-act="cardio" role="checkbox" aria-checked="' + (on ? 'true' : 'false') + '" tabindex="0" aria-label="有氧训练">' +
          '<div class="check" aria-hidden="true">' + (on ? CHECK_SVG : '') + '</div>' +
          '<div class="cl-body"><div class="cl-title">' + CARDIO.name + '</div>' +
          '<div class="cl-sub">' + CARDIO.hint + '</div>' +
          '<div class="cl-meta">' + CARDIO.minutes + ' 分钟 · 目标消耗 ~' + CARDIO.kcal + ' kcal</div>' +
          '</div></div>'
      });
    } else if (PLANS[plan]) {
      PLANS[plan].exercises.forEach(ex => {
        const on = !!day.exercises[ex.id];
        trainItems.push({
          done: on,
          html: '<div class="cl-item' + (on ? ' done' : '') + '" data-act="ex" data-id="' + ex.id +
            '" role="checkbox" aria-checked="' + (on ? 'true' : 'false') + '" tabindex="0" aria-label="' + escapeHtml(ex.name) + '">' +
            '<div class="check" aria-hidden="true">' + (on ? CHECK_SVG : '') + '</div>' +
            '<div class="cl-body"><div class="cl-title">' + ex.name + '</div>' +
            '<div class="cl-sub">' + ex.tip + '</div>' +
            '<div class="cl-meta">完成 ' + ex.setCount + ' 组 · ' + ex.sets + '</div>' +
            '</div></div>'
        });
      });
    }
    trainItems.sort((a, b) => (a.done ? 1 : 0) - (b.done ? 1 : 0));

    const trainHead = plan === 'R' ? '有氧' : (plan === 'X' ? '训练' : ((PLANS[plan] && PLANS[plan].short) + ' · 动作'));
    html += '<div class="cl-group"><div class="cl-head"><h3>' + trainHead + '</h3>';
    if (plan !== 'X' && plan !== 'R') {
      html += '<span class="muted" style="font-size:11px">整行一点即勾</span>';
    }
    html += '</div><div class="cl-list">';
    trainItems.forEach(it => { html += it.html; });
    html += '</div></div>';

    root.innerHTML = html;

    // events — one-tap on whole row; meal name opens picker
    root.querySelectorAll('[data-act="meal-pick"]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        openMealSheet(el.dataset.id);
      });
    });
    root.querySelectorAll('.meal-item').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('[data-act="meal-pick"]')) return;
        if (e.target.closest('[data-act="protein-addon"]')) return;
        const id = row.dataset.meal;
        const btn = row.querySelector('[data-act="meal-toggle"]');
        ensureMeals(day);
        const slot = day.meals[id];
        if (!mealHasSelection(slot)) {
          toast('先选菜再勾选');
          openMealSheet(id);
          return;
        }
        slot.done = !slot.done;
        hapticLight();
        popCheckEl(btn || row);
        save();
        afterCheck(day);
      });
    });
    root.querySelectorAll('[data-act="meal-toggle"]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = el.dataset.id;
        ensureMeals(day);
        const slot = day.meals[id];
        if (!mealHasSelection(slot)) {
          toast('先选菜再勾选');
          openMealSheet(id);
          return;
        }
        slot.done = !slot.done;
        hapticLight();
        popCheckEl(el);
        save();
        afterCheck(day);
      });
    });
    root.querySelectorAll('[data-act="protein-addon"]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        ensureMeals(day);
        const slot = day.meals.breakfast;
        if (!slot.proteinAddons) slot.proteinAddons = {};
        const id = el.dataset.id;
        slot.proteinAddons[id] = !slot.proteinAddons[id];
        hapticLight();
        save();
        afterCheck(day);
      });
    });
    root.querySelectorAll('[data-act="ex"]').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.dataset.id;
        day.exercises[id] = !day.exercises[id];
        hapticLight();
        popCheckEl(el);
        syncWorkoutFromDay(day);
        save();
        afterCheck(day);
      });
    });
    root.querySelectorAll('[data-act="cardio"]').forEach(el => {
      el.addEventListener('click', () => {
        day.cardio = !day.cardio;
        hapticLight();
        popCheckEl(el);
        syncWorkoutFromDay(day);
        save();
        afterCheck(day);
      });
    });
    root.querySelectorAll('.water-tick').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const n = parseInt(btn.dataset.tick, 10);
        if ((day.waterTicks || 0) === n) day.waterTicks = n - 1;
        else day.waterTicks = n;
        hapticLight();
        popCheckEl(btn.closest('.cl-item'));
        save();
        afterCheck(day);
      });
    });
    const waterTop = root.querySelector('[data-act="water-toggle"]');
    if (waterTop) {
      waterTop.addEventListener('click', () => {
        if ((day.waterTicks || 0) >= WATER_TICKS) day.waterTicks = 0;
        else day.waterTicks = WATER_TICKS;
        hapticLight();
        popCheckEl(waterTop.closest('.cl-item'));
        save();
        afterCheck(day);
      });
    }
  }

  function afterCheck(day) {
    const wasComplete = day.celebrated;
    const stats = checklistStats(day);
    if (!stats.complete && wasComplete) {
      day.celebrated = false;
      day.celebrateSeen = false;
      save();
    }
    renderHome();
    maybeCelebrate(getDay());
  }


  function updateNextTodo(day) {
    const next = findNextTodo(day);
    const btn = document.getElementById('nextTodo');
    const text = document.getElementById('nextTodoText');
    const nudge = document.getElementById('nudgeRemain');
    const stats = checklistStats(day);
    if (text) text.textContent = next.label;
    if (btn) {
      btn.classList.toggle('done-all', next.kind === 'done');
      btn.dataset.act = next.act || '';
      btn.dataset.id = next.id || '';
      btn.dataset.kind = next.kind || '';
    }
    if (nudge) {
      const left = Math.max(0, stats.total - stats.done);
      if (left > 0 && left <= 3 && !stats.complete) {
        nudge.hidden = false;
        nudge.textContent = '还差 ' + left + ' 项';
      } else if (stats.complete) {
        nudge.hidden = false;
        nudge.textContent = '全部完成';
      } else {
        nudge.hidden = true;
      }
    }
  }

  function activateNextTodo() {
    const btn = document.getElementById('nextTodo');
    if (!btn) return;
    const kind = btn.dataset.kind;
    const id = btn.dataset.id;
    const day = getDay();
    if (kind === 'done') {
      const list = document.getElementById('checklistRoot');
      if (list) list.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
      return;
    }
    if (kind === 'meal-pick' || kind === 'meal-check') {
      if (kind === 'meal-pick' || !mealHasSelection(day.meals[id])) {
        openMealSheet(id);
        return;
      }
      // scroll to meal row
      const row = document.querySelector('.meal-item[data-meal="' + id + '"]');
      if (row) row.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
      return;
    }
    if (kind === 'water') {
      const row = document.querySelector('.cl-item.water-row');
      if (row) row.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
      return;
    }
    if (kind === 'cardio') {
      const row = document.querySelector('[data-act="cardio"]');
      if (row) {
        row.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
      }
      return;
    }
    if (kind === 'ex' && id) {
      const row = document.querySelector('[data-act="ex"][data-id="' + id + '"]');
      if (row) row.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
    }
  }

  function renderHome() {
    currentPlan = suggestPlan();
    const day = getDay();
    day.plan = currentPlan;
    const plan = PLANS[currentPlan] || PLANS.A;
    const streak = calcStreak();
    document.getElementById('streakChip').innerHTML =
      '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v3M8 6.5c-2.5 1.5-4 4-4 7a8 8 0 0016 0c0-3-1.5-5.5-4-7M9 14h6"/></svg>' +
      '连续 <strong>' + streak + '</strong> 天';

    document.getElementById('todayDateLabel').textContent = formatDateLabel(todayStr());
    const stats = checklistStats(day);
    const badge = document.getElementById('dayDoneBadge');
    if (stats.complete || day.celebrated) {
      badge.hidden = false;
    } else {
      badge.hidden = true;
    }

    const titleEl = document.getElementById('todayTitle');
    if (titleEl) titleEl.textContent = plan.title;

    document.querySelectorAll('#planPills button').forEach(b => {
      b.classList.toggle('on', b.dataset.plan === currentPlan);
    });

    updateKcalHero(day);
    renderChecklist(day);
    updateNextTodo(day);

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
    Object.keys(state.daily || {}).forEach(k => {
      if (state.daily[k] && state.daily[k].celebrated && !map[k]) {
        map[k] = state.daily[k].plan || 'A';
      }
    });
    const grid = document.getElementById('weekGrid');
    grid.innerHTML = weekBounds().map(d => {
      const planCode = map[d.key];
      const cls = planCode ? 'done' + planCode : '';
      return '<div class="day-cell ' + cls + (d.isToday ? ' today' : '') + '">' +
        '<div class="d">周' + d.label + '</div>' +
        '<div class="mark">' + (planCode === 'X' ? '休' : (planCode || d.dateNum)) + '</div></div>';
    }).join('');
  }

  function getChecks(plan) {
    const key = todayStr() + '_' + plan;
    if (!state.checks[key]) state.checks[key] = {};
    return state.checks[key];
  }

  function renderWorkout() {
    if (currentPlan === 'X') currentPlan = 'A';
    const plan = PLANS[currentPlan];
    document.querySelectorAll('#planSeg button').forEach(b => {
      b.classList.toggle('on', b.dataset.plan === currentPlan);
    });
    document.getElementById('planTitle').textContent = plan.title;
    document.getElementById('planDesc').textContent = plan.desc;

    // prefer daily checklist state
    const day = getDay();
    const checks = getChecks(currentPlan);
    if (day.plan === currentPlan) {
      if (currentPlan === 'R') {
        // no per-ex
      } else {
        plan.exercises.forEach(ex => {
          if (day.exercises[ex.id]) checks[ex.id] = true;
        });
      }
    }

    const list = document.getElementById('exerciseList');
    list.innerHTML = plan.exercises.map(ex => {
      const done = currentPlan === 'R'
        ? (ex.id === 'r1' ? !!day.cardio : !!checks[ex.id])
        : !!(day.plan === currentPlan ? day.exercises[ex.id] : checks[ex.id]);
      return '<div class="ex-item' + (done ? ' done' : '') + '" data-id="' + ex.id + '">' +
        '<div class="check">' + (done ? CHECK_SVG : '') + '</div>' +
        '<div class="ex-meta"><div class="name">' + ex.name + '</div>' +
        '<div class="sets">' + ex.sets + '</div>' +
        '<div class="tip">' + ex.tip + '</div></div></div>';
    }).join('');

    list.querySelectorAll('.ex-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        if (day.plan !== currentPlan) {
          setTodayPlan(currentPlan);
        }
        const d = getDay();
        if (currentPlan === 'R' && id === 'r1') {
          d.cardio = !d.cardio;
        } else {
          d.exercises[id] = !d.exercises[id];
          const c = getChecks(currentPlan);
          c[id] = !!d.exercises[id];
        }
        syncWorkoutFromDay(d);
        save();
        renderWorkout();
      });
    });

    const existing = state.workouts.find(w => w.date === todayStr() && w.plan === currentPlan);
    document.getElementById('workoutNote').value = existing ? (existing.note || '') : '';
  }

  function completeWorkout() {
    const note = document.getElementById('workoutNote').value.trim();
    const day = getDay();
    if (day.plan !== currentPlan) setTodayPlan(currentPlan);
    const d = getDay();
    const plan = PLANS[currentPlan];
    const checks = getChecks(currentPlan);
    let doneCount = 0;
    if (currentPlan === 'R') {
      doneCount = d.cardio ? 1 : plan.exercises.filter(e => checks[e.id]).length;
    } else {
      doneCount = plan.exercises.filter(e => d.exercises[e.id] || checks[e.id]).length;
      plan.exercises.forEach(e => {
        if (checks[e.id]) d.exercises[e.id] = true;
      });
    }
    const entry = {
      date: todayStr(),
      plan: currentPlan,
      note,
      doneCount,
      total: plan.exercises.length,
      at: new Date().toISOString()
    };
    const idx = state.workouts.findIndex(w => w.date === todayStr());
    if (idx >= 0) state.workouts[idx] = entry;
    else state.workouts.push(entry);
    state.lastPlan = { date: todayStr(), plan: currentPlan };
    save();
    toast('已保存 · ' + plan.short + '（' + doneCount + '/' + plan.exercises.length + '）');
    switchView('home');
    maybeCelebrate(getDay());
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
    document.getElementById('cfgTrainKcal').value = state.profile.trainingKcal || 2100;
    document.getElementById('cfgRestKcal').value = state.profile.restKcal || 1900;
    document.getElementById('cfgProtein').value = state.profile.dailyProtein || 140;
    document.getElementById('cfgWater').value = state.profile.waterMl || 2800;

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
    const color = key === 'fat' ? cssVar('--blue', '#00c2a8') : cssVar('--dn', '#00a894');

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
      ctx.fillStyle = cssVar('--card', '#ffffff');
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
  document.querySelectorAll('#planPills button').forEach(b => {
    b.addEventListener('click', () => {
      setTodayPlan(b.dataset.plan);
      renderHome();
      const day = getDay();
      toast('今日改为 · ' + (PLANS[b.dataset.plan] || {}).short + ' · ' + kcalModeLabel(day));
    });
  });
  const kcalModeChip = document.getElementById('kcalModeChip');
  if (kcalModeChip) kcalModeChip.addEventListener('click', promptKcalOverride);
  const nextTodoBtn = document.getElementById('nextTodo');
  if (nextTodoBtn) nextTodoBtn.addEventListener('click', activateNextTodo);
  document.querySelectorAll('#planSeg button').forEach(b => {
    b.addEventListener('click', () => {
      currentPlan = b.dataset.plan;
      state.lastPlan = { date: todayStr(), plan: currentPlan };
      getDay().plan = currentPlan;
      save();
      renderWorkout();
    });
  });
  document.getElementById('btnCompleteWorkout').addEventListener('click', completeWorkout);
  document.getElementById('btnResetChecks').addEventListener('click', () => {
    state.checks[todayStr() + '_' + currentPlan] = {};
    const day = getDay();
    if (day.plan === currentPlan) {
      day.exercises = {};
      day.cardio = false;
    }
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
    state.profile.trainingKcal = parseFloat(document.getElementById('cfgTrainKcal').value) || 2100;
    state.profile.restKcal = parseFloat(document.getElementById('cfgRestKcal').value) || 1900;
    state.profile.dailyKcal = Math.round((state.profile.trainingKcal + state.profile.restKcal) / 2);
    state.profile.dailyProtein = parseFloat(document.getElementById('cfgProtein').value) || 140;
    state.profile.waterMl = parseFloat(document.getElementById('cfgWater').value) || 2800;
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
        state = migrate(data);
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
    currentPlan = weekdayDefaultPlan();
    renderHome();
    toast('已清空并恢复默认基线');
  });
  document.getElementById('btnDismissCelebrate').addEventListener('click', dismissCelebration);
  document.querySelector('.cel-backdrop').addEventListener('click', dismissCelebration);

  window.addEventListener('resize', () => {
    if (document.getElementById('view-metrics').classList.contains('active')) drawChart();
  });
  window.addEventListener('scroll', () => {
    document.body.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

  function syncThemeColor() {
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
      meta.content = dark ? '#0b1220' : '#eef3f8';
    });
  }
  syncThemeColor();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncThemeColor);

  bindMealSheet();

  // ensure today day record exists; load dish catalog then paint
  getDay();
  currentPlan = suggestPlan();
  renderHome();

  loadMealCatalog().then(() => {
    renderHome();
    const bootDay = getDay();
    if (checklistStats(bootDay).complete && bootDay.celebrated && !bootDay.celebrateSeen) {
      showCelebration();
    }
  });
})();

# -<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#0f1720" />
  <title>2026 国庆川西反穿｜4人自驾共享看板</title>
  <meta name="description" content="2026 国庆川西反穿自驾共享行程、酒店、天气、费用与每日注意事项看板" />
  <link rel="preconnect" href="https://unpkg.com" crossorigin>
  <link rel="preconnect" href="https://api.open-meteo.com" crossorigin>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossorigin="" />
  <style>
    :root{
      --bg:#f4f5f2;
      --paper:#ffffff;
      --paper-2:#f8f9f7;
      --ink:#17202a;
      --muted:#6b7480;
      --line:#e4e7e2;
      --deep:#0f1720;
      --deep-2:#17232f;
      --accent:#2f6f63;
      --accent-soft:#dceae6;
      --gold:#a7834f;
      --gold-soft:#f3eadc;
      --danger:#b4534b;
      --warn:#a66c1f;
      --shadow:0 18px 50px rgba(25,34,41,.08);
      --radius:22px;
      --radius-sm:14px;
    }
    *{box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{
      margin:0;
      color:var(--ink);
      background:
        radial-gradient(circle at 5% 0%, rgba(47,111,99,.09), transparent 25%),
        radial-gradient(circle at 95% 5%, rgba(167,131,79,.08), transparent 27%),
        var(--bg);
      font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",Arial,sans-serif;
      line-height:1.58;
    }
    button,input,select,textarea{font:inherit}
    button{cursor:pointer}
    a{color:inherit}
    .shell{width:min(1180px,calc(100% - 28px));margin:0 auto;padding-bottom:80px}
    .hero{
      margin:18px auto 22px;
      border-radius:30px;
      background:
        linear-gradient(130deg,rgba(15,23,32,.98),rgba(23,35,47,.94)),
        radial-gradient(circle at 80% 20%,rgba(255,255,255,.12),transparent 30%);
      color:#fff;
      padding:34px 34px 30px;
      box-shadow:0 24px 70px rgba(13,23,31,.2);
      overflow:hidden;
      position:relative;
    }
    .hero:after{
      content:"";position:absolute;right:-80px;top:-110px;width:340px;height:340px;border:1px solid rgba(255,255,255,.10);border-radius:50%;
      box-shadow:0 0 0 58px rgba(255,255,255,.025),0 0 0 118px rgba(255,255,255,.02);
    }
    .hero-top{display:flex;gap:18px;align-items:flex-start;justify-content:space-between;position:relative;z-index:1}
    .eyebrow{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#b6c7c1;font-weight:700}
    h1{font-size:clamp(30px,5vw,54px);line-height:1.05;margin:10px 0 12px;letter-spacing:-.035em;font-weight:780}
    .hero-sub{max-width:720px;color:#d7dee3;font-size:15px;margin:0}
    .hero-actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end}
    .btn{
      border:1px solid var(--line);background:#fff;color:var(--ink);padding:10px 14px;border-radius:12px;font-weight:700;transition:.2s ease;display:inline-flex;align-items:center;gap:8px;justify-content:center;
    }
    .btn:hover{transform:translateY(-1px);box-shadow:0 8px 22px rgba(0,0,0,.08)}
    .btn.dark{background:rgba(255,255,255,.09);border-color:rgba(255,255,255,.16);color:#fff;backdrop-filter:blur(10px)}
    .btn.primary{background:var(--deep);border-color:var(--deep);color:#fff}
    .btn.ghost{background:transparent}
    .btn.small{padding:7px 10px;border-radius:10px;font-size:12px}
    .hero-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:28px;position:relative;z-index:1}
    .hero-stat{padding:16px 16px 15px;border:1px solid rgba(255,255,255,.12);border-radius:16px;background:rgba(255,255,255,.055);backdrop-filter:blur(8px)}
    .hero-stat span{display:block;color:#b9c3c9;font-size:12px;margin-bottom:5px}
    .hero-stat strong{font-size:18px;letter-spacing:-.01em}
    .navtabs{display:flex;gap:8px;overflow:auto;padding:2px 0 14px;scrollbar-width:none;position:sticky;top:0;z-index:50;background:linear-gradient(var(--bg) 75%,transparent)}
    .navtabs::-webkit-scrollbar{display:none}
    .navtabs a{white-space:nowrap;text-decoration:none;background:rgba(255,255,255,.86);border:1px solid var(--line);padding:9px 13px;border-radius:999px;color:#4f5965;font-size:13px;font-weight:700;backdrop-filter:blur(12px)}
    .navtabs a:hover{color:var(--deep);border-color:#cbd1cc}
    .section{margin:22px 0}
    .section-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin:0 2px 13px}
    .section-title{margin:0;font-size:22px;letter-spacing:-.02em}
    .section-note{font-size:12px;color:var(--muted);text-align:right}
    .grid{display:grid;gap:14px}
    .grid-2{grid-template-columns:1fr 1fr}
    .grid-3{grid-template-columns:repeat(3,1fr)}
    .card{background:var(--paper);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow)}
    .card-pad{padding:20px}
    .overview{display:grid;grid-template-columns:1.15fr .85fr;gap:14px}
    .route-summary{padding:22px}
    .route-line{font-size:15px;font-weight:750;line-height:1.75;margin:6px 0 0}
    .mini-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:18px}
    .mini-kpi{background:var(--paper-2);border:1px solid var(--line);border-radius:14px;padding:13px}
    .mini-kpi span{display:block;color:var(--muted);font-size:11px}
    .mini-kpi strong{display:block;margin-top:3px;font-size:17px}
    .alert{padding:18px 20px;background:linear-gradient(135deg,#fffaf2,#fff);border-color:#eee1ce}
    .alert strong{color:#75552b}
    .alert ul{margin:10px 0 0;padding-left:18px;color:#5f6063;font-size:13px}
    .map-card{padding:8px;overflow:hidden}
    #map{height:430px;border-radius:17px;background:#e9ece8}
    .map-fallback{display:none;padding:22px;color:var(--muted);font-size:13px}

    .day-list{display:grid;gap:14px}
    .day-card{overflow:hidden}
    .day-header{display:grid;grid-template-columns:100px 1fr auto;gap:18px;align-items:center;padding:18px 20px;border-bottom:1px solid var(--line)}
    .date-box{background:var(--deep);color:#fff;border-radius:16px;padding:12px 14px;text-align:center}
    .date-box .d{font-size:24px;font-weight:800;line-height:1}
    .date-box .wk{font-size:11px;color:#bfc8ce;margin-top:5px}
    .day-title h3{margin:0;font-size:18px;letter-spacing:-.01em}
    .day-title p{margin:4px 0 0;color:var(--muted);font-size:12px}
    .day-status{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:750;border-radius:999px;padding:8px 10px;background:#f2f4f2;color:#52605c;border:1px solid var(--line)}
    .dot{width:7px;height:7px;border-radius:50%;background:#9aa39e}
    .today .day-status{background:var(--accent-soft);color:var(--accent);border-color:#cfe1db}
    .today .day-status .dot{background:var(--accent)}
    .past .day-status{background:#eef1ee;color:#65706a}
    .day-body{display:grid;grid-template-columns:1.3fr .7fr;gap:0}
    .schedule{padding:18px 20px 20px;border-right:1px solid var(--line)}
    .schedule-top{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}
    .schedule-top strong{font-size:13px}
    .progress{height:8px;background:#edf0ed;border-radius:999px;overflow:hidden;flex:1;max-width:310px}
    .progress>i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--accent),#78a99e);border-radius:999px;transition:width .4s ease}
    .timeline{display:grid;gap:11px}
    .tl{display:grid;grid-template-columns:86px 14px 1fr;gap:10px;align-items:flex-start;font-size:13px}
    .tl time{color:#59636e;font-weight:700;font-variant-numeric:tabular-nums}
    .tl .pin{width:10px;height:10px;border-radius:50%;border:2px solid #aab4af;margin-top:5px;background:#fff;position:relative}
    .tl:not(:last-child) .pin:after{content:"";position:absolute;width:2px;background:#dfe4e0;height:28px;left:2px;top:8px}
    .tl.current .pin{border-color:var(--accent);background:var(--accent)}
    .tl.current .desc{font-weight:750;color:var(--accent)}
    .desc small{display:block;color:var(--muted);font-weight:500;margin-top:2px}
    .day-side{padding:18px 20px;background:#fbfcfa;display:grid;gap:12px;align-content:start}
    .weather{border:1px solid var(--line);border-radius:16px;padding:14px;background:#fff;min-height:116px}
    .weather-top{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}
    .weather-place{font-size:12px;color:var(--muted)}
    .weather-temp{font-size:26px;font-weight:800;letter-spacing:-.03em}
    .weather-meta{display:flex;gap:10px;flex-wrap:wrap;font-size:11px;color:#69727d;margin-top:8px}
    .weather-loading{font-size:12px;color:var(--muted);padding-top:10px}
    .hotel{border:1px solid var(--line);border-radius:16px;padding:14px;background:#fff}
    .hotel-head{display:flex;justify-content:space-between;gap:10px}
    .hotel-title{font-weight:800;font-size:13px}
    .tag{font-size:10px;border-radius:999px;padding:4px 7px;font-weight:800;background:#eef4f1;color:#477064;white-space:nowrap;height:max-content}
    .tag.pending{background:#f7eee1;color:#8b6530}
    .hotel-amount{font-size:20px;font-weight:850;margin-top:6px}
    .hotel-sub{font-size:11px;color:var(--muted);margin-top:2px}
    .note{border-radius:14px;padding:12px 13px;background:#f6f7f5;color:#59616a;font-size:12px}
    .note b{color:#30383f}

    .stay-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
    .stay-card{padding:15px;min-width:0}
    .stay-date{font-size:11px;color:var(--muted)}
    .stay-card h4{margin:7px 0 10px;font-size:14px;line-height:1.45;min-height:41px}
    .stay-price{font-size:22px;font-weight:850;letter-spacing:-.02em}
    .stay-person{font-size:11px;color:var(--muted);margin-top:3px}

    .expense-layout{display:grid;grid-template-columns:.78fr 1.22fr;gap:14px}
    .expense-summary{padding:20px}
    .summary-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
    .sum{background:var(--paper-2);border:1px solid var(--line);border-radius:14px;padding:12px}
    .sum span{font-size:11px;color:var(--muted);display:block}
    .sum strong{font-size:18px;margin-top:4px;display:block}
    .donut-wrap{display:grid;grid-template-columns:180px 1fr;align-items:center;gap:18px;margin-top:16px}
    canvas{max-width:100%}
    .legend{display:grid;gap:8px}
    .legend-item{display:flex;justify-content:space-between;gap:12px;border-bottom:1px dashed #e4e7e2;padding-bottom:7px;font-size:12px}
    .legend-item span{color:#646d77}
    .legend-item b{font-variant-numeric:tabular-nums}
    .expense-panel{padding:20px}
    .form-grid{display:grid;grid-template-columns:120px 130px 140px 1fr 110px auto;gap:8px}
    input,select{border:1px solid #dfe3df;background:#fff;border-radius:11px;padding:10px 11px;color:var(--ink);min-width:0}
    input:focus,select:focus{outline:2px solid rgba(47,111,99,.15);border-color:#93b5ad}
    .expense-table{margin-top:14px;border:1px solid var(--line);border-radius:14px;overflow:hidden}
    .expense-row{display:grid;grid-template-columns:92px 86px 110px 1fr 100px 44px;gap:8px;align-items:center;padding:10px 12px;border-bottom:1px solid var(--line);font-size:12px;background:#fff}
    .expense-row:last-child{border-bottom:none}
    .expense-row.head{background:#f6f7f5;color:#6a737c;font-size:11px;font-weight:750}
    .expense-row .amt{font-weight:800;text-align:right;font-variant-numeric:tabular-nums}
    .expense-row .del{border:none;background:transparent;color:#9aa2a8;padding:6px;border-radius:8px}
    .expense-row .del:hover{background:#f7eeee;color:var(--danger)}
    .pill{font-size:10px;font-weight:800;padding:3px 7px;border-radius:999px;background:#eef4f1;color:#477064;width:max-content}
    .pill.budget{background:#f7eee1;color:#8b6530}
    .empty{padding:22px;text-align:center;color:var(--muted);font-size:12px}

    .tips-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
    .tip{padding:16px}
    .tip i{font-style:normal;font-size:22px}
    .tip h4{margin:9px 0 6px;font-size:14px}
    .tip p{margin:0;color:var(--muted);font-size:12px}
    .footer{margin-top:28px;padding:20px 4px;color:#7a838b;font-size:11px;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}
    .toast{position:fixed;left:50%;bottom:22px;transform:translate(-50%,20px);opacity:0;pointer-events:none;background:#111c25;color:#fff;border-radius:12px;padding:11px 14px;font-size:12px;box-shadow:0 12px 30px rgba(0,0,0,.22);transition:.25s;z-index:999}
    .toast.show{opacity:1;transform:translate(-50%,0)}
    dialog{border:0;border-radius:20px;padding:0;max-width:560px;width:calc(100% - 28px);box-shadow:0 30px 80px rgba(0,0,0,.24)}
    dialog::backdrop{background:rgba(7,12,16,.55);backdrop-filter:blur(4px)}
    .modal{padding:22px}
    .modal h3{margin:0 0 8px}
    .modal p,.modal li{font-size:13px;color:#5f6871}
    .modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}

    @media (max-width:980px){
      .hero-stats{grid-template-columns:repeat(2,1fr)}
      .overview,.expense-layout{grid-template-columns:1fr}
      .stay-grid{grid-template-columns:repeat(2,1fr)}
      .tips-grid{grid-template-columns:repeat(2,1fr)}
      .day-body{grid-template-columns:1fr}
      .schedule{border-right:0;border-bottom:1px solid var(--line)}
      .form-grid{grid-template-columns:1fr 1fr 1fr}
      .form-grid .wide{grid-column:span 2}
      .expense-row{grid-template-columns:80px 72px 95px 1fr 86px 36px}
    }
    @media (max-width:700px){
      .shell{width:min(100% - 18px,1180px)}
      .hero{padding:24px 20px 22px;border-radius:24px}
      .hero-top{display:block}
      .hero-actions{justify-content:flex-start;margin-top:18px}
      .hero-stats{grid-template-columns:1fr 1fr;gap:8px}
      .hero-stat{padding:13px}
      .day-header{grid-template-columns:72px 1fr;gap:12px;padding:15px}
      .day-status{grid-column:1 / -1;width:max-content;padding:6px 9px}
      .date-box{padding:11px 8px}
      .date-box .d{font-size:20px}
      .schedule,.day-side{padding:15px}
      .schedule-top{align-items:flex-start;flex-direction:column}
      .progress{max-width:none;width:100%}
      .tl{grid-template-columns:72px 12px 1fr;gap:8px}
      .stay-grid{grid-template-columns:1fr}
      .summary-row{grid-template-columns:1fr 1fr}
      .summary-row .sum:last-child{grid-column:1/-1}
      .donut-wrap{grid-template-columns:140px 1fr;gap:12px}
      .form-grid{grid-template-columns:1fr 1fr}
      .form-grid .wide{grid-column:1/-1}
      .expense-table{overflow:auto}
      .expense-row{min-width:650px}
      .tips-grid{grid-template-columns:1fr 1fr}
      #map{height:360px}
    }
    @media (max-width:430px){
      .hero-stats,.tips-grid{grid-template-columns:1fr}
      .donut-wrap{grid-template-columns:1fr;justify-items:center}
      .legend{width:100%}
      .form-grid{grid-template-columns:1fr}
      .form-grid .wide{grid-column:auto}
    }
  </style>
</head>
<body>
  <main class="shell">
    <section class="hero">
      <div class="hero-top">
        <div>
          <div class="eyebrow">Roadbook · Sichuan West · 2026</div>
          <h1>川西反穿 · 4人自驾共享看板</h1>
          <p class="hero-sub">天府机场 → 雅安 → 康定 → 新都桥 → 塔公 → 丹巴 → 四姑娘山 → 卧龙 → 都江堰 → 天府机场。每天的路线、酒店、天气、费用与关键提醒，集中在一个页面里。</p>
        </div>
        <div class="hero-actions">
          <button class="btn dark" id="shareBtn">↗ 复制当前版本分享链接</button>
          <button class="btn dark" id="helpBtn">? 共享说明</button>
        </div>
      </div>
      <div class="hero-stats">
        <div class="hero-stat"><span>行程日期</span><strong>10.02 — 10.07</strong></div>
        <div class="hero-stat"><span>预计总里程</span><strong>1050–1150 km</strong></div>
        <div class="hero-stat"><span>成员 / 房间</span><strong>4 人 · 2 间房</strong></div>
        <div class="hero-stat"><span id="countdownLabel">距出发</span><strong id="countdownValue">—</strong></div>
      </div>
    </section>

    <nav class="navtabs">
      <a href="#overview">总览</a><a href="#mapSection">路线地图</a><a href="#daily">每日计划</a><a href="#hotels">住宿</a><a href="#expense">费用</a><a href="#tips">注意事项</a>
    </nav>

    <section class="section" id="overview">
      <div class="section-head"><h2 class="section-title">行程总览</h2><div class="section-note">国庆执行逻辑：导航时间 + 拥堵缓冲</div></div>
      <div class="overview">
        <div class="card route-summary">
          <div class="eyebrow" style="color:var(--accent)">CORE ROUTE</div>
          <div class="route-line">天府机场 → 雅安 → 泸定 → 康定 → 折多山 → 新都桥 → 塔公 → 八美 → 丹巴 → 小金 → 四姑娘山 → 卧龙 → 映秀 → 都江堰 → 天府机场</div>
          <div class="mini-kpis">
            <div class="mini-kpi"><span>预计驾驶</span><strong>27–32 h</strong></div>
            <div class="mini-kpi"><span>观光 / 拍照</span><strong>17–19 h</strong></div>
            <div class="mini-kpi"><span>核心景区</span><strong>双桥沟</strong></div>
          </div>
        </div>
        <div class="card alert">
          <strong>这趟最重要的 4 条执行原则</strong>
          <ul>
            <li>10/6 返机场是第一优先级，导航延迟就立刻取消顺路观光。</li>
            <li>折多山、塔公、双桥沟深处都属于高海拔区，停留和体力分配要克制。</li>
            <li>油量尽量保持半箱以上；山区不要等亮油灯再找加油站。</li>
            <li>每天出发前重新确认天气、道路施工/临时管制与实时导航。</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section" id="mapSection">
      <div class="section-head"><h2 class="section-title">路线地图</h2><div class="section-note">示意点位 · 真实驾驶以当天导航为准</div></div>
      <div class="card map-card"><div id="map"></div><div class="map-fallback" id="mapFallback">地图组件未加载。行程仍可正常查看；联网后刷新即可显示地图。</div></div>
    </section>

    <section class="section" id="daily">
      <div class="section-head"><h2 class="section-title">每日计划 & 实时天气</h2><div class="section-note" id="weatherUpdated">天气：等待联网更新</div></div>
      <div class="day-list" id="dayList"></div>
    </section>

    <section class="section" id="hotels">
      <div class="section-head"><h2 class="section-title">住宿情况</h2><div class="section-note">全部按 4 人 / 2 间房统计</div></div>
      <div class="stay-grid" id="stayGrid"></div>
    </section>

    <section class="section" id="expense">
      <div class="section-head"><h2 class="section-title">费用看板</h2><div class="section-note">新增数据保存在当前浏览器；可通过“分享链接”带给其他人</div></div>
      <div class="expense-layout">
        <div class="card expense-summary">
          <div class="summary-row">
            <div class="sum"><span>已支付</span><strong id="paidTotal">¥0</strong></div>
            <div class="sum"><span>待定 / 预算</span><strong id="budgetTotal">¥0</strong></div>
            <div class="sum"><span>当前预计总花费</span><strong id="grandTotal">¥0</strong></div>
          </div>
          <div class="donut-wrap">
            <canvas id="expenseChart" width="220" height="220"></canvas>
            <div class="legend" id="legend"></div>
          </div>
        </div>
        <div class="card expense-panel">
          <div class="form-grid">
            <input type="date" id="expenseDate" value="2026-10-02" />
            <select id="expenseCat"><option>住宿</option><option>租车</option><option>吃饭</option><option>门票</option><option>其他</option></select>
            <input type="number" id="expenseAmount" min="0" step="0.01" placeholder="金额 ¥" />
            <input class="wide" id="expenseNote" placeholder="备注，如：租车、晚餐、双桥沟门票" />
            <select id="expenseStatus"><option value="paid">已支付</option><option value="budget">预算 / 待定</option></select>
            <button class="btn primary" id="addExpense">＋ 添加</button>
          </div>
          <div class="expense-table" id="expenseTable"></div>
        </div>
      </div>
    </section>

    <section class="section" id="tips">
      <div class="section-head"><h2 class="section-title">当天注意事项</h2><div class="section-note">出发前 24 小时再次核对官方通告</div></div>
      <div class="tips-grid">
        <div class="card tip"><i>🏔️</i><h4>高海拔</h4><p>折多山约 4200–4300m；塔公约 3700m+；双桥沟深处约 3800m+。避免跑跳和长时间剧烈活动。</p></div>
        <div class="card tip"><i>🚙</i><h4>车辆</h4><p>每天出发前检查油量、轮胎、雨刷和手机离线地图。山区油量尽量保持半箱以上。</p></div>
        <div class="card tip"><i>🧥</i><h4>穿着</h4><p>10 月高海拔早晚可能接近 0℃，准备防风外套、抓绒/轻薄羽绒、帽子和手套。</p></div>
        <div class="card tip"><i>⏱️</i><h4>国庆缓冲</h4><p>导航 2 小时的山区路段按 2.5–3 小时考虑；10/6 成都方向返程额外留 2–3 小时机动。</p></div>
      </div>
    </section>

    <footer class="footer">
      <span>2026 国庆川西反穿 · 共享 Roadbook</span>
      <span>天气数据：Open‑Meteo · 路线地图：OpenStreetMap / Leaflet · 页面不保存定位信息</span>
    </footer>
  </main>

  <div class="toast" id="toast">已复制</div>
  <dialog id="helpDialog">
    <div class="modal">
      <h3>怎么把这个网页共享给另外 3 个人？</h3>
      <p>这个文件本身是一个单页 HTML。最省事的做法是把它上传到任意静态网页托管（例如 GitHub Pages、Netlify、Cloudflare Pages），得到一个网址后大家直接打开即可。</p>
      <ol>
        <li>天气会联网自动更新；进入天气预报窗口后，会显示每一天的最高/最低温、降水概率和风速。</li>
        <li>费用新增、删除会先保存在当前设备浏览器。</li>
        <li>点击顶部“复制当前版本分享链接”，会把当前费用数据编码进链接，发给其他人后可看到同一份快照。</li>
        <li>这是“共享快照”，不是多人实时协作数据库；如果你们要 4 个人同时改费用，我可以下一版接 Supabase / Firebase。</li>
      </ol>
      <div class="modal-actions"><button class="btn primary" onclick="document.getElementById('helpDialog').close()">知道了</button></div>
    </div>
  </dialog>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossorigin=""></script>
  <script>
    const TRIP = {
      start: '2026-10-02', end: '2026-10-07', people: 4,
      days: [
        {
          date:'2026-10-02', short:'10.02', weekday:'周五', route:'天府机场 → 雅安', distance:'185–195 km', drive:'3.5–4h', altitude:'约 450m → 600m',
          weather:{place:'雅安',lat:29.98,lon:103.01},
          hotel:{name:'雅安空山云宿城市民宿（万达广场店）',amount:407.36,status:'paid',detail:'212.62 + 194.74'},
          timeline:[
            ['16:00','天府机场落地','取行李'],['16:00–17:15','取车 / 验车','检查轮胎、油量、车况'],['17:15','机场出发','前往雅安'],['19:00','服务区','休息 10–15 分钟'],['20:30–21:30','抵达雅安','晚餐、补给、加油']
          ],
          note:'第一晚不安排景点，优先保证睡眠。'
        },
        {
          date:'2026-10-03', short:'10.03', weekday:'周六', route:'雅安 → 泸定 → 康定 → 折多山 → 新都桥', distance:'270–290 km', drive:'6.5–8h', altitude:'约 600m → 4300m → 3400m',
          weather:{place:'新都桥',lat:30.05,lon:101.49},
          hotel:{name:'上喜民宿（新都桥店）',amount:456,status:'paid',detail:'2 间房'},
          timeline:[
            ['06:00','雅安出发','尽量准时'],['08:30–09:00','泸定','休息 / 大渡河'],['10:30–11:30','康定老城','街巷、午饭、市场'],['13:00–13:30','折多山区域','短停 20–30 分钟'],['15:00–17:30','新都桥外围','村落 / 草甸 / 拍照'],['17:30–18:00','入住','晚餐、休息']
          ],
          note:'折多山是全程重要高点，停留宜短，不剧烈运动。'
        },
        {
          date:'2026-10-04', short:'10.04', weekday:'周日', route:'新都桥 → 塔公 → 八美 → 丹巴中路藏寨', distance:'150–170 km', drive:'4–5h', altitude:'3400m → 3750m → 2000m',
          weather:{place:'丹巴',lat:30.88,lon:101.89},
          hotel:{name:'谷道山居（中路藏寨店）',amount:674.99,status:'paid',detail:'332.99 + 342'},
          timeline:[
            ['07:00–08:20','新都桥晨景','晨雾、村庄、杨林、草甸'],['08:30','出发去塔公','沿途可短停'],['09:30–11:00','塔公','草原、寺院外围、藏区人文'],['11:45–12:45','八美','午饭、补给'],['12:45–16:00','八美 → 丹巴','草原 → 峡谷 → 河谷'],['16:30–18:30','中路藏寨','碉楼、村路、人文']
          ],
          note:'整趟最适合“边走边玩”的一天，总观光约 6–6.5 小时。'
        },
        {
          date:'2026-10-05', short:'10.05', weekday:'周一', route:'丹巴 → 小金 → 四姑娘山双桥沟', distance:'110–130 km', drive:'3–4h + 景区 6–7h', altitude:'1900m → 3800m+',
          weather:{place:'四姑娘山镇',lat:31.07,lon:102.84},
          hotel:{name:'四姑娘山景区住宿（待定）',amount:1200,status:'budget',detail:'总预算 · 2 间房'},
          timeline:[
            ['06:30','丹巴出发','可选 06:10–06:40 晨间拍摄'],['07:45–08:30','小金','早餐 / 加油 / 补水'],['09:30–10:00','进入双桥沟','停车、检票'],['10:00–11:00','观光车深入景区','高海拔区域'],['11:00–16:00','双桥沟核心游览','雪山、草甸、湖泊、森林'],['16:30–17:00','出景区 / 入住','晚餐、休息']
          ],
          note:'双桥沟是本次唯一完整景区日，不要每站都下车，保留体力。'
        },
        {
          date:'2026-10-06', short:'10.06', weekday:'周二', route:'四姑娘山 → 卧龙 → 映秀 → 都江堰 → 天府机场', distance:'270–300 km', drive:'8–10h', altitude:'3200m → 700m → 500m',
          weather:{place:'天府机场',lat:30.31,lon:104.44},
          hotel:{name:'天府云朵酒店（天府国际机场店）',amount:276,status:'paid',detail:'2 间房'},
          timeline:[
            ['05:30','四姑娘山镇出发','必须早走'],['08:00–08:30','卧龙','休息 / 早餐'],['09:00–10:00','卧龙 → 映秀','不安排景区'],['10:00–11:00','映秀 → 都江堰','继续返程'],['11:00–11:45','都江堰','午饭 / 加油'],['15:00–17:00','机场附近入住','整理行李、准备还车']
          ],
          note:'返机场是当天第一优先级；导航显示延迟就取消所有观光。'
        },
        {
          date:'2026-10-07', short:'10.07', weekday:'周三', route:'机场酒店 → 还车 → 航站楼', distance:'5–20 km', drive:'20–40min', altitude:'约 450–500m',
          weather:{place:'天府机场',lat:30.31,lon:104.44},
          hotel:null,
          timeline:[
            ['05:15','起床','最后检查'],['05:40','退房','带齐行李'],['05:50','前往还车点',''],['06:00–06:20','加油 / 还车 / 交接',''],['06:20–06:40','进入航站楼',''],['07:00 前','完成返机场目标','返程航班 8L9677']
          ],
          note:'返程日不安排任何额外景点，按航班节奏执行。'
        }
      ]
    };

    const defaultExpenses = [
      {id:'h1',date:'2026-10-02',cat:'住宿',amount:407.36,note:'雅安空山云宿城市民宿（万达广场店）',status:'paid'},
      {id:'h2',date:'2026-10-03',cat:'住宿',amount:456,note:'上喜民宿（新都桥店）',status:'paid'},
      {id:'h3',date:'2026-10-04',cat:'住宿',amount:674.99,note:'谷道山居（中路藏寨店）',status:'paid'},
      {id:'h4',date:'2026-10-05',cat:'住宿',amount:1200,note:'四姑娘山景区住宿（待定预算）',status:'budget'},
      {id:'h5',date:'2026-10-06',cat:'住宿',amount:276,note:'天府云朵酒店（天府国际机场店）',status:'paid'}
    ];

    const storageKey='westSichuanTripExpensesV1';
    let expenses=loadState();

    function loadState(){
      try{
        if(location.hash.startsWith('#trip=')){
          const encoded=location.hash.slice(6);
          const bytes=Uint8Array.from(atob(encoded),c=>c.charCodeAt(0));
          const json=new TextDecoder().decode(bytes);
          const parsed=JSON.parse(json);
          if(Array.isArray(parsed.expenses)){
            localStorage.setItem(storageKey,JSON.stringify(parsed.expenses));
            return parsed.expenses;
          }
        }
        const saved=JSON.parse(localStorage.getItem(storageKey)||'null');
        return Array.isArray(saved)?saved:structuredClone(defaultExpenses);
      }catch(e){return structuredClone(defaultExpenses)}
    }
    function saveState(){localStorage.setItem(storageKey,JSON.stringify(expenses));}
    function money(n){return '¥'+Number(n||0).toLocaleString('zh-CN',{minimumFractionDigits:0,maximumFractionDigits:2});}
    function toast(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1800)}

    function chinaParts(){
      const parts=new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());
      const obj=Object.fromEntries(parts.filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));
      return {date:`${obj.year}-${obj.month}-${obj.day}`,mins:Number(obj.hour)*60+Number(obj.minute)};
    }
    function dateDiffDays(a,b){const aa=new Date(a+'T00:00:00+08:00');const bb=new Date(b+'T00:00:00+08:00');return Math.ceil((bb-aa)/86400000)}
    function renderCountdown(){
      const now=chinaParts().date; const label=document.getElementById('countdownLabel'),val=document.getElementById('countdownValue');
      if(now<TRIP.start){label.textContent='距出发';val.textContent=dateDiffDays(now,TRIP.start)+' 天';}
      else if(now<=TRIP.end){label.textContent='行程状态';val.textContent='Day '+(dateDiffDays(TRIP.start,now)+1)+' / 6';}
      else{label.textContent='行程状态';val.textContent='已完成';}
    }

    function parseStartMin(t){
      const m=t.match(/(\d{1,2}):(\d{2})/); return m?Number(m[1])*60+Number(m[2]):0;
    }
    function dayProgress(day){
      const now=chinaParts();
      if(now.date<day.date)return {pct:0,next:'尚未开始'};
      if(now.date>day.date)return {pct:100,next:'已完成'};
      const starts=day.timeline.map(x=>parseStartMin(x[0]));
      const first=starts[0],last=Math.max(...starts,first+1);
      const pct=Math.max(3,Math.min(97,(now.mins-first)/(last-first)*100));
      let nextIndex=starts.findIndex(m=>m>now.mins);
      if(nextIndex<0)nextIndex=day.timeline.length-1;
      return {pct:Number.isFinite(pct)?pct:0,next:day.timeline[nextIndex][1]};
    }

    function renderDays(){
      const wrap=document.getElementById('dayList'); const now=chinaParts();
      wrap.innerHTML=TRIP.days.map((d,idx)=>{
        const state=now.date===d.date?'today':(now.date>d.date?'past':'future');
        const pr=dayProgress(d);
        const status=state==='today'?'今天执行':state==='past'?'已结束':'待出发';
        const timeline=d.timeline.map((t,i)=>`<div class="tl" data-time="${parseStartMin(t[0])}"><time>${t[0]}</time><span class="pin"></span><div class="desc">${t[1]}${t[2]?`<small>${t[2]}</small>`:''}</div></div>`).join('');
        const hotel=d.hotel?`<div class="hotel"><div class="hotel-head"><div class="hotel-title">${d.hotel.name}</div><span class="tag ${d.hotel.status==='budget'?'pending':''}">${d.hotel.status==='budget'?'待定':'已订'}</span></div><div class="hotel-amount">${money(d.hotel.amount)}</div><div class="hotel-sub">4 人 · 2 间房 · 人均 ${money(d.hotel.amount/4)} · ${d.hotel.detail}</div></div>`:'';
        return `<article class="card day-card ${state}" data-date="${d.date}">
          <div class="day-header">
            <div class="date-box"><div class="d">${d.short}</div><div class="wk">${d.weekday}</div></div>
            <div class="day-title"><h3>Day ${idx+1} · ${d.route}</h3><p>${d.distance} · ${d.drive} · ${d.altitude}</p></div>
            <div class="day-status"><span class="dot"></span>${status}</div>
          </div>
          <div class="day-body">
            <div class="schedule"><div class="schedule-top"><strong>今日执行进度 · <span class="nextNode">${pr.next}</span></strong><div class="progress"><i style="width:${pr.pct}%"></i></div></div><div class="timeline">${timeline}</div></div>
            <aside class="day-side"><div class="weather" id="weather-${idx}"><div class="weather-loading">${d.weather.place} · 正在获取天气…</div></div>${hotel}<div class="note"><b>注意：</b>${d.note}</div></aside>
          </div>
        </article>`;
      }).join('');
      highlightCurrentTimeline();
    }
    function highlightCurrentTimeline(){
      const now=chinaParts();
      document.querySelectorAll('.day-card').forEach(card=>{
        if(card.dataset.date!==now.date)return;
        const rows=[...card.querySelectorAll('.tl')];
        let current=0;
        rows.forEach((r,i)=>{if(Number(r.dataset.time)<=now.mins)current=i});
        rows.forEach((r,i)=>r.classList.toggle('current',i===current));
      });
    }

    function renderHotels(){
      const el=document.getElementById('stayGrid');
      const stays=TRIP.days.filter(d=>d.hotel);
      el.innerHTML=stays.map(d=>`<div class="card stay-card"><div class="stay-date">${d.short} → ${TRIP.days[TRIP.days.indexOf(d)+1]?.short||''}</div><h4>${d.hotel.name}</h4><div class="stay-price">${money(d.hotel.amount)}</div><div class="stay-person">${d.hotel.status==='budget'?'预算':'已支付'} · 人均 ${money(d.hotel.amount/4)}</div></div>`).join('');
    }

    const categoryOrder=['住宿','租车','吃饭','门票','其他'];
    const chartColors=['#2f6f63','#657a8c','#a7834f','#71856e','#b0725b'];
    function renderExpenses(){
      const paid=expenses.filter(x=>x.status==='paid').reduce((s,x)=>s+Number(x.amount),0);
      const budget=expenses.filter(x=>x.status==='budget').reduce((s,x)=>s+Number(x.amount),0);
      const total=paid+budget;
      document.getElementById('paidTotal').textContent=money(paid);
      document.getElementById('budgetTotal').textContent=money(budget);
      document.getElementById('grandTotal').textContent=money(total);
      const table=document.getElementById('expenseTable');
      const rows=[...expenses].sort((a,b)=>a.date.localeCompare(b.date));
      table.innerHTML=`<div class="expense-row head"><div>日期</div><div>分类</div><div>状态</div><div>备注</div><div style="text-align:right">金额</div><div></div></div>`+
        (rows.length?rows.map(x=>`<div class="expense-row"><div>${x.date.slice(5).replace('-','/')}</div><div>${x.cat}</div><div><span class="pill ${x.status==='budget'?'budget':''}">${x.status==='budget'?'预算':'已支付'}</span></div><div title="${x.note||''}">${x.note||'—'}</div><div class="amt">${money(x.amount)}</div><button class="del" data-id="${x.id}" title="删除">✕</button></div>`).join(''):`<div class="empty">暂时还没有费用记录</div>`);
      table.querySelectorAll('.del').forEach(btn=>btn.onclick=()=>{expenses=expenses.filter(x=>x.id!==btn.dataset.id);saveState();renderExpenses();});
      drawExpenseChart();
    }
    function drawExpenseChart(){
      const totals=categoryOrder.map(cat=>expenses.filter(x=>x.cat===cat).reduce((s,x)=>s+Number(x.amount),0));
      const total=totals.reduce((a,b)=>a+b,0);
      const canvas=document.getElementById('expenseChart'),ctx=canvas.getContext('2d');
      const w=canvas.width,h=canvas.height,cx=w/2,cy=h/2,r=78,lw=28;
      ctx.clearRect(0,0,w,h);ctx.lineWidth=lw;ctx.lineCap='butt';
      if(total<=0){ctx.strokeStyle='#e8ebe8';ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();}
      let angle=-Math.PI/2;
      totals.forEach((v,i)=>{if(v<=0)return;const a2=angle+(v/total)*Math.PI*2;ctx.strokeStyle=chartColors[i];ctx.beginPath();ctx.arc(cx,cy,r,angle,a2);ctx.stroke();angle=a2;});
      ctx.fillStyle='#1a242d';ctx.font='700 20px -apple-system,BlinkMacSystemFont,"Segoe UI"';ctx.textAlign='center';ctx.fillText(money(total),cx,cy-2);
      ctx.fillStyle='#7a8289';ctx.font='12px -apple-system,BlinkMacSystemFont,"Segoe UI"';ctx.fillText('预计总花费',cx,cy+20);
      const legend=document.getElementById('legend');
      legend.innerHTML=categoryOrder.map((cat,i)=>`<div class="legend-item"><span><i style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${chartColors[i]};margin-right:7px"></i>${cat}</span><b>${money(totals[i])}</b></div>`).join('');
    }
    document.getElementById('addExpense').onclick=()=>{
      const date=document.getElementById('expenseDate').value,cat=document.getElementById('expenseCat').value,amount=Number(document.getElementById('expenseAmount').value),note=document.getElementById('expenseNote').value.trim(),status=document.getElementById('expenseStatus').value;
      if(!date||!amount||amount<=0){toast('请填写日期和有效金额');return;}
      expenses.push({id:'e'+Date.now(),date,cat,amount,note,status});saveState();renderExpenses();document.getElementById('expenseAmount').value='';document.getElementById('expenseNote').value='';toast('费用已添加');
    };

    function weatherIcon(code){
      if([0].includes(code))return ['☀️','晴']; if([1,2].includes(code))return ['🌤️','少云']; if([3].includes(code))return ['☁️','阴']; if([45,48].includes(code))return ['🌫️','雾'];
      if([51,53,55,56,57].includes(code))return ['🌦️','毛毛雨']; if([61,63,65,66,67,80,81,82].includes(code))return ['🌧️','有雨']; if([71,73,75,77,85,86].includes(code))return ['🌨️','有雪']; if([95,96,99].includes(code))return ['⛈️','雷暴']; return ['⛅','天气'];
    }
    async function loadWeather(){
      let success=0;
      for(let i=0;i<TRIP.days.length;i++){
        const d=TRIP.days[i],box=document.getElementById('weather-'+i); if(!box)continue;
        try{
          const url=`https://api.open-meteo.com/v1/forecast?latitude=${d.weather.lat}&longitude=${d.weather.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=Asia%2FShanghai&forecast_days=16`;
          const data=await fetch(url,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('weather');return r.json()});
          const idx=data.daily?.time?.indexOf(d.date)??-1;
          const now=chinaParts();
          if(idx>=0){
            const code=data.daily.weather_code[idx],ico=weatherIcon(code); const max=data.daily.temperature_2m_max[idx],min=data.daily.temperature_2m_min[idx],rain=data.daily.precipitation_probability_max[idx],wind=data.daily.wind_speed_10m_max[idx];
            let live='';
            if(now.date===d.date && data.current){const ci=weatherIcon(data.current.weather_code);live=`<div class="hotel-sub" style="margin-top:6px">实时：${ci[0]} ${data.current.temperature_2m}℃ · 体感 ${data.current.apparent_temperature}℃ · 风 ${data.current.wind_speed_10m} km/h</div>`;}
            box.innerHTML=`<div class="weather-top"><div><div class="weather-place">${d.weather.place} · ${d.short}</div><div class="weather-temp">${ico[0]} ${max}° / ${min}°</div></div><div class="tag">${ico[1]}</div></div><div class="weather-meta"><span>降水概率 ${rain??'—'}%</span><span>最大风速 ${wind??'—'} km/h</span></div>${live}`;
          }else{
            const c=data.current; const ci=c?weatherIcon(c.weather_code):['⛅',''];
            box.innerHTML=`<div class="weather-top"><div><div class="weather-place">${d.weather.place} · ${d.short}</div><div class="weather-temp">${ci[0]} 等待预报</div></div><div class="tag pending">未进 16 日窗口</div></div><div class="weather-meta"><span>临近出发会自动显示当天最高 / 最低温、降水和风速</span></div>${c?`<div class="hotel-sub" style="margin-top:8px">当前当地：${c.temperature_2m}℃ · 体感 ${c.apparent_temperature}℃</div>`:''}`;
          }
          success++;
        }catch(e){box.innerHTML=`<div class="weather-place">${d.weather.place}</div><div class="weather-loading">天气暂时无法联网获取，刷新页面后会自动重试。</div>`;}
      }
      if(success)document.getElementById('weatherUpdated').textContent='天气已联网更新 · '+new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());
    }

    function initMap(){
      try{
        if(!window.L)throw new Error('Leaflet missing');
        const map=L.map('map',{zoomControl:true,scrollWheelZoom:false,attributionControl:true}).setView([30.55,102.6],7);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© OpenStreetMap'}).addTo(map);
        const pts=[
          ['天府机场',30.31,104.44],['雅安',29.98,103.01],['泸定',29.92,102.23],['康定',30.05,101.96],['折多山',30.07,101.80],['新都桥',30.05,101.49],['塔公',30.32,101.54],['八美',30.52,101.55],['丹巴',30.88,101.89],['小金',31.00,102.36],['四姑娘山',31.07,102.84],['卧龙',31.03,103.18],['映秀',31.06,103.49],['都江堰',30.99,103.62],['天府机场',30.31,104.44]
        ];
        const latlngs=pts.map(p=>[p[1],p[2]]);
        L.polyline(latlngs,{color:'#2f6f63',weight:4,opacity:.85}).addTo(map);
        pts.forEach((p,i)=>L.circleMarker([p[1],p[2]],{radius:(i===0||i===pts.length-1)?7:5,color:'#0f1720',weight:2,fillColor:i===0?'#a7834f':'#ffffff',fillOpacity:1}).bindTooltip(`${i===0?'起点':i===pts.length-1?'终点':p[0]}`,{direction:'top'}).addTo(map));
        map.fitBounds(latlngs,{padding:[24,24]});
      }catch(e){document.getElementById('map').style.display='none';document.getElementById('mapFallback').style.display='block';}
    }

    function encodeState(){
      const json=JSON.stringify({expenses}); const bytes=new TextEncoder().encode(json); let s='';bytes.forEach(b=>s+=String.fromCharCode(b));return btoa(s);
    }
    document.getElementById('shareBtn').onclick=async()=>{
      if(location.protocol==='file:'){
        document.getElementById('helpDialog').showModal();toast('本地文件先上传到静态托管再分享');return;
      }
      const url=location.href.split('#')[0]+'#trip='+encodeState();
      try{await navigator.clipboard.writeText(url);toast('当前版本分享链接已复制');}catch(e){prompt('复制下面的分享链接：',url)}
    };
    document.getElementById('helpBtn').onclick=()=>document.getElementById('helpDialog').showModal();

    renderCountdown();renderDays();renderHotels();renderExpenses();initMap();loadWeather();
    setInterval(()=>{renderCountdown();renderDays();},60000);
  </script>
</body>
</html>

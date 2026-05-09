const API = 'http://127.0.0.1:5000/api';
const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#06b6d4','#a855f7'];
const charts = {};
let classData = null, allClassResults = null, networkData = null, clusterData = null;
let currentAlgo = 'decision_tree';

function mkChart(id, type, data, options={}) {
  if (charts[id]) charts[id].destroy();
  const ctx = document.getElementById(id);
  if (!ctx) return null;
  charts[id] = new Chart(ctx, { type, data, options: { responsive:true, plugins:{legend:{labels:{color:'#94a3b8'}}}, scales: type!=='pie'&&type!=='doughnut' ? { x:{ticks:{color:'#64748b'},grid:{color:'#1a2235'}}, y:{ticks:{color:'#64748b'},grid:{color:'#1a2235'}} } : {}, ...options }});
  return charts[id];
}

async function api(path) {
  try { const r = await fetch(API+path); return await r.json(); }
  catch(e) { console.error(e); return null; }
}

function showPage(name) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('page-'+name).classList.add('active');
  document.getElementById('nav-'+name).classList.add('active');
  const titles = {overview:'📊 Dashboard',preprocessing:'🔧 Veri Önişleme',stats:'📊 İstatistikler',correlation:'🔗 Korelasyon',classification:'🌳 Sınıflandırma',clustering:'🫧 Demetleme',network:'🕸️ Sosyal Ağ Analizi',predict:'🔮 Canlı Tahmin',summary:'🏆 Analiz Özeti',tablo:'📄 Veri Tablosu'};
  document.getElementById('topbar-title').textContent = titles[name]||name;
  if(name==='preprocessing') loadPreprocessing();
  if(name==='stats') loadStats();
  if(name==='correlation') loadCorrelation();
  if(name==='classification') loadClassification();
  if(name==='clustering') { loadClustering(); setTimeout(loadClusterProfiles, 500); }
  if(name==='network') loadNetwork();
  if(name==='predict') loadPredictPage();
  if(name==='summary') loadSummary();
  if(name==='tablo') loadTablo(1);
}

async function initDashboard() {
  const info = await api('/info');
  if(!info){ document.getElementById('server-status').textContent='Bağlantı hatası'; return; }
  document.getElementById('server-status').textContent='Sunucu aktif';
  document.getElementById('stat-rows').textContent = info.rows;
  document.getElementById('stat-cols').textContent = info.cols-2;
  document.getElementById('stat-missing').textContent = '0';
  classData = info.class_distribution;
  if(classData) {
    mkChart('classDistChart','doughnut',{
      labels: classData.labels.map(l => l==='Dusuk'?'🔴 Düşük':l==='Orta'?'🟡 Orta':'🟢 Yüksek'),
      datasets:[{data:classData.values, backgroundColor:['#ef4444','#f59e0b','#10b981'], borderWidth:2, borderColor:'#0a0e1a'}]
    });
  }
}

async function loadPreprocessing() {
  const outliers = await api('/outliers');
  if(outliers) {
    let total=0, rows='';
    Object.entries(outliers).forEach(([col,v])=>{
      total+=v.count;
      rows+=`<tr><td>${col}</td><td>${v.count}</td><td>${v.lower_bound}</td><td>${v.upper_bound}</td></tr>`;
    });
    document.getElementById('total-outliers').textContent=total;
    document.getElementById('outlier-content').innerHTML=`<div class="table-wrap"><table><thead><tr><th>Özellik</th><th>Aykırı Sayı</th><th>Alt Sınır</th><th>Üst Sınır</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }
  loadHistogram();
  loadNormalization('minmax');
}

async function loadHistogram() {
  const col = document.getElementById('hist-col-select').value;
  const d = await api('/histogram/'+col);
  if(!d) return;
  mkChart('histogramChart','bar',{
    labels:d.bins,
    datasets:[{label:col, data:d.counts, backgroundColor:'rgba(99,102,241,0.6)', borderColor:'#6366f1', borderWidth:1}]
  });
}

async function loadNormalization(method) {
  document.getElementById('norm-minmax-btn').classList.toggle('active',method==='minmax');
  document.getElementById('norm-zscore-btn').classList.toggle('active',method==='zscore');
  const d = await api('/normalization?method='+method);
  if(!d) return;
  const cols = d.columns.slice(0,6);
  let head = '<tr>'+cols.map(c=>`<th>${c}</th>`).join('')+'</tr>';
  let orig = d.original_sample.map(r=>'<tr>'+r.slice(0,6).map(v=>`<td>${v}</td>`).join('')+'</tr>').join('');
  let norm = d.normalized_sample.map(r=>'<tr>'+r.slice(0,6).map(v=>`<td style="color:var(--accent-light)">${v}</td>`).join('')+'</tr>').join('');
  document.getElementById('norm-content').innerHTML=`
    <p style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Yöntem: <b style="color:var(--accent-light)">${d.method}</b></p>
    <p style="font-size:12px;color:var(--text-secondary);margin-bottom:4px;">🔹 Orijinal:</p>
    <div class="table-wrap"><table><thead>${head}</thead><tbody>${orig}</tbody></table></div>
    <p style="font-size:12px;color:var(--text-secondary);margin:12px 0 4px;">🔸 Normalize:</p>
    <div class="table-wrap"><table><thead>${head}</thead><tbody>${norm}</tbody></table></div>`;
}

async function loadStats() {
  const stats = await api('/stats');
  if(!stats) return;
  let rows='';
  Object.entries(stats).forEach(([col,v])=>{
    rows+=`<tr><td><b>${col}</b></td><td>${v.mean}</td><td>${v.median}</td><td>${v.mode}</td><td>${v.std}</td><td>${v.min}</td><td>${v.max}</td><td>${v.q1}</td><td>${v.q3}</td><td>${v.iqr}</td></tr>`;
  });
  document.getElementById('stats-table-content').innerHTML=`<div class="table-wrap"><table><thead><tr><th>Özellik</th><th>Ortalama</th><th>Medyan</th><th>Mod</th><th>Std</th><th>Min</th><th>Max</th><th>Q1</th><th>Q3</th><th>IQR</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  const cols=Object.keys(stats), means=cols.map(c=>stats[c].mean);
  const maxM=Math.max(...means);
  mkChart('meanBarChart','bar',{
    labels:cols.map(c=>c.replace(/_/g,' ')),
    datasets:[{label:'Ortalama', data:means, backgroundColor:cols.map((_,i)=>COLORS[i%COLORS.length])}]
  });
  const col=document.getElementById('box-col-select').value;
  loadBoxPlot();
}

async function loadBoxPlot() {
  const col=document.getElementById('box-col-select').value;
  const stats=await api('/stats');
  if(!stats||!stats[col]) return;
  const v=stats[col];
  document.getElementById('boxplot-info').innerHTML=`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;">
      <div class="metric-item"><div class="metric-value">${v.mean}</div><div class="metric-name">Ortalama</div></div>
      <div class="metric-item"><div class="metric-value">${v.median}</div><div class="metric-name">Medyan</div></div>
      <div class="metric-item"><div class="metric-value">${v.std}</div><div class="metric-name">Std Sapma</div></div>
      <div class="metric-item"><div class="metric-value">${v.iqr}</div><div class="metric-name">IQR</div></div>
      <div class="metric-item"><div class="metric-value">${v.min}</div><div class="metric-name">Min</div></div>
      <div class="metric-item"><div class="metric-value">${v.max}</div><div class="metric-name">Max</div></div>
    </div>`;
}

async function loadCorrelation() {
  const d = await api('/correlation');
  if(!d) return;
  const cols=d.columns, mat=d.matrix;
  let html=`<div class="table-wrap"><table><thead><tr><th></th>${cols.map(c=>`<th style="font-size:10px">${c.replace('_',' ')}</th>`).join('')}</tr></thead><tbody>`;
  mat.forEach((row,i)=>{
    html+=`<tr><td><b style="font-size:11px">${cols[i].replace('_',' ')}</b></td>`;
    row.forEach((val,j)=>{
      const abs=Math.abs(val), r=Math.round(abs*180), g=i===j?100:Math.round((1-abs)*80), b=val>0?Math.round(abs*220):50;
      const bg=i===j?'rgba(99,102,241,0.3)':`rgba(${val>0?'99,102,241':'239,68,68'},${abs*0.6})`;
      const color=abs>0.3?'#f1f5f9':'#64748b';
      html+=`<td style="background:${bg};color:${color};text-align:center;font-size:11px;font-family:monospace">${val.toFixed(2)}</td>`;
    });
    html+='</tr>';
  });
  html+='</tbody></table></div>';
  document.getElementById('corr-content').innerHTML=html;

  const pairs=[];
  cols.forEach((c1,i)=>cols.forEach((c2,j)=>{if(j>i)pairs.push({pair:`${c1.replace('_',' ')} / ${c2.replace('_',' ')}`,val:mat[i][j],abs:Math.abs(mat[i][j])})}));
  pairs.sort((a,b)=>b.abs-a.abs);
  const top=pairs.slice(0,8);
  let trows=top.map((p,i)=>`<tr><td>${i+1}</td><td>${p.pair}</td><td style="color:${p.val>0?'var(--green-light)':'var(--red)'};font-family:monospace">${p.val.toFixed(4)}</td><td><div class="progress-bar"><div class="progress-fill" style="width:${p.abs*100}%;background:${p.val>0?'var(--green)':'var(--red)'}"></div></div></td></tr>`).join('');
  document.getElementById('top-corr-content').innerHTML=`<div class="table-wrap"><table><thead><tr><th>#</th><th>Özellik Çifti</th><th>Korelasyon</th><th>Güç</th></tr></thead><tbody>${trows}</tbody></table></div>`;
}

async function loadClassification() {
  const all = await api('/classification/all');
  if(!all) return;
  allClassResults=all;
  renderComparison(all.comparison, all.param_table, all.best, all.best_reason);
  loadTreeRules();
  loadFeatureImportance();
  // ilk algo kartını sec
  const firstKey = all.comparison[0] ? all.comparison[0].key : 'c45';
  selectAlgo(firstKey);
  // Algo kartları güncelle (8 algoritma için)
  renderAlgoCards(all.comparison);
}

async function loadFeatureImportance() {
  const d = await api('/feature_importance');
  if(!d) return;
  // Üst bilgi
  document.getElementById('feature-importance-info').innerHTML=
    `<span class="badge badge-indigo">⭐ En Önemli: ${d.top_feature}</span>
     <span class="badge badge-green" style="margin-left:8px;">Etki: %${d.top_feature_pct}</span>
     <span style="font-size:11px;color:var(--text-muted);margin-left:10px;">Random Forest ile hesaplandı</span>`;
  mkChart('featureImportanceChart','bar',{
    labels: d.features,
    datasets:[
      {label:'Random Forest (%)', data:d.random_forest, backgroundColor:'rgba(99,102,241,0.7)', borderColor:'#6366f1', borderWidth:1},
      {label:'Karar Ağacı (%)',    data:d.decision_tree,  backgroundColor:'rgba(16,185,129,0.5)',  borderColor:'#10b981',  borderWidth:1}
    ]
  }, {indexAxis:'y', scales:{x:{ticks:{color:'#64748b'},grid:{color:'#1a2235'},title:{display:true,text:'Göreceli Önem (%)',color:'#94a3b8'}}}});
}

function renderAlgoCards(comparison) {
  const icons = {id3:'🌳', c45:'🌳', cart:'🌳', naive_bayes:'📊', knn:'📍', svm:'📐', ann:'🧠', adaboost:'🚀', xgboost:'⚡', random_forest:'🌲'};
  const container = document.getElementById('algo-cards-container') || document.querySelector('.algo-cards');
  if(!container) return;
  container.innerHTML = comparison.map(r => `
    <div class="algo-card" id="algo-card-${r.key}" onclick="selectAlgo('${r.key}')">
      <div class="algo-card-icon">${icons[r.key]||'🤖'}</div>
      <div class="algo-card-name" style="font-size:11px;">${r.kisa}</div>
      <div class="algo-card-tag" style="color:${r.color};font-weight:700;">${r.f1}%</div>
    </div>`).join('');
}

function renderComparison(comparison, paramTable, best, bestReason) {
  if(!paramTable) {
    // fallback eski format
    const medals=['🥇','🥈','🥉'];
    let rows=comparison.map((r,i)=>`<tr><td>${medals[i]||i+1}</td><td>${r.algorithm}</td><td>${r.accuracy}%</td><td>${r.precision}%</td><td>${r.recall}%</td><td>${r.f1}%</td><td>${r.cv_mean}%</td></tr>`).join('');
    document.getElementById('comparison-table-content').innerHTML=`<div class="table-wrap"><table><thead><tr><th>#</th><th>Algoritma</th><th>Accuracy</th><th>Kesinlik</th><th>Anma</th><th>F1</th><th>CV</th></tr></thead><tbody>${rows}</tbody></table></div>`;
    return;
  }

  // ==== PARAMETRE=SATIR, ALGORİTMA=SÜTUN TABLOSU ====
  const algos = paramTable.algorithms;
  let thead = '<tr><th style="min-width:180px;">📋 Parametre / Metrik</th>';
  algos.forEach(a => {
    thead += `<th style="color:${a.color};font-size:11px;text-align:center;min-width:90px;">${a.kisa}</th>`;
  });
  thead += '</tr>';

  let tbody = '';
  paramTable.rows.forEach(row => {
    const isError = row.metric.includes('Hata');
    const vals = algos.map(a => parseFloat(row.values[a.key]) || 0);
    const best_val = isError ? Math.min(...vals.filter(v=>v>0)) : Math.max(...vals);
    tbody += `<tr><td style="font-weight:600;font-size:12px;padding:10px 14px;">${row.metric}</td>`;
    algos.forEach(a => {
      const v = row.values[a.key];
      const num = parseFloat(v) || 0;
      const isBest = num > 0 && Math.abs(num - best_val) < 0.011;
      const style = isBest ? `background:${a.color}22;color:${a.color};font-weight:800;border-radius:6px;` : '';
      const unit = (v === '—' || row.metric.includes('AUC') || row.metric.includes('ROC')) ? '' : '%';
      tbody += `<td style="text-align:center;${style}">${v}${unit}</td>`;
    });
    tbody += '</tr>';
  });

  document.getElementById('comparison-table-content').innerHTML = `
    <div style="overflow-x:auto;margin-top:12px;">
      <table style="width:100%;border-collapse:collapse;">
        <thead style="background:var(--bg-primary);position:sticky;top:0;">${thead}</thead>
        <tbody>${tbody}</tbody>
      </table>
    </div>
    <div style="font-size:11px;color:var(--text-muted);margin-top:8px;text-align:right;">
      🟢 Renkli hücre = o metrikte en iyi algoritma
    </div>`;

  // ==== EN İYİ ALGORİTMA KUTUSU ====
  let winnerEl = document.getElementById('winner-box');
  if(!winnerEl) {
    winnerEl = document.createElement('div');
    winnerEl.id = 'winner-box';
    document.getElementById('comparison-table-content').after(winnerEl);
  }
  winnerEl.innerHTML = `
    <div style="background:linear-gradient(135deg,${best.color}22,${best.color}08);
                border:2px solid ${best.color};border-radius:var(--radius);
                padding:20px;margin-top:20px;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
        <span style="font-size:40px;">🏆</span>
        <div>
          <div style="font-size:14px;color:var(--text-muted);margin-bottom:2px;">★ En Başarılı Algoritma</div>
          <div style="font-size:20px;font-weight:800;color:${best.color};">${best.algorithm}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px;">
        <div style="background:var(--bg-card);border-radius:8px;padding:10px;text-align:center;">
          <div style="font-size:20px;font-weight:800;color:${best.color};">${best.accuracy}%</div>
          <div style="font-size:10px;color:var(--text-muted);">Accuracy</div>
        </div>
        <div style="background:var(--bg-card);border-radius:8px;padding:10px;text-align:center;">
          <div style="font-size:20px;font-weight:800;color:${best.color};">${best.f1}%</div>
          <div style="font-size:10px;color:var(--text-muted);">F-Ölçütü (F1)</div>
        </div>
        <div style="background:var(--bg-card);border-radius:8px;padding:10px;text-align:center;">
          <div style="font-size:20px;font-weight:800;color:${best.color};">${best.mean_auc||'—'}</div>
          <div style="font-size:10px;color:var(--text-muted);">ROC / AUC</div>
        </div>
        <div style="background:var(--bg-card);border-radius:8px;padding:10px;text-align:center;">
          <div style="font-size:20px;font-weight:800;color:${best.color};">${best.cv_mean}%</div>
          <div style="font-size:10px;color:var(--text-muted);">CV (5-Fold)</div>
        </div>
      </div>
      <div style="background:var(--bg-card);border-radius:8px;padding:14px;font-size:13px;
                  color:var(--text-secondary);line-height:1.8;border-left:3px solid ${best.color};">
        📝 <b>Seçim Ge-Rekçesi (Final Raporu İçin):</b><br>${bestReason}
      </div>
    </div>`;
}

async function loadTreeRules() {
  const d=await api('/classification/tree/rules');
  if(!d) return;
  document.getElementById('tree-rules-content').innerHTML=`
    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <span class="badge badge-indigo">Derinlik: ${d.depth}</span>
      <span class="badge badge-green">Yaprak: ${d.leaves}</span>
    </div>
    <div class="rule-box">${d.rules}</div>`;
}

function selectAlgo(key) {
  document.querySelectorAll('.algo-card').forEach(c=>c.classList.remove('selected'));
  const card = document.getElementById('algo-card-'+key);
  if(card) card.classList.add('selected');
  currentAlgo=key;
  if(!allClassResults||!allClassResults.results) return;
  const res=allClassResults.results[key];
  if(!res) { document.getElementById('algo-detail-content').innerHTML='<div class="loader">Veri yok</div>'; return; }

  const cls=['Düşük','Orta','Yüksek'];
  const cm = res.confusion_matrix || [[0,0,0],[0,0,0],[0,0,0]];
  const cmHtml = cm.map((row,i)=>`<tr><td style="color:var(--text-muted);font-size:11px">${cls[i]}</td>${
    row.map((v,j)=>{ const bg=i===j?'rgba(16,185,129,0.4)':'rgba(239,68,68,0.2)'; return `<td><div class="cm-cell" style="background:${bg}">${v}</div></td>`; }).join('')
  }</tr>`).join('');

  let rocHtml='';
  if(res.roc_data&&Object.keys(res.roc_data).length>0){
    const datasets=Object.entries(res.roc_data).map(([name,d],i)=>({
      label:`${name} (AUC=${d.auc})`,data:d.fpr.map((x,j)=>({x,y:d.tpr[j]})),
      borderColor:COLORS[i],fill:false,pointRadius:0,tension:0.1
    }));
    rocHtml=`<div class="card" style="margin-top:16px;"><div class="card-title">📈 ROC Eğrisi</div><div class="card-subtitle">True Positive Rate vs False Positive Rate</div><div class="chart-wrap"><canvas id="rocChart" height="260"></canvas></div></div>`;
    setTimeout(()=>{ mkChart('rocChart','scatter',{datasets},{scales:{x:{min:0,max:1,title:{display:true,text:'FPR',color:'#94a3b8'}},y:{min:0,max:1,title:{display:true,text:'TPR',color:'#94a3b8'}}},showLine:true}); },100);
  }

  const cvBadges=(res.cv_scores||[]).map((s,i)=>`<span class="badge badge-indigo">Fold ${i+1}: ${s}%</span>`).join('');

  document.getElementById('algo-detail-content').innerHTML=`
    <div class="card fade-in">
      <div class="card-title">${res.algorithm} <span class="hafta-tag">${res.hafta||''}</span></div>
      <div class="card-subtitle">Eğitim: 700 kayıt | Test: 300 kayıt | Holdout 70/30</div>
      <div class="metric-grid">
        <div class="metric-item"><div class="metric-value">🎯 ${res.accuracy}%</div><div class="metric-name">Accuracy (Doğruluk)</div></div>
        <div class="metric-item"><div class="metric-value">❌ ${res.error}%</div><div class="metric-name">Hata Oranı</div></div>
        <div class="metric-item"><div class="metric-value">🔍 ${res.precision}%</div><div class="metric-name">Kesinlik (Precision)</div></div>
        <div class="metric-item"><div class="metric-value">📣 ${res.recall}%</div><div class="metric-name">Anma (Recall)</div></div>
        <div class="metric-item"><div class="metric-value">⚖️ ${res.f1}%</div><div class="metric-name">F-Ölçütü (F1)</div></div>
        <div class="metric-item"><div class="metric-value">📈 ${res.mean_auc||'—'}</div><div class="metric-name">ROC / AUC</div></div>
      </div>
      <div style="background:var(--bg-primary);padding:14px;border-radius:8px;margin-bottom:16px;">
        <div style="font-size:12px;color:var(--text-secondary);margin-bottom:8px;">🔄 5-Fold Cross Validation: <b style="color:var(--accent-light)">${res.cv_mean}% ± ${res.cv_std}%</b></div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">${cvBadges}</div>
      </div>
      <div class="card-title" style="margin-bottom:12px;">🎯 Karışıklık Matrisi</div>
      <div style="overflow-x:auto;"><table><thead><tr><th></th>${cls.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>${cmHtml}</tbody></table></div>
    </div>${rocHtml}`;
}

async function loadClustering() {
  const d=await api('/clustering/all');
  if(!d) return;
  clusterData=d;
  const el=d.elbow;
  document.getElementById('elbow-content').innerHTML=`
    <div style="margin-bottom:12px;"><span class="badge badge-green">Optimal K: ${d.optimal_k}</span> <span class="badge badge-indigo">Silhouette ile seçildi</span></div>
    <canvas id="elbowChart" height="200"></canvas>`;
  mkChart('elbowChart','line',{
    labels:el.k_values,
    datasets:[
      {label:'SSE',data:el.sse_values,borderColor:'#6366f1',backgroundColor:'rgba(99,102,241,0.1)',yAxisID:'y',tension:0.3},
      {label:'Silhouette',data:el.silhouette_values,borderColor:'#10b981',backgroundColor:'rgba(16,185,129,0.1)',yAxisID:'y1',tension:0.3}
    ]
  },{scales:{y:{position:'left',ticks:{color:'#6366f1'}},y1:{position:'right',ticks:{color:'#10b981'}}}});

  const km=d.kmeans;
  document.getElementById('kmeans-content').innerHTML=`
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
      <span class="badge badge-indigo">K=${km.k}</span>
      <span class="badge badge-green">Silhouette: ${km.silhouette_score}</span>
      <span class="badge badge-orange">SSE: ${km.sse}</span>
    </div>
    <div class="table-wrap"><table><thead><tr><th>Küme</th><th>Boyut</th><th>Silhouette</th></tr></thead><tbody>
    ${km.cluster_stats.map(c=>`<tr><td>Küme ${c.cluster}</td><td>${c.size}</td><td>${c.silhouette_avg}</td></tr>`).join('')}
    </tbody></table></div>`;

  const scatter=km.scatter_pca;
  const grouped={};
  scatter.forEach(p=>{if(!grouped[p.cluster])grouped[p.cluster]=[];grouped[p.cluster].push({x:p.x,y:p.y});});
  mkChart('kmeansScatterChart','scatter',{
    datasets:Object.entries(grouped).map(([k,pts])=>({label:`Küme ${k}`,data:pts,backgroundColor:COLORS[k%COLORS.length]+'99',pointRadius:3}))
  });

  const ag=d.hierarchical;
  document.getElementById('hierarchical-content').innerHTML=`
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
      <span class="badge badge-cyan">Ward Linkage</span>
      <span class="badge badge-green">Silhouette: ${ag.silhouette_score}</span>
    </div>
    <div class="table-wrap"><table><thead><tr><th>Küme</th><th>Boyut</th></tr></thead><tbody>
    ${ag.cluster_sizes.map(c=>`<tr><td>Küme ${c.cluster}</td><td>${c.size}</td></tr>`).join('')}
    </tbody></table></div>
    <div style="font-size:12px;color:var(--text-muted);margin-top:12px;">📊 Dendrogram: ${ag.dendrogram_data.length} birleştirme adımı hesaplandı</div>`;

  const db=d.dbscan;
  document.getElementById('dbscan-content').innerHTML=`
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
      <span class="badge badge-indigo">eps=${db.eps}</span>
      <span class="badge badge-orange">minPts=${db.min_samples}</span>
      <span class="badge badge-red">Gürültü: ${db.n_noise}</span>
    </div>
    <p style="font-size:13px;margin-bottom:8px;color:var(--text-secondary)">Bulunan Küme: <b style="color:var(--accent-light)">${db.n_clusters}</b></p>
    ${db.silhouette_score?`<p style="font-size:13px;color:var(--text-secondary)">Silhouette: <b style="color:var(--green)">${db.silhouette_score}</b></p>`:''}
    <div class="table-wrap" style="margin-top:12px;"><table><thead><tr><th>Küme</th><th>Boyut</th></tr></thead><tbody>
    ${db.cluster_sizes.map(c=>`<tr><td>${c.cluster}</td><td>${c.size}</td></tr>`).join('')}
    </tbody></table></div>`;

  mkChart('clusterCompareChart','bar',{
    labels:['K-Means','Hiyerarşik (AGNES)','DBSCAN'],
    datasets:[{
      label:'Silhouette Skoru',
      data:[km.silhouette_score, ag.silhouette_score, db.silhouette_score||0],
      backgroundColor:[COLORS[0],COLORS[1],COLORS[2]]
    }]
  });
}

async function loadNetwork() {
  const d=await api('/network?threshold=0.4');
  if(!d) return;
  networkData=d;
  document.getElementById('net-nodes').textContent=d.properties.num_nodes;
  document.getElementById('net-edges').textContent=d.properties.num_edges;
  document.getElementById('net-density').textContent=d.properties.density;
  document.getElementById('net-communities').textContent=d.communities.num_communities||0;

  drawNetwork(d.graph);

  const cent=d.centrality;
  let rows=Object.entries(cent).sort((a,b)=>b[1].degree-a[1].degree).map(([n,v])=>`
    <tr><td>${n.replace(/_/g,' ')}</td><td>${v.degree}</td><td>${v.degree_centrality}</td><td>${v.closeness_centrality}</td><td>${v.betweenness_centrality}</td></tr>`).join('');
  document.getElementById('centrality-content').innerHTML=`<div class="table-wrap"><table><thead><tr><th>Özellik</th><th>Derece</th><th>Degree C.</th><th>Closeness C.</th><th>Betweenness C.</th></tr></thead><tbody>${rows}</tbody></table></div>`;

  const comms=d.communities.communities||[];
  document.getElementById('communities-content').innerHTML=comms.map((c,i)=>`
    <div style="margin-bottom:12px;padding:12px;background:var(--bg-primary);border-radius:8px;border:1px solid var(--border);">
      <div style="font-size:12px;font-weight:600;color:${COLORS[i%COLORS.length]};margin-bottom:6px;">Topluluk ${i+1} (${c.size} üye)</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px;">${c.members.map(m=>`<span class="badge badge-indigo">${m.replace(/_/g,' ')}</span>`).join('')}</div>
    </div>`).join('');

  const topDeg=d.top_nodes.by_degree.slice(0,5);
  mkChart('centralityChart','bar',{
    labels:topDeg.map(n=>n.node.replace(/_/g,' ')),
    datasets:[
      {label:'Degree',data:d.top_nodes.by_degree.slice(0,5).map(n=>n.value),backgroundColor:COLORS[0]+'aa'},
      {label:'Betweenness',data:d.top_nodes.by_betweenness.slice(0,5).map(n=>n.value),backgroundColor:COLORS[1]+'aa'},
      {label:'Closeness',data:d.top_nodes.by_closeness.slice(0,5).map(n=>n.value),backgroundColor:COLORS[2]+'aa'}
    ]
  });
}

function drawNetwork(graph) {
  const canvas=document.getElementById('networkCanvas');
  const ctx=canvas.getContext('2d');
  canvas.width=canvas.offsetWidth;
  canvas.height=canvas.offsetHeight;
  const W=canvas.width, H=canvas.height;
  ctx.clearRect(0,0,W,H);
  const nodes={};
  graph.nodes.forEach(n=>{
    nodes[n.id]={x:(n.x+1.5)/3*W*0.85+W*0.075, y:(n.y+1.5)/3*H*0.85+H*0.075, degree:n.degree, label:n.label};
  });
  graph.edges.forEach(e=>{
    const s=nodes[e.source], t=nodes[e.target];
    if(!s||!t) return;
    ctx.beginPath();
    ctx.moveTo(s.x,s.y); ctx.lineTo(t.x,t.y);
    ctx.strokeStyle=e.weight>0?'rgba(99,102,241,0.4)':'rgba(239,68,68,0.4)';
    ctx.lineWidth=Math.abs(e.weight)*2;
    ctx.stroke();
  });
  graph.nodes.forEach(n=>{
    const nd=nodes[n.id];
    const r=6+nd.degree*3;
    ctx.beginPath();
    ctx.arc(nd.x,nd.y,r,0,Math.PI*2);
    ctx.fillStyle=COLORS[nd.degree%COLORS.length];
    ctx.fill();
    ctx.fillStyle='#f1f5f9';
    ctx.font=`11px Inter`;
    ctx.textAlign='center';
    ctx.fillText(n.label.split(' ')[0],nd.x,nd.y-r-4);
  });
}


// ============ TOGGLE THEME ============
function toggleTheme() {
  const html = document.documentElement;
  const isLight = html.getAttribute('data-theme') === 'light';
  html.setAttribute('data-theme', isLight ? '' : 'light');
  document.getElementById('theme-toggle-btn').textContent = isLight ? '🌙' : '☀️';
}

// ============ ANALIZ ÖZETİ ============
async function loadSummary() {
  const d = await api('/summary');
  if(!d) return;
  document.getElementById('sum-best-acc').textContent = d.best_accuracy + '%';
  document.getElementById('sum-best-algo').textContent = d.best_algorithm;
  document.getElementById('sum-top-pct').textContent   = '%' + d.top_feature_pct;
  document.getElementById('sum-top-feat').textContent  = d.top_feature;
  document.getElementById('sum-f1').textContent  = d.best_f1 + '%';
  document.getElementById('sum-cv').textContent  = d.best_cv + '%';

  // Sıralama tablosu
  const medals = ['🥇','🥈','🥉','4.','5.'];
  let rows = d.algorithm_ranking.map((r,i) => `<tr><td>${medals[i]}</td><td><b>${r.algorithm}</b></td><td>${r.accuracy}%</td><td>${r.f1}%</td><td>${r.cv_mean}%</td></tr>`).join('');
  document.getElementById('summary-ranking').innerHTML = `<div class="table-wrap" style="margin-top:12px;"><table><thead><tr><th>#</th><th>Algoritma</th><th>Accuracy</th><th>F1</th><th>CV Mean</th></tr></thead><tbody>${rows}</tbody></table></div>`;

  // Bulgular metni
  const dist = d.class_distribution;
  document.getElementById('summary-findings').innerHTML = `
    <p>📁 Veri seti <b>${d.total_rows}</b> kayıt ve <b>${d.total_features}</b> özellikten oluşmaktadır.</p>
    <p>🎯 Hedef değişken <b>Task_Success_Rate</b> üç sınıfa ayrılmıştır: ${dist.labels.map((l,i)=>l+'('+dist.values[i]+')').join(', ')}.</p>
    <p>🏆 En yüksek sınıflandırma başarısı <b>${d.best_algorithm}</b> algoritmasıyla elde edilmiştir (Accuracy: <b>${d.best_accuracy}%</b>, F1: <b>${d.best_f1}%</b>).</p>
    <p>⭐ Performansı en çok etkileyen özellik <b>${d.top_feature}</b> olarak tespit edilmiştir (%${d.top_feature_pct} göreli önem).</p>
    <p>🔄 5-Fold Cross Validation ortalaması <b>${d.best_cv}%</b> ile modelin genellenebilirliği doğrulanmıştır.</p>`;

  // Karşılaştırma grafiği
  mkChart('summaryBarChart','bar',{
    labels: d.algorithm_ranking.map(r=>r.algorithm),
    datasets:[
      {label:'Accuracy (%)', data:d.algorithm_ranking.map(r=>r.accuracy), backgroundColor:'rgba(99,102,241,0.7)'},
      {label:'F1 Skoru (%)', data:d.algorithm_ranking.map(r=>r.f1),       backgroundColor:'rgba(16,185,129,0.6)'},
      {label:'CV Mean (%)', data:d.algorithm_ranking.map(r=>r.cv_mean),   backgroundColor:'rgba(245,158,11,0.6)'}
    ]
  });
}

// ============ VERİ TABLOSU ============
async function loadTablo(page=1) {
  const col = document.getElementById('filter-col').value;
  const min = document.getElementById('filter-min').value;
  const max = document.getElementById('filter-max').value;
  let url = `/data?page=${page}&per_page=25`;
  if(col) url += `&col=${col}`;
  if(min) url += `&min=${min}`;
  if(max) url += `&max=${max}`;
  const d = await api(url);
  if(!d) return;
  document.getElementById('tablo-total').textContent = `${d.total} kayıt bulundu`;
  const head = '<tr>' + d.columns.map(c=>`<th>${c.replace(/_/g,' ')}</th>`).join('') + '</tr>';
  const rows = d.rows.map(r=>'<tr>'+r.map((v,i)=>{
    const sRate = d.columns[i]==='Task_Success_Rate';
    const color = sRate ? (v<=50?'color:#ef4444':v<=75?'color:#f59e0b':'color:#10b981') : '';
    return `<td style="${color}">${v}</td>`;
  }).join('')+'</tr>').join('');
  document.getElementById('tablo-content').innerHTML = `<div class="table-wrap"><table><thead>${head}</thead><tbody>${rows}</tbody></table></div>`;

  // Sayfalama
  const pages = d.pages;
  let pag = '';
  for(let i=1; i<=pages; i++) {
    const active = i===page ? 'style="background:var(--accent);color:white;border-color:var(--accent)"' : '';
    pag += `<button class="btn" ${active} onclick="loadTablo(${i})" style="padding:6px 12px;min-width:36px;">${i}</button>`;
  }
  document.getElementById('tablo-pagination').innerHTML = pag;
}

function updateFilterRange() {
  // Min/max placeholder güncelle
  const col = document.getElementById('filter-col').value;
  if(!featureRanges || !col || !featureRanges[col]) return;
  document.getElementById('filter-min').placeholder = featureRanges[col].min;
  document.getElementById('filter-max').placeholder = featureRanges[col].max;
}

// ============ KÜME PROFİLLERİ ============
async function loadClusterProfiles() {
  const d = await api('/cluster_profiles');
  if(!d) return;
  const CLUSTER_COLORS = ['rgba(99,102,241,0.5)','rgba(16,185,129,0.5)','rgba(245,158,11,0.5)'];
  const CLUSTER_BORDERS = ['#6366f1','#10b981','#f59e0b'];
  const labels = d.features.map(f=>f.replace(/_/g,' '));
  const datasets = d.profiles.map((p,i)=>({
    label: `Küme ${p.cluster} (n=${p.size})`,
    data: p.normalized,
    backgroundColor: CLUSTER_COLORS[i],
    borderColor: CLUSTER_BORDERS[i],
    borderWidth: 2,
    pointBackgroundColor: CLUSTER_BORDERS[i]
  }));
  // Radar chart için container ekle
  let container = document.getElementById('cluster-radar-card');
  if(!container) {
    const clusterPage = document.getElementById('page-clustering');
    const div = document.createElement('div');
    div.id = 'cluster-radar-card';
    div.className = 'card';
    div.style.marginTop = '20px';
    div.innerHTML = `<div class="card-title">🕸️ Küme Profil Radar Grafiği</div><div class="card-subtitle">Her kümenin özellik ortalamaları (normalize edilmiş) — kümeler nasıl ayrışıyor?</div><div class="chart-wrap"><canvas id="radarChart" height="350"></canvas></div>`;
    clusterPage.appendChild(div);
  }
  mkChart('radarChart','radar',{labels, datasets},{scales:{r:{ticks:{color:'#64748b',backdropColor:'transparent'},grid:{color:'#2a3654'},pointLabels:{color:'#94a3b8',font:{size:11}}}}});
}

// ============ DEBOUNCE gerçek zamanlı tahmin ============
let debounceTimer = null;
function onSliderChange() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(runPrediction, 600);
}

// ============ PNG EXPORT ============
function exportPage() {
  // Aktif sayfadaki ilk canvas’ı PNG olarak indir
  const activePage = document.querySelector('.page.active');
  const canvas = activePage ? activePage.querySelector('canvas') : null;
  if(!canvas){ alert('Bu sayfada indirilecek grafik bulunamadı.'); return; }
  const link = document.createElement('a');
  link.download = 'grafik.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

let featureRanges = null;
let predictLoaded = false;

const FEATURE_LABELS = {
  Hours_Coding:       'Kodlama Saati (saat/gün)',
  Lines_of_Code:      'Yazılan Kod Satırı',
  Bugs_Found:         'Bulunan Hata Sayısı',
  Bugs_Fixed:         'Düzeltilen Hata Sayısı',
  AI_Usage_Hours:     'AI Kullanım Süresi (saat)',
  Sleep_Hours:        'Uyku Süresi (saat)',
  Cognitive_Load:     'Bilişsel Yük (0-100)',
  Coffee_Intake:      'Kahve Tüketimi (fincan)',
  Stress_Level:       'Stres Seviyesi (0-100)',
  Task_Duration_Hours:'Görev Süresi (saat)',
  Commits:            'Git Commit Sayısı',
  Errors:             'Hata (Error) Sayısı'
};

async function loadPredictPage() {
  if(predictLoaded) return;
  featureRanges = await api('/feature_ranges');
  if(!featureRanges) return;
  const cols = Object.keys(featureRanges);
  let html = '';
  cols.forEach(col => {
    const r = featureRanges[col];
    const step = r.step;
    const label = FEATURE_LABELS[col] || col.replace(/_/g,' ');
    html += `
    <div style="background:var(--bg-primary);padding:12px;border-radius:8px;border:1px solid var(--border);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <label style="font-size:12px;font-weight:600;color:var(--text-secondary);">${label}</label>
        <span id="val-${col}" style="font-size:13px;font-weight:700;color:var(--accent-light);font-family:monospace;min-width:40px;text-align:right;">${r.mean}</span>
      </div>
      <input type="range" id="inp-${col}"
        min="${r.min}" max="${r.max}" step="${step}" value="${r.mean}"
      oninput="document.getElementById('val-${col}').textContent=parseFloat(this.value).toFixed(step<1?1:0); onSliderChange();"
        style="width:100%;accent-color:var(--accent);">
      <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-muted);margin-top:2px;">
        <span>${r.min}</span><span style="color:var(--text-muted)">ort: ${r.mean}</span><span>${r.max}</span>
      </div>
    </div>`;
  });
  document.getElementById('predict-form-inputs').innerHTML = html;
  predictLoaded = true;
}

function resetToMean() {
  if(!featureRanges) return;
  Object.keys(featureRanges).forEach(col => {
    const inp = document.getElementById('inp-'+col);
    const val = document.getElementById('val-'+col);
    if(inp && val) {
      inp.value = featureRanges[col].mean;
      const step = featureRanges[col].step;
      val.textContent = parseFloat(featureRanges[col].mean).toFixed(step<1?1:0);
    }
  });
}

async function runPrediction() {
  if(!featureRanges) return;
  const btn = document.getElementById('predict-btn');
  btn.textContent = '⏳ Hesaplanıyor...';
  btn.disabled = true;

  const body = {};
  Object.keys(featureRanges).forEach(col => {
    const inp = document.getElementById('inp-'+col);
    if(inp) body[col] = parseFloat(inp.value);
  });

  document.getElementById('predict-result-area').innerHTML = `<div class="loader"><div class="spinner"></div><span>10 algoritma çalışıyor...</span></div>`;

  const result = await fetch(API+'/predict', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(body)
  }).then(r=>r.json()).catch(()=>null);

  btn.textContent = '🔮 Tahmin Et';
  btn.disabled = false;

  if(!result){ document.getElementById('predict-result-area').innerHTML='<div class="loader">Hata oluştu</div>'; return; }

  const cls = result.final_class;
  const icons = {0:'🔴', 1:'🟡', 2:'🟢'};
  const icon = icons[cls] || '⚪';
  const labelMap = {Dusuk:'Düşük', Orta:'Orta', Yuksek:'Yüksek'};
  const finalLabel = labelMap[result.final_label] || result.final_label;
  const descMap = {
    'Gorev basari orani dusuk (30-50)': 'Görev başarı oranı düşük (30-50)',
    'Orta duzey basari (51-75)': 'Orta düzey başarı (51-75)',
    'Yuksek performans (76-100)': 'Yüksek performans (76-100)'
  };
  const finalDesc = descMap[result.final_desc] || result.final_desc;

  // Algoritma sonuç kartları
  const algoIcons = {decision_tree:'🌳', naive_bayes:'📊', knn:'📍', svm:'📐', ann:'🧠'};
  const labelsTR = {Dusuk:'Düşük', Orta:'Orta', Yuksek:'Yüksek'};
  let algoCards = result.predictions.map(p => {
    const probHtml = p.probabilities ? Object.entries(p.probabilities).map(([lbl,pct])=>`
      <div style="margin-top:4px;">
        <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-muted);"><span>${labelsTR[lbl]||lbl}</span><span>${pct}%</span></div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${pct>50?'var(--green)':pct>25?'var(--orange)':'var(--red)'}"></div></div>
      </div>`).join('') : '';
    return `
    <div class="fade-in" style="background:var(--bg-primary);border:1px solid ${p.color}44;border-radius:8px;padding:14px;border-left:3px solid ${p.color};">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <span style="font-size:20px;">${algoIcons[p.key]||'🤖'}</span>
        <div>
          <div style="font-size:13px;font-weight:600;">${p.algorithm}</div>
          <div style="font-size:11px;color:${p.color};font-weight:700;">${labelsTR[p.label]||p.label} sınıfı</div>
        </div>
      </div>
      ${probHtml}
    </div>`;
  }).join('');

  // Oy dağılımı
  const voteEntries = Object.entries(result.votes);
  const voteHtml = voteEntries.map(([lbl, cnt]) => {
    const pct = Math.round(cnt / result.predictions.length * 100);
    const color = lbl==='Yuksek'?'var(--green)':lbl==='Orta'?'var(--orange)':'var(--red)';
    return `<div style="margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px;"><span>${labelsTR[lbl]||lbl}</span><span style="color:${color}">${cnt} oy (${pct}%)</span></div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${color}"></div></div>
    </div>`;
  }).join('');

  document.getElementById('predict-result-area').innerHTML = `
    <div class="fade-in" style="background:var(--bg-card);border:2px solid ${result.final_color};border-radius:var(--radius);padding:24px;text-align:center;margin-bottom:16px;">
      <div style="font-size:56px;margin-bottom:8px;">${icon}</div>
      <div style="font-size:28px;font-weight:800;color:${result.final_color};margin-bottom:4px;">${finalLabel} Performans</div>
      <div style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">${finalDesc}</div>
      <div style="background:var(--bg-primary);border-radius:8px;padding:10px;display:inline-block;">
        <span style="font-size:13px;color:var(--text-secondary);">10 algoritmanın </span>
        <span style="font-size:20px;font-weight:800;color:${result.final_color};">${result.confidence}%</span>
        <span style="font-size:13px;color:var(--text-secondary);"> oyu ile belirlendi</span>
      </div>
    </div>
    <div class="card" style="margin-bottom:16px;">
      <div class="card-title">🗳️ Oylama Sonuçları</div>
      <div class="card-subtitle">Majority Voting — 10 algoritmanın kararı</div>
      <div style="margin-top:12px;">${voteHtml}</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">${algoCards}</div>`;
}

initDashboard();

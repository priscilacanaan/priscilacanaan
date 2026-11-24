/* ---------- dados (guardados no navegador) ---------- */
const KEY = 'consultorio-v1';
let db = JSON.parse(localStorage.getItem(KEY) || 'null') || { pessoas: [], sessoes: [] };
const save = () => localStorage.setItem(KEY, JSON.stringify(db));
const uid = () => Math.random().toString(36).slice(2, 10);
const $ = s => document.querySelector(s);
const pad = n => String(n).padStart(2, '0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromIso = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const pessoaById = id => db.pessoas.find(p => p.id === id);
const toast = msg => { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2200); };
const fmtDia = d => d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });

/* ---------- navegação ---------- */
let view = 'agenda', current = new Date(), selectedPessoa = null;
document.querySelectorAll('.nav-btn').forEach(b => b.addEventListener('click', () => showView(b.dataset.v)));
function showView(v) {
  view = v;
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('is-on', b.dataset.v === v));
  document.querySelectorAll('.view').forEach(s => s.classList.toggle('is-on', s.id === 'v-' + v));
  render();
}

/* ---------- agenda ---------- */
function renderAgenda() {
  const sel = iso(current);
  const hoje = iso(new Date());
  $('#dia-titulo').textContent = sel === hoje ? 'Hoje · ' + fmtDia(current) : fmtDia(current);

  // week strip (7 days around the selected day, Monday-based)
  const start = new Date(current); start.setDate(current.getDate() - ((current.getDay() + 6) % 7));
  const week = $('#week'); week.innerHTML = '';
  for (let i = 0; i < 7; i++) {
    const d = new Date(start); d.setDate(start.getDate() + i);
    const s = iso(d);
    const has = db.sessoes.some(x => x.data === s);
    const el = document.createElement('div');
    el.className = 'day' + (s === sel ? ' is-on' : '') + (has ? ' has' : '');
    el.innerHTML = `<small>${d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</small><b>${d.getDate()}</b><em></em>`;
    el.addEventListener('click', () => { current = d; render(); });
    week.appendChild(el);
  }

  // slots 08:00 – 20:00 every 30 min
  const doDia = db.sessoes.filter(s => s.data === sel).sort((a, b) => a.hora.localeCompare(b.hora));
  const box = $('#slots'); box.innerHTML = '';
  for (let h = 8; h <= 20; h++) for (const m of [0, 30]) {
    if (h === 20 && m === 30) continue;
    const hora = `${pad(h)}:${pad(m)}`;
    const row = document.createElement('div'); row.className = 'slot';
    const evs = doDia.filter(s => s.hora === hora);
    row.innerHTML = `<div class="hora">${hora}</div><div class="corpo"></div>`;
    const corpo = row.querySelector('.corpo');
    evs.forEach(s => {
      const p = pessoaById(s.pessoaId);
      const ev = document.createElement('div');
      ev.className = 'ev s-' + s.status;
      ev.innerHTML = `<div><b>${p ? p.nome : 'Pessoa removida'}</b><br><small>${s.duracao} min · ${p ? p.tipo : ''}</small></div><span class="badge s-${s.status}">${s.status}</span>`;
      ev.addEventListener('click', () => openAgenda(s));
      corpo.appendChild(ev);
    });
    const add = document.createElement('button'); add.className = 'add-slot'; add.textContent = '+ sessão neste horário';
    add.addEventListener('click', () => openAgenda(null, sel, hora));
    corpo.appendChild(add);
    box.appendChild(row);
  }

  // stats
  $('#s-dia').textContent = doDia.length;
  const fim = new Date(start); fim.setDate(start.getDate() + 6);
  $('#s-prox').textContent = db.sessoes.filter(s => s.data >= hoje && s.data <= iso(fim) && s.status === 'Agendada').length;
  $('#s-pess').textContent = db.pessoas.length;
}

/* ---------- pessoas ---------- */
function renderPessoas() {
  const q = ($('#busca').value || '').toLowerCase();
  const lista = $('#lista'); lista.innerHTML = '';
  const itens = db.pessoas.filter(p => p.nome.toLowerCase().includes(q)).sort((a, b) => a.nome.localeCompare(b.nome));
  if (!itens.length) lista.innerHTML = '<p class="vazio" style="padding:1.2rem">Nenhuma pessoa encontrada.</p>';
  itens.forEach(p => {
    const el = document.createElement('div');
    el.className = 'pessoa' + (selectedPessoa === p.id ? ' is-on' : '');
    const ini = p.nome.split(' ').filter(x => /^\p{L}/u.test(x) && x.toLowerCase() !== 'exemplo').slice(0, 2).map(x => x[0]).join('').toUpperCase();
    el.innerHTML = `<div class="av">${ini}</div><div><b>${p.nome}</b><small>${p.tipo}</small></div>`;
    el.addEventListener('click', () => { selectedPessoa = p.id; renderPessoas(); });
    lista.appendChild(el);
  });
  renderFicha();
}
function renderFicha() {
  const f = $('#ficha');
  const p = pessoaById(selectedPessoa);
  if (!p) { f.innerHTML = '<p class="vazio">Escolha uma pessoa para ver o histórico.</p>'; return; }
  const hist = db.sessoes.filter(s => s.pessoaId === p.id).sort((a, b) => (b.data + b.hora).localeCompare(a.data + a.hora));
  const hoje = iso(new Date());
  const prox = hist.find(s => s.data >= hoje && s.status === 'Agendada');
  f.innerHTML = `
    <div class="ficha-top">
      <div><p class="kicker">${p.tipo}</p><h2>${p.nome}</h2>${prox ? `<p class="prox">Próxima: ${fromIso(prox.data).toLocaleDateString('pt-BR')} às ${prox.hora}</p>` : ''}</div>
      <div style="display:flex;gap:.5rem">
        <button class="ghost" id="ed-p">Editar</button>
        <button class="btn" id="ag-p">+ Sessão</button>
        <button class="ghost" id="del-p" style="color:var(--bad)">Excluir</button>
      </div>
    </div>
    <dl>
      <dt>Telefone</dt><dd>${p.telefone || '—'}</dd>
      <dt>E-mail</dt><dd>${p.email || '—'}</dd>
      <dt>Nascimento</dt><dd>${p.nascimento ? fromIso(p.nascimento).toLocaleDateString('pt-BR') : '—'}</dd>
      <dt>Observações</dt><dd>${p.obs || '—'}</dd>
    </dl>
    <div class="hist"><h3>Histórico de sessões (${hist.length})</h3>
      ${hist.map(s => `<div class="ev s-${s.status}"><div><b>${fromIso(s.data).toLocaleDateString('pt-BR')} · ${s.hora}</b><br><small>${s.duracao} min${s.notas ? ' · ' + s.notas : ''}</small></div><span class="badge s-${s.status}">${s.status}</span></div>`).join('') || '<p class="vazio">Nenhuma sessão ainda.</p>'}
    </div>`;
  $('#ed-p').onclick = () => openPessoa(p);
  $('#ag-p').onclick = () => openAgenda(null, hoje, '09:00', p.id);
  $('#del-p').onclick = () => {
    if (!confirm(`Excluir ${p.nome} e todas as sessões dela?`)) return;
    db.pessoas = db.pessoas.filter(x => x.id !== p.id);
    db.sessoes = db.sessoes.filter(x => x.pessoaId !== p.id);
    selectedPessoa = null; save(); render(); toast('Pessoa excluída');
  };
}

/* ---------- modais ---------- */
const dlgP = $('#dlg-pessoa'), formP = $('#form-pessoa');
function openPessoa(p) {
  formP.reset(); $('#titulo-pessoa').textContent = p ? 'Editar pessoa' : 'Nova pessoa';
  formP.dataset.id = p ? p.id : '';
  if (p) for (const k of ['nome', 'telefone', 'email', 'nascimento', 'tipo', 'obs']) if (formP[k]) formP[k].value = p[k] || '';
  dlgP.showModal();
}
formP.addEventListener('submit', e => {
  if (e.submitter && e.submitter.value === 'cancel') return;
  const v = Object.fromEntries(new FormData(formP));
  if (!v.nome.trim()) return;
  if (formP.dataset.id) Object.assign(pessoaById(formP.dataset.id), v);
  else { const id = uid(); db.pessoas.push({ id, ...v }); selectedPessoa = id; }
  save(); dlgP.close(); render(); toast('Pessoa salva');
});

const dlgA = $('#dlg-ag'), formA = $('#form-ag');
function openAgenda(s, data, hora, pessoaId) {
  formA.reset();
  const sel = formA.pessoa; sel.innerHTML = db.pessoas.map(p => `<option value="${p.id}">${p.nome}</option>`).join('');
  if (!db.pessoas.length) { toast('Cadastre uma pessoa antes de agendar'); showView('pessoas'); openPessoa(); return; }
  $('#titulo-ag').textContent = s ? 'Editar sessão' : 'Nova sessão';
  formA.dataset.id = s ? s.id : '';
  if (s) { sel.value = s.pessoaId; formA.data.value = s.data; formA.hora.value = s.hora; formA.duracao.value = s.duracao; formA.status.value = s.status; formA.notas.value = s.notas || ''; }
  else { formA.data.value = data || iso(current); formA.hora.value = hora || '09:00'; if (pessoaId) sel.value = pessoaId; }
  dlgA.showModal();
}
formA.addEventListener('submit', e => {
  if (e.submitter && e.submitter.value === 'cancel') return;
  const v = Object.fromEntries(new FormData(formA));
  const conflito = db.sessoes.find(x => x.id !== formA.dataset.id && x.data === v.data && x.hora === v.hora && x.status !== 'Cancelada');
  if (conflito) { toast('Já existe uma sessão nesse horário'); e.preventDefault(); return; }
  const dados = { pessoaId: v.pessoa, data: v.data, hora: v.hora, duracao: v.duracao, status: v.status, notas: v.notas };
  if (formA.dataset.id) Object.assign(db.sessoes.find(x => x.id === formA.dataset.id), dados);
  else db.sessoes.push({ id: uid(), ...dados });
  current = fromIso(v.data);
  save(); dlgA.close(); render(); toast('Sessão salva');
});

/* ---------- barra lateral e cabeçalhos ---------- */
$('#prev').onclick = () => { current.setDate(current.getDate() - 1); render(); };
$('#next').onclick = () => { current.setDate(current.getDate() + 1); render(); };
$('#hoje').onclick = () => { current = new Date(); render(); };
$('#novo-ag').onclick = () => openAgenda(null);
$('#nova-pessoa').onclick = () => openPessoa();
$('#busca').addEventListener('input', renderPessoas);

$('#seed').onclick = () => {
  if (db.pessoas.length && !confirm('Adicionar exemplos aos dados atuais?')) return;
  const a = uid(), b = uid(), c = uid();
  db.pessoas.push(
    { id: a, nome: 'Exemplo — Ana Souza', telefone: '(91) 00000-0001', email: 'ana@exemplo.com', nascimento: '1990-05-12', tipo: 'Individual', obs: 'Registro de exemplo.' },
    { id: b, nome: 'Exemplo — Carlos e Lia', telefone: '(91) 00000-0002', email: 'casal@exemplo.com', nascimento: '', tipo: 'Casal', obs: 'Registro de exemplo.' },
    { id: c, nome: 'Exemplo — Marina Lopes', telefone: '(91) 00000-0003', email: '', nascimento: '2001-11-03', tipo: 'Avaliação neuropsicológica', obs: 'Registro de exemplo.' });
  const hoje = new Date();
  const d = (n) => { const x = new Date(hoje); x.setDate(hoje.getDate() + n); return iso(x); };
  db.sessoes.push(
    { id: uid(), pessoaId: a, data: d(0), hora: '09:00', duracao: '50', status: 'Agendada', notas: '' },
    { id: uid(), pessoaId: b, data: d(0), hora: '14:00', duracao: '60', status: 'Agendada', notas: '' },
    { id: uid(), pessoaId: c, data: d(-1), hora: '10:30', duracao: '60', status: 'Realizada', notas: 'Entrevista inicial (anamnese).' },
    { id: uid(), pessoaId: a, data: d(-7), hora: '09:00', duracao: '50', status: 'Realizada', notas: 'Sessão de acompanhamento.' },
    { id: uid(), pessoaId: a, data: d(2), hora: '09:00', duracao: '50', status: 'Agendada', notas: '' });
  save(); render(); toast('Exemplos carregados');
};
$('#clear').onclick = () => {
  if (!confirm('Apagar todas as pessoas e sessões deste navegador?')) return;
  db = { pessoas: [], sessoes: [] }; selectedPessoa = null; save(); render(); toast('Dados apagados');
};

function render() { if (view === 'agenda') renderAgenda(); else renderPessoas(); }
render();

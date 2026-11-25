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
let view = 'pessoas', selectedPessoa = null;
document.querySelectorAll('.nav-btn').forEach(b => b.addEventListener('click', () => showView(b.dataset.v)));
function showView(v) {
  view = v;
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('is-on', b.dataset.v === v));
  document.querySelectorAll('.view').forEach(s => s.classList.toggle('is-on', s.id === 'v-' + v));
  render();
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

/* ---------- barra lateral e cabeçalhos ---------- */
$('#nova-pessoa').onclick = () => openPessoa();
$('#busca').addEventListener('input', renderPessoas);

$('#seed').onclick = () => {
  if (db.pessoas.length && !confirm('Adicionar exemplos aos dados atuais?')) return;
  const a = uid(), b = uid(), c = uid();
  db.pessoas.push(
    { id: a, nome: 'Exemplo — Ana Souza', telefone: '(91) 00000-0001', email: 'ana@exemplo.com', nascimento: '1990-05-12', tipo: 'Individual', obs: 'Registro de exemplo.' },
    { id: b, nome: 'Exemplo — Carlos e Lia', telefone: '(91) 00000-0002', email: 'casal@exemplo.com', nascimento: '', tipo: 'Casal', obs: 'Registro de exemplo.' },
    { id: c, nome: 'Exemplo — Marina Lopes', telefone: '(91) 00000-0003', email: '', nascimento: '2001-11-03', tipo: 'Avaliação neuropsicológica', obs: 'Registro de exemplo.' });
  save(); render(); toast('Exemplos carregados');
};
$('#clear').onclick = () => {
  if (!confirm('Apagar todas as pessoas e sessões deste navegador?')) return;
  db = { pessoas: [], sessoes: [] }; selectedPessoa = null; save(); render(); toast('Dados apagados');
};

function render() { renderPessoas(); }
render();

import Head from 'next/head';
import { useEffect, useState, useCallback } from 'react';

const STATUS_LABEL = { pending: 'Ожидает', processing: 'В обработке', done: 'Выдано' };
const SOURCE_LABEL = {
  case: 'Бесплатный кейс',
  market: 'Маркет',
  wheel: 'Колесо удачи',
  'premium-bogach': 'Богач',
  'premium-durov': 'Павел Дуров',
};
const PROMO_TYPE_LABEL = {
  stars: 'Звёзды',
  freeCase: 'Бесплатный кейс',
  freeWheel: 'Вращение колеса',
  freeBogach: 'Богач (бесплатно)',
  freeDurov: 'Павел Дуров (бесплатно)',
};
const PASS_KEY = 'tonnel_admin_pass';

function fmtDate(ts) {
  return new Date(ts).toLocaleString('ru-RU');
}

export default function Admin() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState('');
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [grantAmount, setGrantAmount] = useState(100);
  const [granting, setGranting] = useState(false);
  const [grantResult, setGrantResult] = useState('');

  const [promos, setPromos] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [promoType, setPromoType] = useState('stars');
  const [promoAmount, setPromoAmount] = useState(100);
  const [promoMaxUses, setPromoMaxUses] = useState('');
  const [creatingPromo, setCreatingPromo] = useState(false);
  const [promoCreateMsg, setPromoCreateMsg] = useState('');

  useEffect(() => {
    const saved = window.localStorage.getItem(PASS_KEY);
    if (saved) {
      setPassword(saved);
      setAuthed(true);
    }
  }, []);

  const load = useCallback((pass) => {
    setLoading(true);
    fetch('/api/admin/requests', { headers: { 'x-admin-password': pass } })
      .then(async (r) => {
        if (!r.ok) throw new Error('unauthorized');
        return r.json();
      })
      .then((data) => {
        setRequests(data.requests || []);
        setAuthed(true);
        setError('');
        window.localStorage.setItem(PASS_KEY, pass);
      })
      .catch(() => {
        setError('Неверный пароль');
        setAuthed(false);
        window.localStorage.removeItem(PASS_KEY);
      })
      .finally(() => setLoading(false));
  }, []);

  const loadPromos = useCallback((pass) => {
    fetch('/api/admin/promo/list', { headers: { 'x-admin-password': pass } })
      .then((r) => r.json())
      .then((data) => setPromos(data.promos || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (authed && password) {
      load(password);
      loadPromos(password);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  async function handleGrant() {
    setGranting(true);
    setGrantResult('');
    try {
      const res = await fetch('/api/admin/grant-stars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ amount: Number(grantAmount) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGrantResult(data.error === 'amount_out_of_range' ? 'Сумма должна быть 100–500' : 'Ошибка');
        return;
      }
      setGrantResult(`Начислено ${data.amount}⭐ для ${data.count} пользователей`);
    } catch {
      setGrantResult('Ошибка сети');
    } finally {
      setGranting(false);
    }
  }

  async function handleCreatePromo() {
    setCreatingPromo(true);
    setPromoCreateMsg('');
    try {
      const res = await fetch('/api/admin/promo/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({
          code: promoCode,
          type: promoType,
          amount: promoType === 'stars' ? Number(promoAmount) : undefined,
          maxUses: promoMaxUses ? Number(promoMaxUses) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPromoCreateMsg(data.error === 'code_exists' ? 'Такой код уже существует' : 'Не удалось создать промокод');
        return;
      }
      setPromoCreateMsg(`Промокод ${data.promo.code} создан`);
      setPromoCode('');
      loadPromos(password);
    } catch {
      setPromoCreateMsg('Ошибка сети');
    } finally {
      setCreatingPromo(false);
    }
  }

  async function updateStatus(id, status) {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    await fetch('/api/admin/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id, status }),
    });
  }

  if (!authed) {
    return (
      <div className="admin-shell">
        <Head>
          <title>Tonnel — Админ</title>
        </Head>
        <form
          className="admin-login"
          onSubmit={(e) => {
            e.preventDefault();
            load(password);
          }}
        >
          <h2 style={{ fontFamily: 'var(--font-display)' }}>Вход в админ-панель</h2>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn-gold" type="submit">
            Войти
          </button>
          {error && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>}
        </form>
      </div>
    );
  }

  const filtered = filter === 'all' ? requests : requests.filter((r) => r.status === filter);

  return (
    <div className="admin-shell">
      <Head>
        <title>Tonnel — Админ</title>
      </Head>
      <div className="inner">
        <div className="admin-header">
          <h1>Заявки ({requests.length})</h1>
          <button className="admin-filter-btn" onClick={() => load(password)} type="button">
            Обновить
          </button>
        </div>

        <div className="admin-row" style={{ flexWrap: 'wrap', gap: 10 }}>
          <div className="col">
            <span className="name">Начислить звёзды всем пользователям</span>
            <span className="meta">Диапазон 100–500 ⭐ за раз, применяется ко всем зарегистрированным ID</span>
          </div>
          <div className="spacer" />
          <input
            type="number"
            min={100}
            max={500}
            step={10}
            value={grantAmount}
            onChange={(e) => setGrantAmount(e.target.value)}
            className="admin-select"
            style={{ width: 90 }}
          />
          <button className="admin-filter-btn active" onClick={handleGrant} disabled={granting} type="button">
            {granting ? 'Начисляем…' : 'Начислить'}
          </button>
          {grantResult && <span className="meta" style={{ width: '100%' }}>{grantResult}</span>}
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, margin: '24px 0 10px' }}>
          Промокоды
        </h2>

        <div className="admin-row" style={{ flexWrap: 'wrap', gap: 10 }}>
          <input
            placeholder="КОД"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            className="admin-select"
            style={{ width: 140, textTransform: 'uppercase' }}
          />
          <select
            className="admin-select"
            value={promoType}
            onChange={(e) => setPromoType(e.target.value)}
          >
            {Object.entries(PROMO_TYPE_LABEL).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
          {promoType === 'stars' && (
            <input
              type="number"
              min={1}
              value={promoAmount}
              onChange={(e) => setPromoAmount(e.target.value)}
              className="admin-select"
              style={{ width: 90 }}
              placeholder="Кол-во ⭐"
            />
          )}
          <input
            type="number"
            min={1}
            value={promoMaxUses}
            onChange={(e) => setPromoMaxUses(e.target.value)}
            className="admin-select"
            style={{ width: 110 }}
            placeholder="Лимит (необяз.)"
          />
          <button className="admin-filter-btn active" onClick={handleCreatePromo} disabled={creatingPromo} type="button">
            {creatingPromo ? 'Создаём…' : 'Создать'}
          </button>
          {promoCreateMsg && <span className="meta" style={{ width: '100%' }}>{promoCreateMsg}</span>}
        </div>

        {promos.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            {promos.map((p) => (
              <div className="admin-row" key={p.code}>
                <div className="col">
                  <span className="name" style={{ fontFamily: 'var(--font-mono)' }}>{p.code}</span>
                  <span className="meta">
                    {PROMO_TYPE_LABEL[p.type] || p.type}
                    {p.type === 'stars' ? ` · ${p.amount}⭐` : ''} · использован {p.usedCount}
                    {p.maxUses ? ` / ${p.maxUses}` : ' раз (без лимита)'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, margin: '24px 0 10px' }}>
          Заявки на выдачу
        </h2>

        <div className="admin-filters">
          {['all', 'pending', 'processing', 'done'].map((f) => (
            <button
              key={f}
              className={`admin-filter-btn${filter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
              type="button"
            >
              {f === 'all' ? 'Все' : STATUS_LABEL[f]}
            </button>
          ))}
        </div>

        {loading && <p>Загрузка…</p>}

        {!loading && filtered.length === 0 && <p style={{ color: 'var(--text-dim)' }}>Пусто.</p>}

        {filtered.map((r) => (
          <div className="admin-row" key={r.id}>
            <div className="col">
              <span className="name">{r.itemName}</span>
              <span className="meta">
                {SOURCE_LABEL[r.source] || r.source} · @{r.machagramUsername}
              </span>
              <span className="meta">{fmtDate(r.createdAt)}</span>
            </div>
            <div className="spacer" />
            <select
              className="admin-select"
              value={r.status}
              onChange={(e) => updateStatus(r.id, e.target.value)}
            >
              <option value="pending">Ожидает</option>
              <option value="processing">В обработке</option>
              <option value="done">Выдано</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

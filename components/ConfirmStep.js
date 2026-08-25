import { useEffect, useState } from 'react';
import { Icon } from './Icons';

const WINDOW_MS = 30 * 60 * 1000;

function formatMMSS(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = String(Math.floor(total / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export default function ConfirmStep({ request }) {
  const deadline = request.createdAt + WINDOW_MS;
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = deadline - now;

  return (
    <div className="confirm-wrap">
      <div className="confirm-check">
        <Icon name="check" />
      </div>
      <p className="confirm-title">Заявка на {request.itemName} создана</p>
      <p className="confirm-text">
        Сделайте скриншот этого экрана и отправьте его в MachaGram{' '}
        <b>@lowday</b>. После отправки скриншота дождитесь ответа — повторно
        писать не нужно, это не ускорит обработку.
      </p>

      <div className="timer-box">
        <span className="timer-value">{formatMMSS(remaining)}</span>
        <span className="timer-label">
          {remaining > 0 ? 'ориентировочное время выдачи' : 'обрабатывается вручную'}
        </span>
      </div>

      <div className="contact-row">
        <Icon name="user" width={15} height={15} />
        @lowday
      </div>
      <p className="field-hint" style={{ textAlign: 'center' }}>
        Юзернейм для выдачи: @{request.machagramUsername}
      </p>
    </div>
  );
}

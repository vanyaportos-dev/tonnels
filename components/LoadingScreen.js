import { useState } from 'react';
import { Icon } from './Icons';

export default function LoadingScreen() {
  const [broken, setBroken] = useState(false);

  return (
    <div className="boot-screen">
      <div className="boot-glow" />
      <div className="boot-logo">
        {!broken ? (
          <img src="/image/loading.png" alt="" onError={() => setBroken(true)} />
        ) : (
          <Icon name="seal" width={40} height={40} />
        )}
      </div>
      <p className="boot-word">Tonnel</p>
      <div className="boot-dots">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

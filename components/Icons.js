// Единый набор line-иконок, нарисованных вручную как inline SVG.
// Никаких эмодзи и внешних картинок — только векторные пути, отрисованные
// напрямую в разметке (это исключает "битые" иконки из-за недоступного CDN
// и полностью совпадает по духу с требованием "только иконки, без смайликов").

const common = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function Svg({ children, viewBox = '0 0 24 24', ...rest }) {
  return (
    <svg viewBox={viewBox} xmlns="http://www.w3.org/2000/svg" {...rest}>
      {children}
    </svg>
  );
}

export function Icon({ name, ...props }) {
  switch (name) {
    case 'search':
      return (
        <Svg {...props}>
          <circle cx="11" cy="11" r="6.5" {...common} />
          <path d="M20 20l-4.3-4.3" {...common} />
        </Svg>
      );
    case 'filter':
      return (
        <Svg {...props}>
          <path d="M4 6h16M7 12h10M10 18h4" {...common} />
        </Svg>
      );
    case 'sort':
      return (
        <Svg {...props}>
          <path d="M7 4v16M7 20l-3-3M7 20l3-3M17 20V4M17 4l-3 3M17 4l3 3" {...common} />
        </Svg>
      );
    case 'chevronDown':
      return (
        <Svg {...props}>
          <path d="M6 9l6 6 6-6" {...common} />
        </Svg>
      );
    case 'chevronRight':
      return (
        <Svg {...props}>
          <path d="M9 6l6 6-6 6" {...common} />
        </Svg>
      );
    case 'star':
      return (
        <Svg {...props}>
          <path
            d="M12 3.5l2.47 5.13 5.53.72-4.1 3.88 1.08 5.6L12 15.9l-4.98 2.93 1.08-5.6-4.1-3.88 5.53-.72L12 3.5z"
            {...common}
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'sparkle':
      return (
        <Svg {...props}>
          <path
            d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"
            {...common}
          />
        </Svg>
      );
    case 'gamepad':
      return (
        <Svg {...props}>
          <path
            d="M7 9h10a4 4 0 014 4v1a3 3 0 01-3 3c-1 0-1.6-.5-2.2-1.2L14.5 15h-5l-1.3.8C7.6 16.5 7 17 6 17a3 3 0 01-3-3v-1a4 4 0 014-4z"
            {...common}
          />
          <path d="M8.5 11v3M7 12.5h3M16 11.5h.01M18 13h.01" {...common} />
        </Svg>
      );
    case 'shoppingBag':
      return (
        <Svg {...props}>
          <path d="M6 8h12l-1 12H7L6 8z" {...common} />
          <path d="M9 8V6a3 3 0 016 0v2" {...common} />
        </Svg>
      );
    case 'trophy':
      return (
        <Svg {...props}>
          <path d="M8 4h8v5a4 4 0 01-8 0V4z" {...common} />
          <path d="M8 5H5a3 3 0 003 3M16 5h3a3 3 0 01-3 3" {...common} />
          <path d="M12 13v3M9 20h6M10 20v-2.5a2 2 0 014 0V20" {...common} />
        </Svg>
      );
    case 'clock':
      return (
        <Svg {...props}>
          <circle cx="12" cy="12" r="8.5" {...common} />
          <path d="M12 7.5V12l3 2" {...common} />
        </Svg>
      );
    case 'check':
      return (
        <Svg {...props}>
          <path d="M5 13l4.5 4.5L19.5 7" {...common} />
        </Svg>
      );
    case 'x':
      return (
        <Svg {...props}>
          <path d="M6 6l12 12M18 6L6 18" {...common} />
        </Svg>
      );
    case 'user':
      return (
        <Svg {...props}>
          <circle cx="12" cy="8.5" r="3.5" {...common} />
          <path d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5" {...common} />
        </Svg>
      );
    case 'lock':
      return (
        <Svg {...props}>
          <rect x="5.5" y="10.5" width="13" height="9" rx="2" {...common} />
          <path d="M8.5 10.5V8a3.5 3.5 0 017 0v2.5" {...common} />
        </Svg>
      );
    case 'inbox':
      return (
        <Svg {...props}>
          <path d="M4 13l2.2-7.2A2 2 0 018.1 4.4h7.8a2 2 0 011.9 1.4L20 13" {...common} />
          <path d="M4 13h4.5l1 2h5l1-2H20v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4z" {...common} />
        </Svg>
      );
    case 'seal':
      return (
        <Svg {...props}>
          <circle cx="12" cy="10" r="6" {...common} />
          <path d="M9 15.5L8 21l4-2 4 2-1-5.5" {...common} />
        </Svg>
      );
    case 'flame':
      return (
        <Svg {...props}>
          <path
            d="M12 3s-5 5-5 10a5 5 0 0010 0c0-2-1-3-1.5-4-.3 1.2-1 2-1.8 2 .3-2.5-1-4.5-1.7-8z"
            {...common}
          />
        </Svg>
      );

    /* ---------- предметы (стилизованные, не копии реальных подарков) ---------- */
    case 'bear':
      return (
        <Svg {...props}>
          <circle cx="9" cy="7" r="1.8" {...common} />
          <circle cx="15" cy="7" r="1.8" {...common} />
          <circle cx="12" cy="12" r="6.2" {...common} />
          <circle cx="9.8" cy="11.5" r="0.6" fill="currentColor" stroke="none" />
          <circle cx="14.2" cy="11.5" r="0.6" fill="currentColor" stroke="none" />
          <path d="M10.5 14.5c.6.6 2.4.6 3 0" {...common} />
        </Svg>
      );
    case 'candy':
      return (
        <Svg {...props}>
          <path d="M6 12c0-3.5 2.5-6 6-6s6 2.5 6 6-2.5 6-6 6" {...common} />
          <path d="M12 6v12M9 21l3-3 3 3" {...common} />
        </Svg>
      );
    case 'bag':
      return (
        <Svg {...props}>
          <path d="M6 9h12l-1 11H7L6 9z" {...common} />
          <path d="M9 9V7a3 3 0 016 0v2" {...common} />
          <path d="M9.5 13.5h5" {...common} />
        </Svg>
      );
    case 'snake':
      return (
        <Svg {...props}>
          <path
            d="M5 8c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 3.5-1.8 5.5S13 17 15.5 17s4-1.8 4-4"
            {...common}
          />
          <circle cx="8" cy="7" r="0.6" fill="currentColor" stroke="none" />
        </Svg>
      );
    case 'sword':
      return (
        <Svg {...props}>
          <path d="M6 18L17 7" {...common} />
          <path d="M14.5 4.5l5 5M15 9l3-3M6 18l-1.8 3.8L8 20" {...common} />
        </Svg>
      );
    case 'key':
      return (
        <Svg {...props}>
          <circle cx="8" cy="9" r="3.2" {...common} />
          <path d="M10.2 11.2L19 20M16 17l2-2M13.4 14.4l2-2" {...common} />
        </Svg>
      );
    case 'glove':
      return (
        <Svg {...props}>
          <path
            d="M8 21c-2 0-3.5-1.6-3.5-3.6V13a2 2 0 014 0v-.5a2 2 0 014 0V12a2 2 0 014 0v1a2 2 0 014 0v3c0 2.8-2.3 5-5 5H8z"
            {...common}
          />
        </Svg>
      );
    case 'eye':
      return (
        <Svg {...props}>
          <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" {...common} />
          <circle cx="12" cy="12" r="3" {...common} />
        </Svg>
      );
    case 'wine':
      return (
        <Svg {...props}>
          <path d="M7 4h10l-1 6a4 4 0 01-8 0L7 4z" {...common} />
          <path d="M12 14v6M8.5 20h7" {...common} />
        </Svg>
      );
    case 'notepad':
      return (
        <Svg {...props}>
          <rect x="6" y="4" width="12" height="16" rx="2" {...common} />
          <path d="M9 9h6M9 12.5h6M9 16h4" {...common} />
          <path d="M9 4V2.5M15 4V2.5" {...common} />
        </Svg>
      );
    case 'orb':
      return (
        <Svg {...props}>
          <circle cx="12" cy="11" r="6.5" {...common} />
          <path d="M8 9.5c1.2-1 5-1 7.5.5" {...common} opacity="0.6" />
          <path d="M8.5 20h7" {...common} />
        </Svg>
      );
    case 'heart':
      return (
        <Svg {...props}>
          <path
            d="M12 20s-7-4.4-9-8.7C1.6 8 3.2 5 6.3 5c1.9 0 3.3 1 4.7 2.6C12.4 6 13.8 5 15.7 5 18.8 5 20.4 8 19 11.3 17 15.6 12 20 12 20z"
            {...common}
          />
          <rect x="9.5" y="9" width="5" height="6" rx="1.2" {...common} />
        </Svg>
      );
    case 'cigar':
      return (
        <Svg {...props}>
          <path d="M4 15.5c0-1.2 1-2 2.3-2h9.4c2.4 0 4.3 1.7 4.3 3.7S18.1 21 15.7 21H6.3C5 21 4 20.2 4 19v-3.5z" {...common} />
          <path d="M15 13.5V11M18 12.5V10.5" {...common} />
        </Svg>
      );
    case 'watch':
      return (
        <Svg {...props}>
          <circle cx="12" cy="12" r="5.5" {...common} />
          <path d="M12 9v3l2 1.2" {...common} />
          <path d="M9.5 3.5h5l-.6 3.3h-3.8L9.5 3.5zM9.5 20.5h5l-.6-3.3h-3.8l-.6 3.3z" {...common} />
        </Svg>
      );
    case 'shard':
      return (
        <Svg {...props}>
          <path d="M12 2.5L17 9l-5 12.5L7 9l5-6.5z" {...common} />
          <path d="M7 9h10M9.5 9L12 2.5M14.5 9L12 2.5" {...common} opacity="0.7" />
        </Svg>
      );
    case 'cat':
      return (
        <Svg {...props}>
          <path d="M7 4l1.5 4M17 4l-1.5 4" {...common} />
          <circle cx="12" cy="12.5" r="6" {...common} />
          <circle cx="9.7" cy="12" r="0.6" fill="currentColor" stroke="none" />
          <circle cx="14.3" cy="12" r="0.6" fill="currentColor" stroke="none" />
          <path d="M12 13.5v1M10 16c.7.5 3.3.5 4 0" {...common} />
        </Svg>
      );
    default:
      return (
        <Svg {...props}>
          <circle cx="12" cy="12" r="8" {...common} />
        </Svg>
      );
  }
}

// Пары цветов для фона карточки каждого предмета (мягкие, "дорогие" градиенты,
// не открыточные основные цвета).
export const ITEM_PALETTE = {
  'toy-bear': ['#6a4a2c', '#3a2a1c'],
  'candy-cane': ['#8a2f3d', '#2c1418'],
  'swag-bag': ['#3d5a8a', '#16202f'],
  'lunar-snake': ['#2f6b4f', '#132018'],
  'light-sword': ['#4a5fb0', '#181c2f'],
  'input-key': ['#7a6a3a', '#221f14'],
  'ufc-strike': ['#7a2f2f', '#241212'],
  'evil-eye': ['#3a7a7a', '#122222'],
  'spiced-wine': ['#7a2f4a', '#22121a'],
  'star-notepad': ['#5a4a8a', '#191426'],
  'crystal-ball': ['#3a5a8a', '#131c2a'],
  'trapped-heart': ['#8a3a5a', '#241119'],
  'vintage-cigar': ['#6a4a2a', '#221a10'],
  'swiss-watch': ['#4a4a5a', '#17171e'],
  'astral-shard': ['#4a3a8a', '#161226'],
  'scared-cat': ['#8a6a2a', '#241d0d'],
};

export function itemGradient(id) {
  const [a, b] = ITEM_PALETTE[id] || ['#3a3a44', '#17171d'];
  return `linear-gradient(150deg, ${a}, ${b})`;
}

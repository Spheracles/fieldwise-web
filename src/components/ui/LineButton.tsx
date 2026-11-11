import { SITE } from '../../config/site';
import { useApp } from '../../context/AppContext';
import { cx } from '../../lib/format';
import { track } from '../../lib/track';
import { Icon } from './Icon';

/**
 * LINE 洽詢入口：只有在 SITE.contact.lineUrl 設定有效官方連結時才外連，
 * 否則顯示「LINE 官方帳號建置中」，不放虛構 ID 或失效網址。
 */
export function LineButton({ from, className, label = 'LINE 洽詢', size = 'lg' }: { from: string; className?: string; label?: string; size?: 'md' | 'lg' }) {
  const { notify } = useApp();
  const url = SITE.contact.lineUrl;
  const cls = cx(
    'inline-flex items-center justify-center gap-2 rounded-full border border-forest/35 bg-white/80 font-semibold tracking-wide text-forest transition-colors hover:border-forest hover:bg-white',
    size === 'lg' ? 'min-h-[3.25rem] px-6 text-[17px]' : 'min-h-11 px-4 text-[15px]',
    className,
  );
  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={cls} onClick={() => track('line_click', { from, configured: true })}>
        <Icon name="message-circle" size={20} />
        {label}
        <Icon name="external-link" size={16} className="opacity-60" />
      </a>
    );
  }
  return (
    <button
      type="button"
      className={cls}
      aria-describedby="line-status"
      onClick={() => {
        track('line_click', { from, configured: false });
        notify('LINE 官方帳號建置中，目前請先使用網站表單預約初談。', 'warn');
      }}
    >
      <Icon name="message-circle" size={20} />
      {label}
      <span id="line-status" className="sr-only">
        （LINE 官方帳號建置中）
      </span>
    </button>
  );
}

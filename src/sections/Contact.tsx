import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { BUDGETS, CLIENT_TYPES, NOTES_MAX, PLAN_OPTIONS, PROBLEMS, REGIONS, ROLES, SCALES, START_TIMES, type ProblemId } from '../config/form';
import { SITE } from '../config/site';
import { useApp } from '../context/AppContext';
import { cx } from '../lib/format';
import { INQUIRY_KEY, clearDemoData, readJSON, writeJSON, type LocalInquiry } from '../lib/storage';
import { track } from '../lib/track';
import { isEmail, isTwPhone } from '../lib/validation';
import { Icon } from '../components/ui/Icon';
import { Button, NavLink, Reveal, SectionHeading } from '../components/ui/primitives';
import { LineButton } from '../components/ui/LineButton';

interface FormState {
  name: string;
  org: string;
  role: string;
  email: string;
  phone: string;
  region: string;
  clientType: string;
  problems: ProblemId[];
  scale: string;
  budget: string;
  plan: string;
  startTime: string;
  notes: string;
  consent: boolean;
}

type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = {
  name: '', org: '', role: '', email: '', phone: '', region: '', clientType: '',
  problems: [], scale: '', budget: '', plan: '', startTime: '', notes: '', consent: false,
};

const LABELS: Record<keyof FormState, string> = {
  name: '姓名／稱呼', org: '單位／農場名稱', role: '你的角色', email: 'Email', phone: '聯絡電話',
  region: '服務區域（縣市）', clientType: '客戶類型', problems: '主要問題', scale: '土地／農場規模',
  budget: '每月預算級距', plan: '有興趣的方案', startTime: '希望開始時間', notes: '補充說明', consent: '個資蒐集告知同意',
};

const ORDER: (keyof FormState)[] = ['name', 'org', 'role', 'email', 'phone', 'region', 'clientType', 'problems', 'scale', 'budget', 'plan', 'startTime', 'notes', 'consent'];

function validate(f: FormState): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = '請填寫姓名或稱呼。';
  else if (f.name.trim().length > 30) e.name = '稱呼請在 30 字以內。';
  if (!f.role) e.role = '請選擇你的角色。';
  if (!f.email.trim()) e.email = '請填寫 Email。';
  else if (!isEmail(f.email)) e.email = 'Email 格式看起來不正確，例如：name@example.com。';
  if (!f.phone.trim()) e.phone = '請填寫聯絡電話。';
  else if (!isTwPhone(f.phone)) e.phone = '請輸入手機（例 0912-345-678）或含區碼的市話（例 04-2345-6789）。';
  if (!f.region) e.region = '請選擇服務區域。';
  if (!f.clientType) e.clientType = '請選擇客戶類型。';
  if (!f.problems.length) e.problems = '請至少勾選一項主要問題。';
  if (!f.startTime) e.startTime = '請選擇希望開始的時間。';
  if (f.notes.length > NOTES_MAX) e.notes = `補充說明請在 ${NOTES_MAX} 字以內。`;
  if (!f.consent) e.consent = '請閱讀並勾選同意個資蒐集告知事項。';
  return e;
}

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative bg-cream-deep/60 py-20 lg:py-28">
      <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
        <div>
          <SectionHeading
            align="left"
            id="contact-title"
            brand="contact"
          eyebrow="預約諮詢"
            title="預約 20 分鐘免費初談。"
            desc="先聊聊農場現在的狀況與最想解決的事。初談僅做問題初篩，不會要求你當場決定任何方案。"
          />
          <Reveal className="-mt-4 rounded-[28px] bg-white p-6 ring-1 ring-line">
            <h3 className="text-[16px] font-bold text-forest-deep">正式上線後，送出表單會發生什麼</h3>
            <ol className="mt-4 space-y-4">
              {[
                ['顧問確認需求', '依你填寫的主要問題，安排合適的顧問。'],
                ['聯繫約定初談時間', '透過你留下的 Email 或電話聯繫。'],
                ['線上初談', `約 ${SITE.freeConsultMinutes} 分鐘，釐清問題與下一步。`],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-3">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage-soft text-[14px] font-bold text-forest">{i + 1}</span>
                  <span>
                    <span className="block text-[16px] font-semibold text-ink">{t}</span>
                    <span className="block text-[15px] text-subtle">{d}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-5 flex items-start gap-2 rounded-2xl bg-gold-soft/70 p-3.5 text-[14px] leading-relaxed text-[#5A4216]">
              <Icon name="info" size={16} className="mt-0.5 shrink-0 text-gold-deep" />
              目前為示範模式：表單只在你的瀏覽器中檢查與預覽，不會寄出、也不會通知團隊。
            </p>
          </Reveal>

          <Reveal className="mt-5 rounded-[28px] bg-forest p-6 text-white">
            <h3 className="flex items-center gap-2 text-[17px] font-bold">
              <Icon name="message-circle" size={20} className="text-gold" />
              習慣用 LINE？
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-white/80">
              {SITE.contact.lineUrl ? '加入 LINE 官方帳號，直接留言給我們。' : 'LINE 官方帳號建置中，開通後會在這裡提供加入連結。'}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <LineButton from="contact" className="!border-white/30 !bg-white !text-forest" />
              {!SITE.contact.lineUrl && <span className="rounded-full border border-dashed border-white/40 px-3 py-1 text-[13px] text-white/75">LINE 官方帳號建置中</span>}
            </div>
            <dl className="mt-5 grid grid-cols-1 gap-2 border-t border-white/15 pt-4 text-[14px] text-white/75">
              <div className="flex gap-2">
                <dt className="shrink-0 text-white/60">服務時間</dt>
                <dd>{SITE.contact.serviceHours}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="shrink-0 text-white/60">服務範圍</dt>
                <dd>{SITE.contact.serviceArea}</dd>
              </div>
            </dl>
          </Reveal>
        </div>

        <ConsultForm />
      </div>
    </section>
  );
}

function ConsultForm() {
  const { prefill, notify } = useApp();
  const [f, setF] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [step, setStep] = useState<'edit' | 'review' | 'done'>('edit');
  const [prefillLabel, setPrefillLabel] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [saved, setSaved] = useState(false);
  const started = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  // 由「詢問此方案」「帶著診斷結果預約」帶入資料
  useEffect(() => {
    if (!prefill) return;
    setStep('edit');
    setF((prev) => ({
      ...prev,
      plan: prefill.plan ?? prev.plan,
      problems: prefill.problems ? Array.from(new Set([...prev.problems, ...prefill.problems])) : prev.problems,
    }));
    setPrefillLabel(prefill.label);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefill?.nonce]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    const next = { ...f, [k]: v };
    setF(next);
    // 已互動過或已有錯誤的欄位，輸入時即時重新檢查
    if (touched[k] || errors[k]) setErrors((e) => ({ ...e, [k]: validate(next)[k] }));
  };

  const blur = (k: keyof FormState) => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors((e) => ({ ...e, [k]: validate(f)[k] }));
  };

  const onFocusCapture = () => {
    if (!started.current) {
      started.current = true;
      track('form_start');
    }
  };

  const review = () => {
    const e = validate(f);
    setErrors(e);
    setTouched(Object.fromEntries(ORDER.map((k) => [k, true])));
    const keys = ORDER.filter((k) => e[k]);
    track('form_review', { valid: keys.length === 0, errors: keys.length });
    if (keys.length) {
      setShowSummary(true);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setShowSummary(false);
    setStep('review');
    requestAnimationFrame(() => cardRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }));
  };

  const submitDemo = () => {
    track('form_submit_demo', { problems: f.problems.length, plan: f.plan || 'none' });
    setStep('done');
    setSaved(false);
    requestAnimationFrame(() => cardRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }));
  };

  const saveLocal = () => {
    const list = readJSON<LocalInquiry[]>(INQUIRY_KEY, []);
    const item: LocalInquiry = {
      id: `LOCAL-${Date.now().toString(36).slice(-5).toUpperCase()}`,
      createdAt: new Date().toISOString().slice(0, 10),
      region: f.region,
      clientType: f.clientType,
      problems: f.problems.map((p) => PROBLEMS.find((x) => x.id === p)!.label),
      plan: PLAN_OPTIONS.find((p) => p.value === f.plan)?.label ?? '尚未決定',
      startTime: f.startTime,
    };
    const ok = writeJSON(INQUIRY_KEY, [item, ...list].slice(0, 10));
    if (ok) {
      setSaved(true);
      notify('已在這台裝置保存一筆不含姓名與聯絡方式的示範紀錄。', 'success');
    } else {
      notify('這個瀏覽器不允許本機儲存，示範紀錄未保存。', 'warn');
    }
  };

  const restart = () => {
    setF(EMPTY);
    setErrors({});
    setTouched({});
    setStep('edit');
    setPrefillLabel(null);
    setShowSummary(false);
    started.current = false;
  };

  const errorKeys = ORDER.filter((k) => errors[k]);

  return (
    <div ref={cardRef} className="scroll-mt-24 rounded-[32px] border border-line bg-white p-5 shadow-lift sm:p-8 lg:p-10">
      <StepIndicator step={step} />

      {step === 'edit' && (
        <form noValidate onFocusCapture={onFocusCapture} onSubmit={(e) => { e.preventDefault(); review(); }} aria-describedby="form-req-note">
          <p id="form-req-note" className="mb-6 text-[14px] text-muted">
            標示 <span className="font-bold text-danger">*</span> 為必填。請勿填寫身分證字號、銀行帳號等敏感資料。
          </p>

          {prefillLabel && (
            <div className="fade-in mb-6 flex items-start justify-between gap-3 rounded-2xl bg-sage-mist px-4 py-3 text-[15px] text-forest">
              <span className="flex items-start gap-2">
                <Icon name="sparkles" size={18} className="mt-0.5 shrink-0" />
                已依「{prefillLabel}」帶入方案或主要問題，你可以再調整。
              </span>
              <button type="button" className="-m-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-white" aria-label="關閉提示" onClick={() => setPrefillLabel(null)}>
                <Icon name="x" size={16} />
              </button>
            </div>
          )}

          {showSummary && errorKeys.length > 0 && (
            <div ref={summaryRef} tabIndex={-1} role="alert" className="mb-6 rounded-2xl border border-danger/40 bg-danger-soft p-4 outline-none">
              <p className="flex items-center gap-2 text-[16px] font-bold text-danger">
                <Icon name="circle-alert" size={20} />
                還有 {errorKeys.length} 個欄位需要確認
              </p>
              <ul className="mt-2 space-y-1 pl-7 text-[15px]">
                {errorKeys.map((k) => (
                  <li key={k}>
                    <a
                      href={`#f-${k}`}
                      className="text-danger underline underline-offset-4"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(`f-${k}`);
                        el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
                        el?.focus({ preventScroll: true });
                      }}
                    >
                      {LABELS[k]}：{errors[k]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field k="name" label={LABELS.name} required error={errors.name}>
              {(p) => <input {...p} type="text" autoComplete="name" value={f.name} onChange={(e) => set('name', e.target.value)} onBlur={() => blur('name')} placeholder="例：林小姐" />}
            </Field>
            <Field k="org" label={LABELS.org} hint="尚未命名可留空">
              {(p) => <input {...p} type="text" autoComplete="organization" value={f.org} onChange={(e) => set('org', e.target.value)} placeholder="例：○○農場" />}
            </Field>
            <Field k="role" label={LABELS.role} required error={errors.role}>
              {(p) => (
                <Select {...p} value={f.role} onChange={(v) => set('role', v)} onBlur={() => blur('role')} options={ROLES} placeholder="請選擇角色" />
              )}
            </Field>
            <Field k="clientType" label={LABELS.clientType} required error={errors.clientType}>
              {(p) => (
                <Select {...p} value={f.clientType} onChange={(v) => set('clientType', v)} onBlur={() => blur('clientType')} options={CLIENT_TYPES} placeholder="請選擇類型" />
              )}
            </Field>
            <Field k="email" label={LABELS.email} required error={errors.email}>
              {(p) => <input {...p} type="email" inputMode="email" autoComplete="email" value={f.email} onChange={(e) => set('email', e.target.value)} onBlur={() => blur('email')} placeholder="name@example.com" />}
            </Field>
            <Field k="phone" label={LABELS.phone} required error={errors.phone} hint="手機或含區碼市話">
              {(p) => <input {...p} type="tel" inputMode="tel" autoComplete="tel" value={f.phone} onChange={(e) => set('phone', e.target.value)} onBlur={() => blur('phone')} placeholder="0912-345-678" />}
            </Field>
            <Field k="region" label={LABELS.region} required error={errors.region}>
              {(p) => (
                <Select {...p} value={f.region} onChange={(v) => set('region', v)} onBlur={() => blur('region')} options={REGIONS} placeholder="請選擇縣市" />
              )}
            </Field>
            <Field k="startTime" label={LABELS.startTime} required error={errors.startTime}>
              {(p) => (
                <Select {...p} value={f.startTime} onChange={(v) => set('startTime', v)} onBlur={() => blur('startTime')} options={START_TIMES} placeholder="請選擇" />
              )}
            </Field>
          </div>

          <fieldset className="mt-6" aria-describedby={errors.problems ? 'f-problems-err' : undefined}>
            <legend className="text-[16px] font-semibold text-ink">
              {LABELS.problems}（可複選）<span className="ml-1 font-bold text-danger" aria-hidden>*</span>
              <span className="sr-only">（必填）</span>
            </legend>
            <div id="f-problems" tabIndex={-1} className="mt-3 grid grid-cols-2 gap-2.5 outline-none">
              {PROBLEMS.map((p) => {
                const on = f.problems.includes(p.id);
                return (
                  <label
                    key={p.id}
                    className={cx(
                      'relative flex min-h-12 cursor-pointer items-center gap-2 rounded-2xl border px-3 py-2.5 text-[15px] transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold',
                      on ? 'border-forest bg-sage-mist font-semibold text-forest-deep' : 'border-line bg-white text-ink hover:border-forest/40',
                      errors.problems && !on && 'border-danger/50',
                    )}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={on}
                      onChange={() => set('problems', on ? f.problems.filter((x) => x !== p.id) : [...f.problems, p.id])}
                    />
                    <span aria-hidden className={cx('inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2', on ? 'border-forest bg-forest text-white' : 'border-line')}>
                      {on && <Icon name="check" size={13} strokeWidth={3} />}
                    </span>
                    {p.label}
                  </label>
                );
              })}
            </div>
            {errors.problems && <ErrorText id="f-problems-err">{errors.problems}</ErrorText>}
          </fieldset>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field k="scale" label={LABELS.scale} hint="選填・1 甲約 0.97 公頃">
              {(p) => <Select {...p} value={f.scale} onChange={(v) => set('scale', v)} options={SCALES} placeholder="不填寫" />}
            </Field>
            <Field k="budget" label={LABELS.budget} hint="選填">
              {(p) => <Select {...p} value={f.budget} onChange={(v) => set('budget', v)} options={BUDGETS} placeholder="不填寫" />}
            </Field>
            <div className="sm:col-span-2">
            <Field k="plan" label={LABELS.plan} hint="選填">
              {(p) => (
                <div className="relative">
                  <select {...p} value={f.plan} onChange={(e) => set('plan', e.target.value)} className={cx(p.className, 'appearance-none pr-11')}>
                    {PLAN_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <Icon name="chevron-down" size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted" />
                </div>
              )}
            </Field>
            </div>
          </div>

          <div className="mt-5">
            <Field k="notes" label={LABELS.notes} error={errors.notes} hint={`選填・${f.notes.length}/${NOTES_MAX} 字`}>
              {(p) => (
                <textarea
                  {...p}
                  rows={4}
                  value={f.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  onBlur={() => blur('notes')}
                  placeholder="例如：作物種類、目前用什麼方式接單、最想先解決的一件事。"
                  className={cx(p.className, 'min-h-[120px] py-3')}
                />
              )}
            </Field>
          </div>

          <div className="mt-6 rounded-2xl bg-cream p-4 sm:p-5">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                id="f-consent"
                type="checkbox"
                checked={f.consent}
                onChange={(e) => set('consent', e.target.checked)}
                aria-invalid={!!errors.consent}
                aria-describedby={errors.consent ? 'f-consent-err' : undefined}
                className="mt-1 h-5 w-5 shrink-0 accent-[#214D3D]"
              />
              <span className="text-[15px] leading-relaxed text-ink">
                我已閱讀並同意下方「個人資料蒐集告知事項」，同意田序共創為回覆諮詢與安排初談，蒐集、處理及利用我填寫的資料。
                <span className="ml-1 font-bold text-danger" aria-hidden>*</span>
              </span>
            </label>
            {errors.consent && <ErrorText id="f-consent-err">{errors.consent}</ErrorText>}
            <details className="group mt-3 rounded-xl bg-white px-4 py-3 text-[14px] leading-relaxed text-subtle ring-1 ring-line">
              <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between font-semibold text-forest">
                個人資料蒐集告知事項（草稿）
                <Icon name="chevron-down" size={16} className="transition-transform group-open:rotate-180" />
              </summary>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>蒐集者：田序共創（公司名稱建置中）。</li>
                <li>蒐集目的：回覆諮詢、安排初談與後續服務聯繫。</li>
                <li>個人資料類別：姓名或稱呼、聯絡方式、農場與經營相關資訊。</li>
                <li>利用期間、地區、對象及方式：於蒐集目的存續期間，在臺灣地區由本團隊以電子或書面方式利用；正式保留期限將於上線前公告。</li>
                <li>你可以依個人資料保護法第 3 條，請求查詢、閱覽、製給複製本、補充或更正、停止蒐集處理利用或刪除。</li>
                <li>你可以自由選擇是否提供；若未提供必填資料，我們將無法回覆諮詢。</li>
              </ul>
              <p className="mt-2 text-[13px] text-muted">本告知內容為草稿，正式上線前需由律師審閱。完整說明請見<NavLink to="privacy" className="mx-1 text-forest underline underline-offset-2">隱私權政策</NavLink>。</p>
            </details>
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[14px] text-muted">下一步會先顯示摘要，確認後才會「示範送出」。</p>
            <Button type="submit" size="lg" iconRight="arrow-right" onClick={(e) => { e.preventDefault(); review(); }}>
              檢查並預覽
            </Button>
          </div>
        </form>
      )}

      {step === 'review' && (
        <div className="fade-in">
          <h3 className="font-serif text-[24px] font-bold text-forest-deep">請確認你的預約資料</h3>
          <p className="mt-1 text-[15px] text-subtle">確認無誤後按「確認送出（示範）」；示範模式不會寄出任何資料。</p>
          <dl className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line">
            {ORDER.filter((k) => k !== 'consent').map((k) => (
              <div key={k} className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-[150px_1fr] sm:gap-4">
                <dt className="text-[14px] font-medium text-muted">{LABELS[k]}</dt>
                <dd className="break-words text-[15px] text-ink">{displayValue(f, k)}</dd>
              </div>
            ))}
            <div className="grid grid-cols-1 gap-1 bg-sage-mist/60 px-4 py-3 sm:grid-cols-[150px_1fr] sm:gap-4">
              <dt className="text-[14px] font-medium text-muted">{LABELS.consent}</dt>
              <dd className="flex items-center gap-1.5 text-[15px] text-forest">
                <Icon name="circle-check" size={16} />
                已同意
              </dd>
            </div>
          </dl>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button variant="outline" icon="pencil" onClick={() => setStep('edit')}>
              返回修改
            </Button>
            <Button size="lg" icon="send" onClick={submitDemo}>
              確認送出（示範）
            </Button>
          </div>
        </div>
      )}

      {step === 'done' && (
        <div className="fade-in" role="status">
          <div className="rounded-3xl border-2 border-dashed border-gold/60 bg-gold-soft/50 p-6 text-center sm:p-8">
            <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-gold-deep shadow-soft">
              <Icon name="info" size={32} />
            </span>
            <h3 className="mt-4 font-serif text-[24px] font-bold text-forest-deep">這是前端示範，尚未送達團隊。</h3>
            <p className="mx-auto mt-3 max-w-lg text-[16px] leading-[1.85] text-[#5A4216]">
              你的資料只在這個瀏覽器中完成了檢查與預覽，沒有傳送到任何伺服器，團隊也不會收到通知。
              {SITE.contact.lineUrl ? '如需聯繫，請使用 LINE 官方帳號。' : '正式受理管道開通前，請勿以此視為已完成預約。'}
            </p>
          </div>

          <div className="mt-5 rounded-2xl bg-cream p-5">
            <h4 className="text-[16px] font-bold text-forest-deep">要在這台裝置保存示範紀錄嗎？（選用）</h4>
            <p className="mt-1 text-[14px] leading-relaxed text-subtle">
              只會保存縣市、客戶類型、主要問題、方案與希望開始時間，<strong className="font-semibold text-ink">不含姓名、Email、電話與補充說明</strong>
              。保存後可在「管理者工作台示範」的洽詢名單中看到。
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {saved ? (
                <NavLink to="admin-demo" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-forest px-5 text-[15px] font-semibold text-white">
                  <Icon name="kanban" size={18} />
                  到管理者工作台查看
                </NavLink>
              ) : (
                <Button size="sm" variant="forest" icon="save" onClick={saveLocal}>
                  保存不含個資的示範紀錄
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                icon="trash-2"
                onClick={() => {
                  const n = clearDemoData();
                  setSaved(false);
                  notify(n ? `已清除這台裝置上的 ${n} 筆示範資料。` : '這台裝置上沒有儲存任何示範資料。', 'success');
                }}
              >
                清除本機示範資料
              </Button>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button variant="ghost" icon="rotate-ccw" onClick={restart}>
              重新填寫
            </Button>
            <Button variant="outline" to="top" icon="house">
              回到首頁頂端
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function displayValue(f: FormState, k: keyof FormState): ReactNode {
  const v = f[k];
  if (k === 'problems') return f.problems.map((p) => PROBLEMS.find((x) => x.id === p)!.label).join('、');
  if (k === 'plan') return PLAN_OPTIONS.find((p) => p.value === f.plan)?.label ?? '尚未決定';
  if (typeof v === 'string') return v.trim() ? v : <span className="text-muted">未填寫</span>;
  return String(v);
}

function StepIndicator({ step }: { step: 'edit' | 'review' | 'done' }) {
  const steps = [
    { k: 'edit', label: '填寫資料' },
    { k: 'review', label: '確認摘要' },
    { k: 'done', label: '示範送出' },
  ];
  const idx = steps.findIndex((s) => s.k === step);
  return (
    <ol className="mb-7 flex items-center gap-2" aria-label="預約步驟">
      {steps.map((s, i) => (
        <li key={s.k} className="flex flex-1 items-center gap-2" aria-current={i === idx ? 'step' : undefined}>
          <span
            className={cx(
              'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[14px] font-bold transition-colors',
              i < idx ? 'bg-sage text-white' : i === idx ? 'bg-forest text-white' : 'bg-cream text-muted ring-1 ring-line',
            )}
          >
            {i < idx ? <Icon name="check" size={16} strokeWidth={2.5} /> : i + 1}
          </span>
          <span className={cx('whitespace-nowrap text-[14px] font-semibold sm:inline sm:text-[15px]', i === idx ? 'text-forest-deep' : 'hidden text-muted')}>{s.label}</span>
          {i < steps.length - 1 && <span aria-hidden className={cx('mx-1 h-px flex-1', i < idx ? 'bg-sage' : 'bg-line')} />}
        </li>
      ))}
    </ol>
  );
}

/* ---------------- 欄位元件 ---------------- */

const inputBase =
  'w-full min-h-12 rounded-2xl border bg-white px-4 text-[16px] text-ink placeholder:text-muted/70 outline-none transition-[border-color,box-shadow] focus:border-forest focus:ring-4 focus:ring-forest/10';

interface FieldRenderProps {
  id: string;
  className: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
  'aria-required'?: boolean;
}

function Field({ k, label, required, error, hint, children }: { k: keyof FormState; label: string; required?: boolean; error?: string; hint?: string; children: (p: FieldRenderProps) => ReactNode }) {
  const id = `f-${k}`;
  const hintId = useId();
  const describedBy = [error ? `${id}-err` : '', hint ? hintId : ''].filter(Boolean).join(' ') || undefined;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-[16px] font-semibold text-ink">
          {label}
          {required && (
            <>
              <span className="ml-1 font-bold text-danger" aria-hidden>
                *
              </span>
              <span className="sr-only">（必填）</span>
            </>
          )}
        </label>
        {hint && (
          <span id={hintId} className="text-[13px] text-muted">
            {hint}
          </span>
        )}
      </div>
      {children({
        id,
        className: cx(inputBase, error ? 'border-danger focus:border-danger focus:ring-danger/10' : 'border-line'),
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
        'aria-required': required || undefined,
      })}
      {error && <ErrorText id={`${id}-err`}>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-[14px] font-medium text-danger">
      <Icon name="circle-alert" size={15} className="mt-0.5 shrink-0" />
      {children}
    </p>
  );
}

function Select({
  options,
  placeholder,
  onChange,
  onBlur,
  value,
  ...p
}: FieldRenderProps & { options: readonly string[]; placeholder: string; value: string; onChange: (v: string) => void; onBlur?: () => void }) {
  return (
    <div className="relative">
      <select {...p} value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} className={cx(p.className, 'appearance-none pr-11', !value && 'text-muted')}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o} className="text-ink">
            {o}
          </option>
        ))}
      </select>
      <Icon name="chevron-down" size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted" />
    </div>
  );
}

// Rasmor / rasmor.dev
// The page works fully without this file. It adds the pinned obstacle-to-bridge story,
// the header rule, gentle section reveals and the copy-email button.
(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Header gets a hairline once the page moves
  const header = document.querySelector('.site-header');
  const onScrollHeader = () => header && header.classList.toggle('is-scrolled', window.scrollY > 8);

  // The segment's three positions, in the mark's 260x200 coordinate space:
  // upright in the gap (obstacle), lifted and turning (reconsider), resting across (the way).
  const START = { x: 128, y: 116, a: -90 };
  const MID = { x: 116, y: 78, a: -48 };
  const END = { x: 117.85, y: 102.4, a: -10.04 };
  // Quadratic control point so the curve passes through MID at t = 0.5
  const CTRL = { x: 2 * MID.x - (START.x + END.x) / 2, y: 2 * MID.y - (START.y + END.y) / 2 };

  const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  const placeBar = (bar, t) => {
    const k = ease(t);
    const u = 1 - k;
    const x = u * u * START.x + 2 * u * k * CTRL.x + k * k * END.x;
    const y = u * u * START.y + 2 * u * k * CTRL.y + k * k * END.y;
    const a = START.a + (END.a - START.a) * k;
    bar.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${a.toFixed(2)})`);
  };

  const story = document.querySelector('[data-story]');
  const stage = story && story.querySelector('.story__stage');
  const bar = story && story.querySelector('[data-bar]');
  const arc = story && story.querySelector('[data-arc]');
  const fill = story && story.querySelector('[data-fill]');
  const steps = story ? [...story.querySelectorAll('[data-step]')] : [];
  const captions = story ? [...story.querySelectorAll('[data-caption]')] : [];
  let storyOn = false;
  let lastStep = -1;

  const setStep = (i) => {
    if (i === lastStep) return;
    lastStep = i;
    steps.forEach((el, n) => {
      el.classList.toggle('is-active', n === i);
      if (n === i) el.setAttribute('aria-current', 'step');
      else el.removeAttribute('aria-current');
    });
    captions.forEach((el, n) => {
      el.classList.toggle('is-active', n === i);
      el.setAttribute('aria-hidden', n === i ? 'false' : 'true');
    });
  };

  // Desktop pins the whole stage; phones pin only the figure inside its own track
  const small = window.matchMedia('(max-width: 900px)');
  const track = story && story.querySelector('[data-track]');
  const pin = track && track.querySelector('[data-pin]');

  const renderStory = () => {
    if (!storyOn) return;
    const [outer, inner] = small.matches && track ? [track, pin] : [story, stage];
    const top = parseFloat(getComputedStyle(inner).top) || 0;
    const travel = outer.offsetHeight - inner.offsetHeight;
    const p = travel > 0 ? clamp((top - outer.getBoundingClientRect().top) / travel) : 1;
    // Hold the obstacle briefly, turn, then hold the bridge before releasing the pin
    const t = clamp((p - 0.1) / 0.72);
    placeBar(bar, t);
    if (arc) arc.style.opacity = (Math.sin(Math.PI * t) * 0.7).toFixed(3);
    if (fill) fill.style.transform = `scaleX(${t.toFixed(4)})`;
    setStep(t < 0.12 ? 0 : t < 0.88 ? 1 : 2);
  };

  const enableStory = () => {
    if (!story || !bar) return;
    storyOn = !reduce.matches;
    root.classList.toggle('js-story', storyOn);
    if (storyOn) {
      lastStep = -1;
      renderStory();
    } else {
      placeBar(bar, 1);
      if (arc) arc.style.opacity = 0;
      if (fill) fill.style.transform = '';
      steps.forEach((el) => el.classList.add('is-active'));
      captions.forEach((el) => el.removeAttribute('aria-hidden'));
    }
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      onScrollHeader();
      renderStory();
    });
  };

  // Section reveals
  const reveal = () => {
    const items = document.querySelectorAll('[data-reveal]');
    if (reduce.matches || !('IntersectionObserver' in window)) {
      root.classList.remove('js-reveal');
      return;
    }
    root.classList.add('js-reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    items.forEach((el) => io.observe(el));
  };

  // Copy email
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    const label = btn.textContent;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.textContent = btn.dataset.copied || 'Copied';
      } catch {
        window.location.href = `mailto:${btn.dataset.copy}`;
        return;
      }
      setTimeout(() => { btn.textContent = label; }, 2000);
    });
  });

  enableStory();
  reveal();
  onScrollHeader();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  reduce.addEventListener('change', () => { enableStory(); reveal(); });
  small.addEventListener('change', onScroll);
})();

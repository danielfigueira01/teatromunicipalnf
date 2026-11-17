import { theaterSupabase } from '/assets/teatro-supabase.js';

const cards = document.querySelector('#cards');
const detail = document.querySelector('#detail-dialog');
const calendarList = document.querySelector('#calendar-list');
const featureTabs = document.querySelector('.feature-tabs');

const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
})[character]);

const toEvent = (record) => {
  const [year, month, day] = record.event_date.split('-').map(Number);
  return {
    id: record.slug,
    title: record.title,
    full: record.full_title,
    cat: record.category,
    day: String(day).padStart(2, '0'),
    month,
    year,
    time: record.event_time,
    image: record.image_url,
    desc: record.description,
    producer: record.producer,
    url: record.ticket_url,
    free: record.is_free,
    featuredRank: record.featured_rank
  };
};

const formatDate = (event) => new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
}).format(new Date(Date.UTC(event.year, event.month - 1, Number(event.day))));

const openDetails = (event) => {
  document.querySelector('#detail-img').src = event.image;
  document.querySelector('#detail-img').alt = `Cartaz de ${event.full}`;
  document.querySelector('#detail-title').textContent = event.full;
  document.querySelector('#detail-cat').textContent = event.cat;
  document.querySelector('#detail-meta').textContent = `${formatDate(event)} · ${event.time} · ${event.producer}`;
  document.querySelector('#detail-desc').textContent = event.desc;
  const link = document.querySelector('#detail-link');
  link.href = event.url;
  link.textContent = event.free ? 'Consultar acesso gratuito ↗' : 'Comprar ingresso ↗';
  detail.showModal();
};

const renderCards = (events) => {
  cards.replaceChildren();
  events.forEach((event) => {
    const article = document.createElement('article');
    article.className = 'card';
    article.dataset.category = event.cat;
    article.dataset.free = String(Boolean(event.free));
    article.innerHTML = `<div class="poster"><img src="${escapeHtml(event.image)}" alt="Cartaz de ${escapeHtml(event.full)}" loading="lazy"><div class="date"><strong>${escapeHtml(event.day)}</strong><small>${escapeHtml(new Intl.DateTimeFormat('pt-BR', { month: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(event.year, event.month - 1, 1))).replace('.', '').toUpperCase())}</small></div></div><div class="card-body"><div><span class="cat">${escapeHtml(event.cat === 'Teatro' ? 'Teatro / Comédia' : event.cat)}</span>${event.free ? '<span class="free">ENTRADA GRATUITA</span>' : ''}</div><h3>${escapeHtml(event.title)}</h3><p class="desc">${escapeHtml(event.desc)}</p><div class="facts"><span>◷ ${escapeHtml(event.time)}</span><span>· ${escapeHtml(formatDate(event))}</span>${event.free ? '<span>· Livre</span>' : ''}</div><div class="card-actions"><a class="btn" href="${escapeHtml(event.url)}" target="_blank" rel="noopener noreferrer">${event.free ? 'Informações de acesso' : 'Comprar ingresso'} ↗</a><button class="text-btn" type="button">Ver detalhes</button></div></div>`;
    article.querySelector('button').addEventListener('click', () => openDetails(event));
    cards.append(article);
  });
};

const renderCalendar = (events) => {
  calendarList.innerHTML = events.map((event) => `<li><b>${escapeHtml(event.title)}</b><span>${escapeHtml(formatDate(event))} · ${escapeHtml(event.time)}</span></li>`).join('');
};

let heroDetail = document.querySelector('#hero-detail');
// The static page has an earlier click handler; replacing this button avoids
// retaining that stale listener after the live schedule is rendered.
heroDetail.replaceWith(heroDetail.cloneNode(true));
heroDetail = document.querySelector('#hero-detail');

const setHero = (event, featured) => {
  document.querySelector('#hero-title').textContent = event.title;
  document.querySelector('#hero-category').textContent = `${event.cat}${event.free ? ' · ENTRADA GRATUITA' : ` · ${event.year}`}`;
  document.querySelector('#hero-count').textContent = `${String(featured.indexOf(event) + 1).padStart(2, '0')} / ${String(featured.length).padStart(2, '0')}`;
  document.querySelector('#hero-description').textContent = event.desc;
  document.querySelector('#hero-date').textContent = formatDate(event);
  document.querySelector('#hero-time').textContent = event.time;
  document.querySelector('#hero-image').src = event.image;
  document.querySelector('#hero-image').alt = `Cartaz de ${event.full}`;
  const ticket = document.querySelector('#hero-ticket');
  ticket.href = event.url;
  ticket.textContent = event.free ? 'Informações de acesso ↗' : 'Comprar ingresso ↗';
  heroDetail.onclick = () => openDetails(event);
};

const renderFeatured = (events) => {
  const featured = events.filter((event) => event.featuredRank).sort((a, b) => a.featuredRank - b.featuredRank);
  if (!featured.length) return;
  featureTabs.replaceChildren();
  featured.forEach((event, index) => {
    const button = document.createElement('button');
    button.className = `feature-tab${index === 0 ? ' active' : ''}`;
    button.type = 'button';
    button.setAttribute('aria-pressed', String(index === 0));
    button.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span><div><small>${escapeHtml(event.day)} ${escapeHtml(new Intl.DateTimeFormat('pt-BR', { month: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(event.year, event.month - 1, 1))).replace('.', '').toUpperCase())} · ${escapeHtml(event.time)}</small><b>${escapeHtml(event.title)}</b></div><i>↗</i>`;
    button.addEventListener('click', () => {
      featureTabs.querySelectorAll('button').forEach((tab) => {
        const active = tab === button;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-pressed', String(active));
      });
      setHero(event, featured);
    });
    featureTabs.append(button);
  });
  setHero(featured[0], featured);
};

const monthKey = (event) => `${event.year}-${String(event.month).padStart(2, '0')}`;
const monthLabel = (key) => {
  const [year, month] = key.split('-').map(Number);
  return new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(year, month - 1, 1)));
};

const setupSchedule = (events) => {
  const select = document.querySelector('#schedule-month');
  const today = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric', month: '2-digit', timeZone: 'America/Sao_Paulo'
  }).formatToParts(new Date());
  const currentMonth = `${today.find((part) => part.type === 'year').value}-${today.find((part) => part.type === 'month').value}`;
  const months = [...new Set([currentMonth, ...events.map(monthKey)])].sort();
  select.replaceChildren(...months.map((key) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = monthLabel(key);
    return option;
  }));
  select.value = currentMonth;
  let category = document.querySelector('[data-filter][aria-pressed="true"]')?.dataset.filter || 'all';

  const renderMonth = () => {
    const monthlyEvents = events.filter((event) => monthKey(event) === select.value);
    const visibleEvents = monthlyEvents.filter((event) => category === 'all' || event.cat === category || (category === 'Gratuito' && event.free));
    renderCards(visibleEvents);
    renderCalendar(monthlyEvents);
    const title = monthLabel(select.value);
    document.querySelector('#calendar-title').textContent = title.charAt(0).toUpperCase() + title.slice(1);
    document.querySelector('#calendar-summary').textContent = monthlyEvents.length
      ? `Programação de ${title}.`
      : `Nenhum espetáculo publicado para ${title}.`;
    const empty = document.querySelector('#empty');
    empty.textContent = monthlyEvents.length ? 'Nenhum espetáculo nesta categoria.' : 'Nenhum espetáculo publicado para este mês.';
    empty.style.display = visibleEvents.length ? 'none' : 'block';
  };

  // Replace the static fallback listeners so month and category share one state.
  document.querySelectorAll('[data-filter]').forEach((original) => {
    const button = original.cloneNode(true);
    original.replaceWith(button);
    button.addEventListener('click', () => {
      category = button.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach((filter) => filter.setAttribute('aria-pressed', String(filter === button)));
      renderMonth();
    });
  });
  select.addEventListener('change', renderMonth);
  renderMonth();
};

try {
  const { data, error } = await theaterSupabase.from('events').select('*').eq('published', true).order('event_date').order('event_time');
  if (error) throw error;
  if (data) {
    const events = data.map(toEvent);
    setupSchedule(events);
    renderFeatured(events);
  }
} catch (error) {
  console.warn('A programação publicada não pôde ser atualizada.', error);
}

import { theaterAdminEmail, theaterSupabase } from '/assets/teatro-supabase.js'; const additionalAdminEmail = 'teatromunicipalnovafriburgo@gmail.com';

const authCard = document.querySelector('#auth-card');
const app = document.querySelector('#app');
const authForm = document.querySelector('#auth-form');
const eventForm = document.querySelector('#event-form');
const authStatus = document.querySelector('#auth-status');
const eventStatus = document.querySelector('#event-status');
const fields = {
  originalSlug: document.querySelector('#event-original-slug'),
  slug: document.querySelector('#event-slug'),
  category: document.querySelector('#event-category'),
  title: document.querySelector('#event-title'),
  fullTitle: document.querySelector('#event-full-title'),
  date: document.querySelector('#event-date'),
  time: document.querySelector('#event-time'),
  producer: document.querySelector('#event-producer'),
  ticket: document.querySelector('#event-ticket'),
  description: document.querySelector('#event-description'),
  imageUrl: document.querySelector('#event-image-url'),
  imageFile: document.querySelector('#event-image-file'),
  free: document.querySelector('#event-free'),
  published: document.querySelector('#event-published'),
  featured: document.querySelector('#event-featured')
};
let events = [];

const showStatus = (target, message, kind = '') => {
  target.textContent = message;
  target.className = `status ${kind}`;
};
const hideStatus = (target) => target.className = 'status hidden';
const cleanSlug = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[character]);

const resetEventForm = () => {
  eventForm.reset();
  fields.originalSlug.value = '';
  fields.published.checked = true;
  hideStatus(eventStatus);
};

const renderEvents = () => {
  const holder = document.querySelector('#events-table');
  if (!events.length) { holder.innerHTML = '<p class="hint">Nenhum evento cadastrado.</p>'; return; }
  holder.innerHTML = `<table><thead><tr><th>Data</th><th>Evento</th><th>Status</th><th>Ações</th></tr></thead><tbody>${events.map((event) => `<tr><td>${escapeHtml(event.event_date)}<br>${escapeHtml(event.event_time)}</td><td><strong>${escapeHtml(event.title)}</strong><br><span>${escapeHtml(event.category)} · ${escapeHtml(event.producer)}</span></td><td>${event.published ? 'Publicado' : 'Rascunho'}${event.featured_rank ? `<br>Destaque ${event.featured_rank}` : ''}</td><td><div class="row-actions"><button type="button" data-edit="${escapeHtml(event.slug)}" class="secondary">Editar</button><button type="button" data-delete="${escapeHtml(event.slug)}" class="danger">Excluir</button></div></td></tr>`).join('')}</tbody></table>`;
  holder.querySelectorAll('[data-edit]').forEach((button) => button.addEventListener('click', () => editEvent(button.dataset.edit)));
  holder.querySelectorAll('[data-delete]').forEach((button) => button.addEventListener('click', () => deleteEvent(button.dataset.delete)));
};

const loadEvents = async () => {
  const { data, error } = await theaterSupabase.from('events').select('*').order('event_date').order('event_time');
  if (error) throw error;
  events = data;
  renderEvents();
};

const editEvent = (slug) => {
  const event = events.find((item) => item.slug === slug);
  if (!event) return;
  fields.originalSlug.value = event.slug;
  fields.slug.value = event.slug;
  fields.title.value = event.title;
  fields.fullTitle.value = event.full_title;
  fields.category.value = event.category;
  fields.date.value = event.event_date;
  fields.time.value = event.event_time;
  fields.producer.value = event.producer;
  fields.ticket.value = event.ticket_url;
  fields.description.value = event.description;
  fields.imageUrl.value = event.image_url;
  fields.free.checked = event.is_free;
  fields.published.checked = event.published;
  fields.featured.value = event.featured_rank ?? '';
  eventForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const deleteEvent = async (slug) => {
  const event = events.find((item) => item.slug === slug);
  if (!event || !window.confirm(`Excluir “${event.title}”? Esta ação não pode ser desfeita.`)) return;
  try {
    const { error } = await theaterSupabase.from('events').delete().eq('slug', slug);
    if (error) throw error;
    showStatus(eventStatus, 'Evento excluído.', 'success');
    await loadEvents();
  } catch (error) { showStatus(eventStatus, error.message || 'Não foi possível excluir o evento.', 'error'); }
};

const uploadPoster = async (file, slug) => {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) throw new Error('Envie JPG, PNG ou WebP de até 5 MB.');
  const extension = file.name.split('.').pop().toLowerCase();
  const path = `${slug}/${Date.now()}.${extension}`;
  const { error } = await theaterSupabase.storage.from('event-posters').upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  return theaterSupabase.storage.from('event-posters').getPublicUrl(path).data.publicUrl;
};

eventForm.addEventListener('submit', async (submitEvent) => {
  submitEvent.preventDefault();
  hideStatus(eventStatus);
  const slug = cleanSlug(fields.slug.value);
  if (slug.length < 3) { showStatus(eventStatus, 'Informe um identificador válido.', 'error'); return; }
  try {
    showStatus(eventStatus, 'Salvando…');
    let imageUrl = fields.imageUrl.value.trim();
    const file = fields.imageFile.files[0];
    if (file) imageUrl = await uploadPoster(file, slug);
    if (!imageUrl) throw new Error('Envie um cartaz ou informe a URL da imagem.');
    const rank = fields.featured.value ? Number(fields.featured.value) : null;
    if (rank) {
      const { error: rankError } = await theaterSupabase.from('events').update({ featured_rank: null }).eq('featured_rank', rank);
      if (rankError) throw rankError;
    }
    const record = {
      slug, title: fields.title.value.trim(), full_title: fields.fullTitle.value.trim(), category: fields.category.value,
      event_date: fields.date.value, event_time: fields.time.value.trim(), producer: fields.producer.value.trim(),
      ticket_url: fields.ticket.value.trim(), description: fields.description.value.trim(), image_url: imageUrl,
      is_free: fields.free.checked, published: fields.published.checked, featured_rank: rank, updated_at: new Date().toISOString()
    };
    const originalSlug = fields.originalSlug.value;
    if (originalSlug) {
      const { error } = await theaterSupabase.from('events').update(record).eq('slug', originalSlug);
      if (error) throw error;
    } else {
      const { error } = await theaterSupabase.from('events').insert(record);
      if (error) throw error;
    }
    resetEventForm();
    showStatus(eventStatus, 'Programação salva. A home é atualizada automaticamente.', 'success');
    await loadEvents();
  } catch (error) { showStatus(eventStatus, error.message || 'Não foi possível salvar.', 'error'); }
});

document.querySelector('#clear-form').addEventListener('click', resetEventForm);
document.querySelector('#logout').addEventListener('click', async () => { await theaterSupabase.auth.signOut(); await updateAuth(); });
document.querySelector('#sign-up').addEventListener('click', async () => {
  const email = document.querySelector('#auth-email').value.trim().toLowerCase();
  const password = document.querySelector('#auth-password').value;
  if (email !== theaterAdminEmail && email !== additionalAdminEmail) { showStatus(authStatus, 'Este e-mail não possui autorização administrativa.', 'error'); return; }
  try {
    const { error } = await theaterSupabase.auth.signUp({ email, password });
    if (error) throw error;
    showStatus(authStatus, 'Conta criada. Confirme o e-mail recebido e depois entre no painel.', 'success');
  } catch (error) { showStatus(authStatus, error.message || 'Não foi possível criar o acesso.', 'error'); }
});

authForm.addEventListener('submit', async (submitEvent) => {
  submitEvent.preventDefault();
  try {
    const { error } = await theaterSupabase.auth.signInWithPassword({ email: document.querySelector('#auth-email').value.trim(), password: document.querySelector('#auth-password').value });
    if (error) throw error;
    await updateAuth();
  } catch (error) { showStatus(authStatus, error.message || 'Não foi possível entrar.', 'error'); }
});

async function updateAuth() {
  const { data: { user } } = await theaterSupabase.auth.getUser();
  const allowed = [theaterAdminEmail, additionalAdminEmail].includes(user?.email?.toLowerCase());
  authCard.classList.toggle('hidden', Boolean(allowed));
  app.classList.toggle('hidden', !allowed);
  if (allowed) {
    hideStatus(authStatus);
    try { await loadEvents(); } catch (error) { showStatus(eventStatus, error.message || 'Não foi possível carregar os eventos.', 'error'); }
  } else if (user) {
    await theaterSupabase.auth.signOut();
    showStatus(authStatus, 'Este e-mail não possui autorização administrativa.', 'error');
  }
}

updateAuth();

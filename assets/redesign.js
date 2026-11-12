(() => {
  const page = document.body.dataset.screen;
  const storage = {
    read(key, fallback) {
      try { return JSON.parse(localStorage.getItem('compass:' + key)) ?? fallback; }
      catch { return fallback; }
    },
    write(key, value) {
      try { localStorage.setItem('compass:' + key, JSON.stringify(value)); } catch {}
    }
  };
  const messages = {
    animo: 'Registramos cómo te sentís.',
    creada: 'Tarea creada.',
    hecha: 'Tarea marcada como hecha.',
    eliminada: 'Tu tarea ha sido eliminada correctamente.',
    proyecto: 'Tu proyecto ha sido eliminado correctamente.',
    decision: 'Registramos que fue tu decisión.',
    imprevisto: 'Imprevisto registrado.',
    editada: 'Cambios guardados.',
    fecha: 'Fecha actualizada. Usaste una reprogramación.'
  };
  const params = new URLSearchParams(location.search);
  const read = storage.read;
  const save = storage.write;
  const notify = message => {
    const main = document.querySelector('.screen-content');
    main.querySelector('.inline-feedback')?.remove();
    const el = document.createElement('div');
    el.className = 'inline-feedback';
    el.setAttribute('role', 'status');
    el.textContent = message;
    main.querySelector('h1').after(el);
    main.scrollTop = 0;
  };
  const go = (target, notice) => {
    location.href = target + '.html' + (notice ? '?aviso=' + notice : '');
  };
  const currentTask = params.get('tarea') || read('currentTask', 'Preparar la entrega de UX');
  const draft = read('draft', {});
  const project = read('projectEdit', {});
  const state = read('taskStates', {});
  const custom = read('customTasks', []);
  const details = read('taskDetails', {});
  const fields = form => [...form.querySelectorAll('.field input')];
  const checkIcon = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>';

  if (messages[params.get('aviso')]) notify(messages[params.get('aviso')]);

  function updateToday() {
    const rows = [...document.querySelectorAll('.task-list-item')];
    const completed = rows.filter(row => row.classList.contains('done')).length;
    const remaining = rows.filter(row => !row.classList.contains('done') && !row.classList.contains('missed')).length;
    document.querySelector('[data-pending]').textContent = remaining;
    document.querySelector('[data-progress-copy]').textContent = completed + ' de ' + rows.length + ' completadas';
    document.querySelector('[data-progress-bar]').style.width = (rows.length ? completed / rows.length * 100 : 0) + '%';
  }

  function makeTaskInteractive(link) {
    const heading = link.querySelector('strong');
    const title = heading.textContent;
    const shownTitle = details[title]?.title || title;
    heading.textContent = shownTitle;
    const meta = link.querySelector('p');
    if (meta && details[title]?.date) meta.textContent += ' · ' + details[title].date;
    if (state[title] === 'deleted') { link.remove(); return; }
    const row = document.createElement('div');
    row.className = 'task-list-item';
    link.replaceWith(row);
    row.append(link);
    link.querySelector('.task-check')?.remove();
    link.querySelector('.tag')?.remove();
    const control = document.createElement('button');
    control.className = 'task-check';
    control.type = 'button';
    row.prepend(control);
    link.href = 'tarea-detalle.html?tarea=' + encodeURIComponent(title);
    link.addEventListener('click', () => {
      save('currentTask', title);
      if (!state[title] && link.classList.contains('done')) {
        state[title] = 'done';
        save('taskStates', state);
      }
    });
    let complete = state[title] === 'done' || (!state[title] && link.classList.contains('done'));
    const missed = state[title] === 'imprevisto' || state[title] === 'decision';
    function paint() {
      row.classList.toggle('done', complete);
      row.classList.toggle('missed', missed);
      link.classList.toggle('done', complete);
      control.setAttribute('aria-label', (complete ? 'Desmarcar ' : 'Completar ') + shownTitle);
      control.setAttribute('aria-pressed', String(complete));
      control.innerHTML = complete ? checkIcon : '';
    }
    if (missed) {
      control.disabled = true;
      const badge = document.createElement('span');
      badge.className = 'tag warning';
      badge.textContent = state[title] === 'imprevisto' ? 'Imprevisto' : 'No cumplida';
      link.append(badge);
    }
    control.addEventListener('click', () => {
      complete = !complete;
      state[title] = complete ? 'done' : 'pending';
      save('taskStates', state);
      paint();
      updateToday();
    });
    paint();
  }

  if (page === 'hoy') {
    const existing = [...document.querySelectorAll('.task')];
    for (const task of custom) {
      const link = document.createElement('a');
      link.className = 'task';
      const content = document.createElement('div');
      const title = document.createElement('strong');
      const meta = document.createElement('p');
      title.textContent = task.title;
      meta.textContent = [task.project, task.date].filter(Boolean).join(' · ');
      content.append(title, meta);
      link.append(content);
      (existing[0] || document.querySelector('.section-title')).before(link);
    }
    document.querySelectorAll('.task').forEach(makeTaskInteractive);
    updateToday();
  }

  if (['tarea-detalle', 'tarea-no-cumplida', 'tarea-editar', 'reorganizar-manual'].includes(page)) {
    const detail = details[currentTask] || custom.find(task => task.title === currentTask);
    document.querySelectorAll('[data-task-title]').forEach(el => el.textContent = detail?.title || currentTask);
    for (const link of document.querySelectorAll('a[href="tarea-editar.html"],a[href="tarea-no-cumplida.html"],a[href="reorganizar-manual.html"]')) {
      link.href += '?tarea=' + encodeURIComponent(currentTask);
    }
    const dateRow = document.querySelector('a[href^="reorganizar-manual.html"] small');
    if (dateRow && detail?.date) dateRow.textContent = detail.date + ' · ' + (detail.reschedules || 0) + ' de 2 cambios usados';
    const notes = document.querySelector('[data-task-notes]');
    if (notes && detail?.notes) notes.textContent = detail.notes;
    const edit = document.querySelector('[data-task-form]');
    if (edit) {
      const [title, note] = fields(edit);
      title.value = detail?.title || currentTask;
      if (detail?.notes) note.value = detail.notes;
    }
    if (state[currentTask] === 'done') {
      const status = document.querySelector('.task-status');
      if (status) { status.textContent = 'Hecha'; status.classList.add('success'); }
      const button = document.querySelector('[data-complete]');
      if (button) button.textContent = 'Desmarcar tarea';
    }
  }

  document.querySelector('[data-complete]')?.addEventListener('click', () => {
    const wasDone = state[currentTask] === 'done';
    state[currentTask] = wasDone ? 'pending' : 'done';
    save('taskStates', state);
    go('hoy', wasDone ? null : 'hecha');
  });

  document.querySelector('[data-missed]')?.addEventListener('submit', event => {
    event.preventDefault();
    const reason = new FormData(event.currentTarget).get('reason');
    if (!reason) return;
    const week = new Date();
    week.setDate(week.getDate() - (week.getDay() + 6) % 7);
    const key = 'exceptions:' + week.toDateString();
    const used = read(key, 0);
    if (reason === 'imprevisto' && used >= 2) {
      notify('Ya usaste tus dos imprevistos de esta semana.');
      return;
    }
    if (reason === 'imprevisto') save(key, used + 1);
    state[currentTask] = reason;
    save('taskStates', state);
    go('hoy', reason);
  });

  const moodForm = document.querySelector('[data-mood]');
  if (moodForm) {
    const mood = read('mood', {});
    for (const option of moodForm.querySelectorAll('input')) option.checked = mood[option.name] === option.value;
    moodForm.addEventListener('submit', event => {
      event.preventDefault();
      save('mood', Object.fromEntries(new FormData(moodForm)));
      go('hoy', 'animo');
    });
  }
  document.querySelector('[data-review-task]')?.addEventListener('click', () => {
    const [title, date] = document.querySelectorAll('.field input');
    save('draft', {...draft, title: title?.value || '', date: date?.value || draft.date});
  });

  const taskForm = document.querySelector('[data-task-form]');
  if (taskForm) {
    const [title, notes] = fields(taskForm);
    title.required = true;
    if (page === 'tarea-crear') {
      title.value = draft.title || '';
      notes.value = draft.notes || '';
      const date = taskForm.querySelector('a[href="seleccionar-fecha.html"] small');
      const category = taskForm.querySelector('a[href="seleccionar-proyecto.html"] small');
      if (draft.date) date.textContent = draft.date;
      if (draft.project) category.textContent = draft.project;
      const remember = () => save('draft', {...draft, title: title.value, notes: notes.value});
      taskForm.addEventListener('input', remember);
      document.querySelectorAll('.entry-tabs a, [data-task-form] a').forEach(a => a.addEventListener('click', remember));
    }
    taskForm.addEventListener('submit', event => {
      event.preventDefault();
      const name = title.value.trim();
      if (!name) { title.focus(); return; }
      if (page === 'tarea-editar') {
        details[currentTask] = {...details[currentTask], title: name, notes: notes.value};
        save('taskDetails', details);
        go('hoy', 'editada');
        return;
      }
      if ([...custom.map(task => task.title), ...Object.keys(state), 'Preparar la entrega de UX', 'Revisar el prototipo con el grupo', 'Preparar la mochila', 'Leer el capítulo de Sistemas', 'Enviar la propuesta a Clara'].includes(name) && state[name] !== 'deleted') {
        notify('Ya hay una tarea con ese nombre.');
        return;
      }
      if (!draft.date) { notify('Elegí la fecha de cierre.'); return; }
      custom.push({title: name, notes: notes.value, date: draft.date, project: draft.project || 'Personal'});
      state[name] = 'pending';
      save('taskStates', state);
      save('customTasks', custom);
      save('draft', {});
      go('hoy', 'creada');
    });
  }

  const dateForm = document.querySelector('[data-date]');
  if (dateForm) {
    const input = fields(dateForm)[0];
    input.required = true;
    input.value = draft.date || '';
    dateForm.addEventListener('submit', event => {
      event.preventDefault();
      save('draft', {...draft, date: input.value});
      go('tarea-crear');
    });
  }
  document.querySelector('[data-project]')?.addEventListener('submit', event => {
    event.preventDefault();
    save('draft', {...draft, project: new FormData(event.currentTarget).get('project')});
    go('tarea-crear');
  });
  document.querySelector('[data-reschedule]')?.addEventListener('submit', event => {
    event.preventDefault();
    const input = fields(event.currentTarget)[0];
    const task = details[currentTask] || {};
    const used = task.reschedules || 0;
    if (!input.value || input.value === task.date) { notify('Elegí una fecha distinta.'); return; }
    if (used >= 2) { notify('Esta tarea ya usó sus dos reprogramaciones.'); return; }
    details[currentTask] = {...task, date: input.value, reschedules: used + 1};
    save('taskDetails', details);
    location.href = 'tarea-detalle.html?aviso=fecha&tarea=' + encodeURIComponent(currentTask);
  });

  const editProject = document.querySelector('[data-project-edit]');
  if (editProject) {
    const type = editProject.querySelector("#project-type");
    const group = editProject.querySelector('[data-group-field]');
    const inputs = fields(editProject);
    if (project.title) inputs[0].value = project.title;
    if (project.description) inputs[1].value = project.description;
    if (project.type) type.value = project.type;
    if (project.group) editProject.querySelector("#project-group").value = project.group;
    const sync = () => { group.hidden = type.value !== 'group'; };
    type.addEventListener('change', sync);
    sync();
    editProject.addEventListener('submit', event => {
      event.preventDefault();
      if (!inputs[0].value.trim()) { inputs[0].focus(); return; }
      save('projectEdit', {title: inputs[0].value, description: inputs[1].value, type: type.value, group: editProject.querySelector("#project-group").value});
      go('proyecto-detalle', 'editada');
    });
  }
  if (page === 'proyecto-detalle' && project.title) document.querySelector('.project-cover h2').textContent = project.title;
  if (page === 'proyectos' && read('projectDeleted', false)) document.querySelectorAll('a[href="proyecto-detalle.html"]').forEach(el => el.remove());

  const trash = document.querySelector('[data-delete]');
  if (trash) {
    const entity = trash.dataset.delete;
    const dialog = document.createElement('dialog');
    dialog.className = 'delete-dialog';
    dialog.setAttribute('aria-labelledby', 'delete-dialog-title');
    dialog.innerHTML = '<form method="dialog"><h2 id="delete-dialog-title">¿Estás seguro?</h2><button class="button danger" value="delete">Eliminar ' + entity + '</button><button class="button secondary" value="cancel" autofocus>Volver atrás</button></form>';
    document.querySelector('.phone').append(dialog);
    trash.addEventListener('click', () => { dialog.returnValue = ''; dialog.showModal(); });
    dialog.addEventListener('close', () => {
      if (dialog.returnValue !== 'delete') return;
      if (entity === 'tarea') {
        state[currentTask] = 'deleted';
        save('taskStates', state);
        save('customTasks', custom.filter(task => task.title !== currentTask));
        go('hoy', 'eliminada');
      } else {
        save('projectDeleted', true);
        go('proyectos', 'proyecto');
      }
    });
  }
})();

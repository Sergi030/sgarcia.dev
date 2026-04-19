import { onReady } from '../utils/onReady';

const termPages: { label: string; href: string; type: string }[] =
  JSON.parse(document.getElementById('term-data')?.textContent || '[]');

let cmdHistory: string[] = [];
let cmdPos = -1;

function setupTerminal() {
  const overlay = document.getElementById('terminal-overlay');
  const backdrop = document.getElementById('term-backdrop');
  const input = document.getElementById('term-input') as HTMLInputElement;
  const body = document.getElementById('term-body');
  const history = document.getElementById('term-history');
  const cursor = document.getElementById('term-cursor');
  const loginDate = document.getElementById('term-login-date');
  if (!overlay || !input || !body || !history || !cursor) return;

  if (loginDate) {
    loginDate.textContent = new Date().toLocaleString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  }

  function updateCursor() {
    const pos = input.selectionStart || input.value.length;
    cursor!.style.left = `${pos * 8.4}px`;
  }

  function open() {
    overlay!.classList.remove('hidden');
    input!.value = '';
    cmdPos = -1;
    updateCursor();
    requestAnimationFrame(() => input!.focus());
  }

  function close() {
    overlay!.classList.add('hidden');
  }

  function navigate(href: string) {
    close();
    if (href.startsWith('http') || href.startsWith('mailto:')) {
      window.open(href, '_blank');
    } else {
      window.location.href = href;
    }
  }

  function addOutput(html: string) {
    const div = document.createElement('div');
    div.innerHTML = html;
    history!.appendChild(div);
    body!.scrollTop = body!.scrollHeight;
  }

  function addPromptLine(text: string) {
    addOutput(`<div class="flex gap-0 opacity-60 mt-2"><span class="text-[var(--accent)]">mehcachis@barcelona</span><span class="text-[var(--text-muted)]">:</span><span class="text-[var(--accent-text)]">~</span><span class="text-[var(--text-muted)]">$&nbsp;</span><span class="text-[var(--text)]">${text}</span></div>`);
  }

  // ── Easter eggs ──

  function triggerSudo() {
    close();
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:monospace;color:#00ff41;font-size:14px;';
    document.body.appendChild(el);
    const lines = [
      '$ sudo su', '[sudo] password for mehcachis: ********', '',
      'root@barcelona:~# ACCESS GRANTED', '',
      '  ██████╗  ██████╗  ██████╗ ████████╗',
      '  ██╔══██╗██╔═══██╗██╔═══██╗╚══██╔══╝',
      '  ██████╔╝██║   ██║██║   ██║   ██║   ',
      '  ██╔══██╗██║   ██║██║   ██║   ██║   ',
      '  ██║  ██║╚██████╔╝╚██████╔╝   ██║   ',
      '  ╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ',
      '', 'Welcome, root. You have full access.', 'Just kidding — nice try though ;)',
    ];
    let i = 0;
    const iv = setInterval(() => {
      if (i < lines.length) {
        const l = document.createElement('div');
        l.textContent = lines[i]; l.style.whiteSpace = 'pre'; el.appendChild(l); i++;
      } else {
        clearInterval(iv);
        setTimeout(() => { el.style.transition = 'opacity 0.8s'; el.style.opacity = '0'; setTimeout(() => el.remove(), 800); }, 2500);
      }
    }, 150);
  }

  function triggerRmRf() {
    close();
    const els = Array.from(document.querySelectorAll('main > *, header, footer'));
    const bar = document.createElement('div');
    bar.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:9999;font-family:monospace;font-size:13px;color:#ff4444;background:var(--bg);border:1px solid #ff4444;padding:8px 16px;border-radius:6px;';
    document.body.appendChild(bar);
    let p = 0;
    const total = els.length;
    const iv = setInterval(() => {
      if (p < total) {
        const e = els[p] as HTMLElement;
        e.style.transition = 'opacity 0.3s, transform 0.3s'; e.style.opacity = '0'; e.style.transform = 'scale(0.95)';
        p++;
        const pct = Math.floor((p / total) * 100);
        bar.textContent = `rm -rf / ... ${pct}% [${'#'.repeat(Math.floor(pct / 5))}${'.'.repeat(20 - Math.floor(pct / 5))}]`;
      } else {
        clearInterval(iv);
        bar.textContent = 'rm -rf / ... done. just kidding!';
        bar.style.color = 'var(--accent)';
        bar.style.borderColor = 'var(--accent)';
        setTimeout(() => {
          els.forEach((e) => { (e as HTMLElement).style.transition = 'opacity 0.5s, transform 0.5s'; (e as HTMLElement).style.opacity = '1'; (e as HTMLElement).style.transform = 'scale(1)'; });
          setTimeout(() => bar.remove(), 1500);
        }, 1500);
      }
    }, 200);
  }

  // ── Command execution ──

  function exec(raw: string) {
    const cmd = raw.trim();
    if (!cmd) return;
    cmdHistory.push(cmd);
    cmdPos = -1;
    addPromptLine(cmd);

    const q = cmd.toLowerCase();

    // Easter eggs
    if (q === 'sudo' || q.startsWith('sudo su') || q.startsWith('sudo -i') || q.startsWith('sudo -s')) { triggerSudo(); return; }
    if (q.startsWith('sudo ')) { addOutput(`<div class="text-[var(--text-muted)] mt-1">nice try — running without privileges anyway</div>`); exec(cmd.slice(5)); return; }
    if (q === 'rm -rf /' || q === 'rm -rf' || q === 'rm -rf /*') { triggerRmRf(); return; }

    // help
    if (q === 'help' || q === '--help' || q === 'man') {
      addOutput(`<div class="text-[var(--text)] mt-1 space-y-0.5 text-xs">
        <div><span class="text-[var(--accent)]">cd &lt;page&gt;</span>    navigate to a page (home, blog, about, projects)</div>
        <div><span class="text-[var(--accent)]">ls</span>            list all pages</div>
        <div><span class="text-[var(--accent)]">open &lt;link&gt;</span>  open external link (github, linkedin, email)</div>
        <div><span class="text-[var(--accent)]">clear</span>         clear terminal</div>
        <div><span class="text-[var(--accent)]">exit</span>          close terminal</div>
      </div>`);
      return;
    }

    // clear
    if (q === 'clear') {
      const login = history!.querySelector('div');
      history!.innerHTML = '';
      if (login) history!.appendChild(login);
      return;
    }

    // exit
    if (q === 'exit' || q === 'quit' || q === ':q' || q === ':q!') { close(); return; }

    // ls
    if (q === 'ls' || q === 'ls -la' || q === 'ls -l' || q === 'll') {
      let html = '<div class="mt-1 space-y-0">';
      termPages.forEach((item) => {
        const icon = item.type === 'dir' ? '<span class="text-blue-400">d</span>rwxr-xr-x' : '<span class="text-orange-400">l</span>rwxr-xr-x';
        const cls = item.type === 'dir' ? 'text-blue-400' : 'text-orange-400';
        html += `<div class="flex gap-3 text-xs"><span class="text-[var(--text-muted)]">${icon}</span><span class="${cls}">${item.label}</span></div>`;
      });
      html += '</div>';
      addOutput(html);
      return;
    }

    // cd
    if (q.startsWith('cd ')) {
      const target = q.slice(3).replace(/^[.\/~]+/, '').trim();
      const page = termPages.find((p) => p.label.toLowerCase().includes(target) || p.href.includes(target));
      if (page) {
        addOutput(`<div class="text-[var(--text-muted)] mt-1">→ navigating to ${page.label}...</div>`);
        setTimeout(() => navigate(page.href), 400);
      } else {
        addOutput(`<div class="text-red-400 mt-1">bash: cd: ${target}: No such file or directory</div>`);
      }
      return;
    }

    // open
    if (q.startsWith('open ')) {
      const target = q.slice(5).trim();
      const link = termPages.find((p) => p.type === 'link' && (p.label.toLowerCase().includes(target) || p.href.includes(target)));
      if (link) {
        addOutput(`<div class="text-[var(--text-muted)] mt-1">→ opening ${link.label}...</div>`);
        setTimeout(() => navigate(link.href), 400);
      } else {
        addOutput(`<div class="text-red-400 mt-1">open: ${target}: not found</div>`);
      }
      return;
    }

    // Unknown
    addOutput(`<div class="text-red-400 mt-1">bash: ${cmd}: command not found. Type <span class="text-[var(--accent)]">help</span> for commands.</div>`);
  }

  // Tab autocomplete
  function autocomplete() {
    const val = input.value.toLowerCase().trim();
    if (!val) return;

    const isCd = val.startsWith('cd ');
    const isOpen = val.startsWith('open ');
    const prefix = (isCd ? val.slice(3) : isOpen ? val.slice(5) : val).replace(/^\.\//, '').trim();
    if (!prefix) return;

    const pool = isCd ? termPages.filter((p) => p.type === 'dir') :
                 isOpen ? termPages.filter((p) => p.type === 'link') :
                 termPages;

    const match = pool.find((p) => {
      const name = p.label.replace(/^\.\//, '').toLowerCase();
      return name.startsWith(prefix) || p.label.toLowerCase().includes(prefix) || p.href.toLowerCase().includes(prefix);
    });
    if (match) {
      const pre = isCd ? 'cd ' : isOpen ? 'open ' : '';
      input.value = pre + match.label;
      updateCursor();
    }
  }

  // ── Events ──

  // Bind document-level shortcut once; resolve overlay at fire time so
  // view-transition swaps don't leave us toggling a detached overlay.
  if (!(window as any).__termShortcutBound) {
    (window as any).__termShortcutBound = true;
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === '`' || e.code === 'Backquote' || e.code === 'IntlBackslash')) {
        e.preventDefault();
        const current = document.getElementById('terminal-overlay');
        const currentInput = document.getElementById('term-input') as HTMLInputElement | null;
        if (!current) return;
        if (current.classList.contains('hidden')) {
          current.classList.remove('hidden');
          (window as any).umami?.track('terminal-open');
          if (currentInput) {
            currentInput.value = '';
            requestAnimationFrame(() => currentInput.focus());
          }
        } else {
          current.classList.add('hidden');
        }
      }
    });
  }

  backdrop?.addEventListener('click', close);
  document.getElementById('term-close-btn')?.addEventListener('click', close);
  input.addEventListener('input', updateCursor);
  input.addEventListener('click', updateCursor);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { close(); }
    else if (e.key === 'Tab') {
      e.preventDefault();
      autocomplete();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      cmdPos = cmdPos <= 0 ? 0 : cmdPos - 1;
      input.value = cmdHistory[cmdPos] || '';
      updateCursor();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdHistory.length === 0 || cmdPos < 0) return;
      cmdPos++;
      input.value = cmdPos >= cmdHistory.length ? '' : (cmdHistory[cmdPos] || '');
      if (cmdPos >= cmdHistory.length) cmdPos = -1;
      updateCursor();
    } else if (e.key === 'Enter') {
      exec(input.value);
      input.value = '';
      updateCursor();
    }
  });

  body?.addEventListener('click', () => input.focus());
}

onReady(setupTerminal);

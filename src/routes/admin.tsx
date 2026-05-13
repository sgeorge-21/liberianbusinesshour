import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import dashboardHtml from "../pages-html/admin-sections/dashboard.html?raw";
import newsHtml from "../pages-html/admin-sections/news.html?raw";
import podcastHtml from "../pages-html/admin-sections/podcast.html?raw";
import videoHtml from "../pages-html/admin-sections/video.html?raw";
import manageHtml from "../pages-html/admin-sections/manage.html?raw";

const DEMO_USER = "admin";
const DEMO_PASS = "lbh2026";
const SESSION_KEY = "lbh_admin_session";
const USERS_KEY = "lbh_admin_users";

type User = { id: string; username: string; email: string; role: string; createdAt: string };
type Tab = "dashboard" | "news" | "podcast" | "video" | "manage" | "users";

const TABS: { id: Tab; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "news", label: "Add News / Story" },
  { id: "podcast", label: "Add Podcast" },
  { id: "video", label: "Add Video" },
  { id: "manage", label: "Manage Content" },
  { id: "users", label: "Users" },
];

const HTML_FOR: Record<Exclude<Tab, "users">, string> = {
  dashboard: dashboardHtml,
  news: newsHtml,
  podcast: podcastHtml,
  video: videoHtml,
  manage: manageHtml,
};

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — The Liberian Business Hour" }] }),
  component: AdminPage,
});

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAuthed(typeof window !== "undefined" && localStorage.getItem(SESSION_KEY) === "1");
    setReady(true);
  }, []);

  if (!ready) return null;
  return (
    <div className="page active">
      {authed
        ? <AdminPanel onSignOut={() => { localStorage.removeItem(SESSION_KEY); setAuthed(false); }} />
        : <AdminLogin onSuccess={() => { localStorage.setItem(SESSION_KEY, "1"); setAuthed(true); }} />}
    </div>
  );
}

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (user.trim() === DEMO_USER && pass === DEMO_PASS) { setErr(false); onSuccess(); }
    else setErr(true);
  };
  return (
    <div className="admin-login">
      <form className="admin-login-box" onSubmit={submit}>
        <div className="admin-logo"><strong>LBH</strong><span>Administrator Portal</span></div>
        <p>Access is restricted to authorized administrators only.</p>
        {err && <div className="login-error" style={{ display: "block" }}>Incorrect username or password. Please try again.</div>}
        <div className="form-group"><label>Username</label><input type="text" value={user} onChange={(e) => setUser(e.target.value)} placeholder="admin" autoFocus /></div>
        <div className="form-group"><label>Password</label><input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" /></div>
        <button type="submit" className="login-btn">Sign In</button>
        <p style={{ fontSize: "11.5px", color: "var(--text-light)", textAlign: "center", marginTop: "1rem" }}>
          Demo: username <strong>admin</strong> / password <strong>lbh2026</strong>
        </p>
      </form>
    </div>
  );
}

function AdminPanel({ onSignOut }: { onSignOut: () => void }) {
  const [tab, setTab] = useState<Tab>("dashboard");
  return (
    <div className="admin-panel" style={{ display: "block" }}>
      <div className="admin-nav">
        <div className="a-brand">LBH <span>Admin</span></div>
        <div className="admin-nav-links">
          {TABS.map((t) => (
            <a key={t.id} className={tab === t.id ? "active" : ""} onClick={() => setTab(t.id)} style={{ cursor: "pointer" }}>
              {t.label}
            </a>
          ))}
        </div>
        <button className="admin-logout" onClick={onSignOut}>Sign Out</button>
      </div>
      <div className="admin-body">
        <div className="admin-section active">
          {tab === "users"
            ? <UsersSection />
            : <div dangerouslySetInnerHTML={{ __html: HTML_FOR[tab] }} />}
        </div>
      </div>
    </div>
  );
}

function loadUsers(): User[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
}

function UsersSection() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Editor");
  const [toast, setToast] = useState("");

  useEffect(() => { setUsers(loadUsers()); }, []);

  const persist = (next: User[]) => {
    setUsers(next);
    localStorage.setItem(USERS_KEY, JSON.stringify(next));
  };

  const reset = () => { setEditingId(null); setUsername(""); setEmail(""); setRole("Editor"); };

  const save = (e: FormEvent) => {
    e.preventDefault();
    const u = username.trim(), m = email.trim();
    if (!u || !m) return;
    if (editingId) {
      persist(users.map(x => x.id === editingId ? { ...x, username: u, email: m, role } : x));
      setToast(`User "${u}" updated`);
    } else {
      persist([...users, { id: crypto.randomUUID(), username: u, email: m, role, createdAt: new Date().toISOString().slice(0, 10) }]);
      setToast(`User "${u}" added`);
    }
    reset();
    setTimeout(() => setToast(""), 2000);
  };

  const startEdit = (u: User) => {
    setEditingId(u.id); setUsername(u.username); setEmail(u.email); setRole(u.role);
  };
  const remove = (id: string) => { if (editingId === id) reset(); persist(users.filter(x => x.id !== id)); };

  return (
    <>
      <div className="admin-card">
        <div className="admin-card-header">{editingId ? "Edit User" : "Add New User"}</div>
        <div className="admin-card-body">
          <form onSubmit={save}>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Username *</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="jdoe" required />
              </div>
              <div className="admin-form-group">
                <label>Email *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" required />
              </div>
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Role *</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option>Editor</option><option>Author</option><option>Contributor</option><option>Admin</option>
                </select>
              </div>
            </div>
            <div className="admin-btn-row">
              {editingId && <button type="button" className="btn-cancel" onClick={reset}>Cancel</button>}
              <button type="submit" className="btn-publish">{editingId ? "Save Changes" : "Create User →"}</button>
              {toast && <span style={{ marginLeft: "1rem", color: "var(--green-mid)", fontSize: 13, alignSelf: "center" }}>✓ {toast}</span>}
            </div>
          </form>
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: "1.5rem" }}>
        <div className="admin-card-header">All Users <span className="badge">{users.length}</span></div>
        <div className="admin-card-body" style={{ padding: 0 }}>
          {users.length === 0 ? (
            <p style={{ padding: "1.5rem", color: "var(--text-light)", fontSize: 14 }}>No users yet. Add the first one above.</p>
          ) : (
            <table className="content-table">
              <thead><tr><th>Username</th><th>Email</th><th>Role</th><th>Created</th><th>Actions</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td><span className="status-badge status-published">{u.role}</span></td>
                    <td>{u.createdAt}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-edit" onClick={() => startEdit(u)}>Edit</button>
                        <button className="btn-delete" onClick={() => remove(u.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

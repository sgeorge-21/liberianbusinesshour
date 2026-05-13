import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";

const DEMO_USER = "admin";
const DEMO_PASS = "lbh2026";
const SESSION_KEY = "lbh_admin_session";
const USERS_KEY = "lbh_admin_users";

type User = { id: string; username: string; email: string; role: string; createdAt: string };
type Tab = "dashboard" | "users";

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
      {authed ? (
        <AdminPanel onSignOut={() => { localStorage.removeItem(SESSION_KEY); setAuthed(false); }} />
      ) : (
        <AdminLogin onSuccess={() => { localStorage.setItem(SESSION_KEY, "1"); setAuthed(true); }} />
      )}
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
        <div className="admin-logo">
          <strong>LBH</strong>
          <span>Administrator Portal</span>
        </div>
        <p>Access is restricted to authorized administrators only.</p>
        {err && <div className="login-error" style={{ display: "block" }}>Incorrect username or password. Please try again.</div>}
        <div className="form-group">
          <label>Username</label>
          <input type="text" value={user} onChange={(e) => setUser(e.target.value)} placeholder="admin" autoFocus />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" />
        </div>
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
          <a className={tab === "dashboard" ? "active" : ""} onClick={() => setTab("dashboard")} style={{ cursor: "pointer" }}>Dashboard</a>
          <a className={tab === "users" ? "active" : ""} onClick={() => setTab("users")} style={{ cursor: "pointer" }}>Users</a>
        </div>
        <button className="admin-logout" onClick={onSignOut}>Sign Out</button>
      </div>
      <div className="admin-body">
        {tab === "dashboard" ? <DashboardSection /> : <UsersSection />}
      </div>
    </div>
  );
}

function DashboardSection() {
  return (
    <div className="admin-section active">
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.6rem", marginBottom: "1.5rem" }}>
        Welcome back, Admin
      </h2>
      <div className="stats-grid">
        <div className="stat-box"><div className="s-label">Published Articles</div><div className="s-val">48</div><div className="s-sub">↑ 3 this week</div></div>
        <div className="stat-box"><div className="s-label">Podcast Episodes</div><div className="s-val">50+</div><div className="s-sub">Latest: EP 48</div></div>
        <div className="stat-box"><div className="s-label">Videos Published</div><div className="s-val">12</div><div className="s-sub">↑ 1 this week</div></div>
        <div className="stat-box"><div className="s-label">Newsletter Subscribers</div><div className="s-val">2.4K</div><div className="s-sub">↑ 120 this month</div></div>
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
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Editor");
  const [toast, setToast] = useState("");

  useEffect(() => { setUsers(loadUsers()); }, []);

  const persist = (next: User[]) => {
    setUsers(next);
    localStorage.setItem(USERS_KEY, JSON.stringify(next));
  };

  const addUser = (e: FormEvent) => {
    e.preventDefault();
    const u = username.trim();
    const m = email.trim();
    if (!u || !m) return;
    const next = [...users, { id: crypto.randomUUID(), username: u, email: m, role, createdAt: new Date().toISOString().slice(0, 10) }];
    persist(next);
    setUsername(""); setEmail(""); setRole("Editor");
    setToast(`User "${u}" added`);
    setTimeout(() => setToast(""), 2000);
  };

  const remove = (id: string) => persist(users.filter((x) => x.id !== id));

  return (
    <div className="admin-section active">
      <div className="admin-card">
        <div className="admin-card-header">Add New User</div>
        <div className="admin-card-body">
          <form onSubmit={addUser}>
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
                  <option>Editor</option>
                  <option>Author</option>
                  <option>Contributor</option>
                  <option>Admin</option>
                </select>
              </div>
            </div>
            <button type="submit" className="login-btn" style={{ marginTop: "1rem", width: "auto", padding: "0.7rem 1.5rem" }}>
              Create User
            </button>
            {toast && <span style={{ marginLeft: "1rem", color: "var(--green-mid)", fontSize: 13 }}>✓ {toast}</span>}
          </form>
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: "1.5rem" }}>
        <div className="admin-card-header">All Users <span className="badge">{users.length}</span></div>
        <div className="admin-card-body">
          {users.length === 0 ? (
            <p style={{ color: "var(--text-light)", fontSize: 14 }}>No users yet. Add the first one above.</p>
          ) : (
            <table className="content-table">
              <thead><tr><th>Username</th><th>Email</th><th>Role</th><th>Created</th><th></th></tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td><span className="status-badge status-published">{u.role}</span></td>
                    <td>{u.createdAt}</td>
                    <td><button onClick={() => remove(u.id)} style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", fontSize: 13 }}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

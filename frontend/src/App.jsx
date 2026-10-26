import { useState, useEffect } from "react";

/* ---------- tiny shadcn-style primitives ---------- */

const cx = (...c) => c.filter(Boolean).join(" ");

function Button({
  variant = "default",
  size = "default",
  className,
  ...props
}) {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-muted",
    ghost: "hover:bg-muted",
    destructive: "text-destructive hover:bg-destructive/10",
  };
  const sizes = { default: "h-9 px-4", sm: "h-8 px-3 text-xs", icon: "size-9" };
  return (
    <button
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

const Input = ({ className, ...props }) => (
  <input
    className={cx(
      "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none",
      "placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50",
      className,
    )}
    {...props}
  />
);

const Label = (props) => (
  <label className="text-sm font-medium leading-none" {...props} />
);

const Card = ({ className, ...props }) => (
  <div
    className={cx("rounded-xl border bg-card shadow-sm", className)}
    {...props}
  />
);
const CardHeader = ({ title, description, action }) => (
  <div className="flex items-start justify-between gap-4 p-6 pb-4">
    <div className="space-y-1">
      <h3 className="font-semibold leading-none">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
    {action}
  </div>
);

const Badge = ({ on }) => (
  <span
    className={cx(
      "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
      on
        ? "bg-primary text-primary-foreground border-transparent"
        : "text-muted-foreground",
    )}
  >
    {on ? "Active" : "Disabled"}
  </span>
);

/* ---------- theme ---------- */

function useTheme() {
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
    } catch {}
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
  }, [dark]);
  return [dark, () => setDark((d) => !d)];
}

const Sun = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
const Moon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

const ThemeToggle = ({ dark, toggle }) => (
  <Button
    variant="outline"
    size="icon"
    onClick={toggle}
    aria-label="Toggle theme"
  >
    {dark ? <Sun /> : <Moon />}
  </Button>
);

/* ---------- login ---------- */

function Login({ onLogin, dark, toggle }) {
  return (
    <main className="relative grid min-h-screen place-items-center px-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle dark={dark} toggle={toggle} />
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader
          title="Infini-Router"
          description="Sign in to manage your tokens."
        />
        <form
          className="space-y-4 p-6 pt-0"
          onSubmit={(e) => {
            e.preventDefault();
            onLogin();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <Button className="w-full" type="submit">
            Sign in
          </Button>
        </form>
      </Card>
    </main>
  );
}

/* ---------- dashboard ---------- */

const initialTokens = [
  {
    id: 1,
    name: "Cloudflare 1",
    value: "cf_a1b2••••••9xyz",
    requests: 128,
    enabled: true,
  },
  {
    id: 2,
    name: "Cloudflare 2",
    value: "cf_c3d4••••••8wvu",
    requests: 94,
    enabled: true,
  },
  {
    id: 3,
    name: "Cloudflare 3",
    value: "cf_e5f6••••••7tsr",
    requests: 41,
    enabled: false,
  },
];

const icons = {
  dashboard: <path d="M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z" />,
  tokens: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="m10.8 12.2 9.2-9.2M16 7l3 3M14 9l2 2" />
    </>
  ),
};

const NavIcon = ({ name }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {icons[name]}
  </svg>
);

const NAV = [
  { id: "dashboard", label: "Dashboard" },
  { id: "tokens", label: "Tokens" },
];

function Overview({ tokens }) {
  const total = tokens.reduce((s, t) => s + t.requests, 0);
  const active = tokens.filter((t) => t.enabled).length;
  return (
    <>
      <PageTitle
        title="Dashboard"
        text="See how your tokens are doing and send requests."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Tokens", tokens.length],
          ["Active", active],
          ["Total requests", total],
        ].map(([label, n]) => (
          <Card key={label} className="p-6">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">{n}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader
          title="Send a request"
          description="Your prompt will use the next active token."
        />
        <div className="space-y-3 p-6 pt-0">
          <textarea
            rows={4}
            placeholder="Ask the model something…"
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
          <Button>Send request</Button>
        </div>
      </Card>
    </>
  );
}

function Tokens({ tokens, setTokens }) {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  const add = (e) => {
    e.preventDefault();
    if (!name || !value) return;
    setTokens([
      ...tokens,
      {
        id: Date.now(),
        name,
        value: value.slice(0, 4) + "••••••" + value.slice(-4),
        requests: 0,
        enabled: true,
      },
    ]);
    setName("");
    setValue("");
  };

  return (
    <>
      <PageTitle
        title="Tokens"
        text="Add, disable or remove the API tokens you route requests through."
      />
      <Card>
        <CardHeader title="API tokens" />
        <div className="overflow-x-auto px-6">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr className="border-b">
                <th className="py-2 font-medium">Name</th>
                <th className="py-2 font-medium">Token</th>
                <th className="py-2 font-medium">Requests</th>
                <th className="py-2 font-medium">Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tokens.map((t) => (
                <tr key={t.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{t.name}</td>
                  <td className="py-3 font-mono text-xs text-muted-foreground">
                    {t.value}
                  </td>
                  <td className="py-3 tabular-nums">{t.requests}</td>
                  <td className="py-3">
                    <Badge on={t.enabled} />
                  </td>
                  <td className="whitespace-nowrap py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setTokens(
                          tokens.map((x) =>
                            x.id === t.id ? { ...x, enabled: !x.enabled } : x,
                          ),
                        )
                      }
                    >
                      {t.enabled ? "Disable" : "Enable"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setTokens(tokens.filter((x) => x.id !== t.id))
                      }
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <form onSubmit={add} className="flex flex-col gap-2 p-6 sm:flex-row">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="API token"
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button type="submit" className="shrink-0">
            Add token
          </Button>
        </form>
      </Card>
    </>
  );
}

const PageTitle = ({ title, text }) => (
  <div>
    <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
    <p className="text-sm text-muted-foreground">{text}</p>
  </div>
);

function Dashboard({ onLogout, dark, toggle }) {
  const [page, setPage] = useState("dashboard");
  const [tokens, setTokens] = useState(initialTokens);

  const navBtn = (item, extra = "") => (
    <button
      key={item.id}
      onClick={() => setPage(item.id)}
      aria-current={page === item.id ? "page" : undefined}
      className={cx(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        page === item.id
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        extra,
      )}
    >
      <NavIcon name={item.id} />
      {item.label}
    </button>
  );

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-60 shrink-0 flex-col border-r md:flex">
        <div className="flex h-14 items-center border-b px-4 font-semibold">
          Infini-Router
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((i) => navBtn(i, "w-full"))}
        </nav>
        <div className="flex items-center justify-between gap-2 border-t p-3">
          <Button variant="outline" size="sm" onClick={onLogout}>
            Sign out
          </Button>
          <ThemeToggle dark={dark} toggle={toggle} />
        </div>
      </aside>

      {/* Top bar (mobile) */}
      <header className="flex items-center justify-between gap-2 border-b p-3 md:hidden">
        <nav className="flex gap-1">{NAV.map((i) => navBtn(i))}</nav>
        <div className="flex gap-2">
          <ThemeToggle dark={dark} toggle={toggle} />
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={onLogout}
          >
            Sign out
          </Button>
        </div>
      </header>

      <main className="min-w-0 flex-1 space-y-6 p-6 md:p-8">
        {page === "dashboard" ? (
          <Overview tokens={tokens} />
        ) : (
          <Tokens tokens={tokens} setTokens={setTokens} />
        )}
      </main>
    </div>
  );
}

/* ---------- root ---------- */

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [dark, toggle] = useTheme();
  return authed ? (
    <Dashboard onLogout={() => setAuthed(false)} dark={dark} toggle={toggle} />
  ) : (
    <Login onLogin={() => setAuthed(true)} dark={dark} toggle={toggle} />
  );
}
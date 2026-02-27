import { useState, useEffect } from "react";

// ─── PARAMETERS ───────────────────────────────────────────────────────────────
const PARAMETERS = [
  { id:"competitive_landscape", label:"Competitive Landscape", short:"Competitive",
    question:"How would you qualify and define the competitive landscape within the account?",
    options:{ green:["No known NoSQL competitor(s) installed for any major use cases in the account"], amber:["Competitor(s) have captured some MongoDB use cases in the account, either by landing before us, or by taking parts of our footprint away","We are unaware of the full competitive landscape and/or the competitor(s) in the account","Application team(s) are interested in NoSQL, multicloud, and/or alternatives to concentrating their IT estate within a single cloud"], red:["Account has a known preference for competitor(s); they are installed for most or all major use cases and mission-critical workloads"] }},
  { id:"mongodb_maturity", label:"MongoDB Maturity", short:"MDB Maturity",
    question:"What is the account's MongoDB skillset level, maturity, and development & operational capability?",
    options:{ green:["Best in Class – Very Mature (5): MongoDB is the DB of choice; used for mission critical workloads, part of cloud adoption strategy and/or a strong CoE","Mature (4): Account has a new DBaaS and/or CoE, and is willing to engage us for advice to actively improve and evolve it"], amber:["Okay (3): No COE or identified experts, but willing to build one; actively engaged on enablement","Immature (2): MongoDB primarily used for non-critical applications or dev/test environments only"], red:["Fledgling (1): Customer has limited to no expertise in MongoDB and/or little interest in improving their skills"] }},
  { id:"value_realization", label:"Value Realization", short:"Value Real.",
    question:"How does the account view MongoDB as a potential accelerant of creating business and technical value?",
    options:{ green:["MongoDB is tied to top-line, committed company objectives; business value confirmed by the EB","We are viewed as offering transformative value across the enterprise at all levels"], amber:["Multiple BUs believe there is differentiated value in MongoDB's solution","MongoDB's perceived value is limited to a subset of teams or functions (e.g. only Engineering)"], red:["Account views MongoDB as a cost center and/or a point solution for niche use cases","We do not know if the customer sees business or technical value in our solution"] }},
  { id:"new_opportunity_scope", label:"New Opportunity Scope", short:"Opportunity",
    question:"In the past 90 days, have there been any new opportunities sourced in the account?",
    options:{ green:["Yes – Multiple new opportunities identified and actively progressing","Yes – At least one new opportunity identified, early-stage"], amber:["No – No new opportunities, but existing pipeline is stable"], red:["No – No new opportunities and limited or declining pipeline","Unsure / Too early to assess (e.g., opportunity discovery in progress)"] }},
  { id:"executive_alignment", label:"Executive Alignment", short:"Exec Align.",
    question:"What is the nature of our executive relationships within the account?",
    options:{ green:["We have identified Executive Sponsor(s) and regularly engage with them; Executives readily share objectives and strategic vision","Executives regularly engage with MongoDB executives and/or have recently attended a CAB","Executive Sponsor(s) champion internal enablement sessions and encourage participation"], amber:["We have okay relationships at the IC level, but have not yet developed a champion","We have periodic engagement with Executive Sponsor(s), but they are not aligned with our broader vision"], red:["We have not identified Executive Sponsor(s) at this account, or they have left the organization","Executives are unwilling to meet or engage with MongoDB Executives"] }},
  { id:"account_relationships", label:"Account Relationships", short:"Relationships",
    question:"How would you characterize the depth and quality of our relationships within the account?",
    options:{ green:["We are multithreaded with different personas; mutually agreed account strategy with buy-in from EB, champions, and key stakeholders","We are actively engaged with champion(s) who work to ensure MongoDB success and have provided access to additional LoB or exec sponsors","Champions, developers, and ICs actively engage and attend enablement sessions; they act on follow ups"], amber:["We are singlethreaded with operations, partner, or tactical contacts in the account","We have identified a potential champion but have not yet fully engaged with or tested them"], red:["We have low attendance and engagement from Developers and ICs; not accountable on next steps","We have not identified champion(s) in the account, or our champion(s) left the account"] }},
  { id:"account_profile", label:"Account Profile", short:"Acct Profile",
    question:"What is the overall health and profile of the company?",
    options:{ green:["Company is growing and has recently posted positive earnings, raised funding, or shown other signs of market traction"], amber:["Company is re-examining existing IT spend to reduce contracted spend and consolidate vendors","Company is at-risk due to macroeconomic factors and industry headwinds"], red:["Company has recently experienced layoffs","Company is a pending acquisition or potential target for M&A or takeover activity"] }},
  { id:"partner_engagement", label:"Partner Engagement", short:"Partners",
    question:"Can you describe our current knowledge of and level of engagement with Partners in the account?",
    options:{ green:["We are engaged with key SI / ISV / CSP Partners aligned on shared strategy, account objectives, and opportunities"], amber:["We have identified key SI / ISV / CSP partners, but have not yet engaged with them in a meaningful way","We have identified key SI / ISV / CSP partners, but we are not aligned on a unified account strategy","We do not know who the key SI / ISV / CSP partners are in the account"], red:["SI / ISV / CSP Partners or preferred vendors in the account do not have an existing relationship with MongoDB","SI / ISV / CSP Partners actively block MongoDB's ability to deepen our account footprint and relationships"] }},
  { id:"cost_sensitivity", label:"Cost Sensitivity", short:"Cost Sensi.",
    question:"How would you describe the account's sensitivity to MongoDB/Atlas costs and pricing?",
    options:{ green:["The account is willing to invest in MongoDB to support strategic initiatives; conversations focus on outcomes more than cost"], amber:["The company is re-examining IT/vendor spend; MongoDB is being reviewed as part of broader cost optimization, but no explicit threat yet","The account frequently raises costs and pushes for better pricing, but still sees differentiated value","We lack clear insight into the customer's internal budget constraints or expected target spend"], red:["The customer has explicitly stated that MongoDB/Atlas is too expensive and is actively exploring lower-cost alternatives","Renewal is contingent on significant discounts or restructuring that would materially reduce ARR"] }},
  { id:"technical_setup", label:"Technical Setup / Blockers", short:"Tech Setup",
    question:"What best describes the account's current technical setup on MongoDB and any blockers to stable operations and future growth?",
    options:{ green:["Customer's current architecture is well-designed and aligned with MongoDB best practices"], amber:["There are gaps that haven't yet caused major incidents but could slow future growth or migrations","We do not have a full picture of their deployment; there may be hidden risks in schema design, scaling strategy, or infra limits","The account occasionally experiences performance degradation or incident escalations, but core workloads remain generally stable"], red:["Mission-critical workloads are regularly impacted by serious issues and there is no agreed, realistic path to resolution","Customer questions MongoDB's technical fit or considers alternatives due to ongoing issues"] }},
  { id:"commercial_risk", label:"Commercial Risk", short:"Commercial",
    question:"What best describes the commercial risk around renewal, contract structure, and potential churn for this account?",
    options:{ green:["The account has an active contract with a clear renewal path; no RFP is expected and no major commercial issues have been raised"], amber:["The customer is on multi-year or over-sized baseline making down-sell likely at renewal","The customer is asking for unit price reductions or restructuring that would materially reduce ARR, but not yet considering vendor replacement"], red:["The customer has explicitly stated they may reduce or discontinue MongoDB usage at renewal without significant commercial concessions","Lack of executive sponsorship or unclear decision ownership around renewal"] }},
  { id:"support_usage", label:"Support Usage", short:"Support",
    question:"What best describes the account's recent support ticket activity? (Look at the past 90 days)",
    options:{ green:["Low volume, routine 'how-to' or informational tickets only (no escalations or severity concerns)"], amber:["High volume or recurring issues, but no formal escalations"], red:["High volume with recurring issues and/or escalations impacting usage","No support usage, low engagement"] }},
  { id:"rfp_procurement", label:"RFP / Procurement-Driven Uncertainty", short:"RFP / Proc.",
    question:"Is the account currently influenced by an active or upcoming RFP process?",
    options:{ green:["Active contract with clear renewal path (no RFP expected)"], amber:["Active contract; renewal expected but subject to formal procurement","Active contract; RFP expected at contract expiry"], red:["Risk of discontinuation or vendor replacement post-expiry"] }},
];

// ─── QUARTERS ─────────────────────────────────────────────────────────────────
const QUARTERS = [];
for (let fy = 27; fy <= 30; fy++)
  for (let q = 1; q <= 4; q++)
    QUARTERS.push(`Q${q} FY${fy}`);

function currentQuarter() {
  const m = new Date().getMonth() + 1, y = new Date().getFullYear();
  let q, fy;
  if (m >= 2 && m <= 4)       { q = 1; fy = y + 1; }
  else if (m >= 5 && m <= 7)  { q = 2; fy = y + 1; }
  else if (m >= 8 && m <= 10) { q = 3; fy = y + 1; }
  else                         { q = 4; fy = m === 1 ? y : y + 1; }
  const label = `Q${q} FY${String(fy).slice(-2)}`;
  return QUARTERS.includes(label) ? label : QUARTERS[0];
}

// ─── STATUS ───────────────────────────────────────────────────────────────────
function getStatus(ratings) {
  const vals = Object.entries(ratings).filter(([k]) => !k.includes("_opt")).map(([,v]) => v);
  const reds = vals.filter(v => v === "red").length;
  const ambers = vals.filter(v => v === "amber").length;
  const greens = vals.filter(v => v === "green").length;
  const tier = reds >= 3 ? "high" : reds >= 1 ? "mid" : "low";
  return { tier, reds, ambers, greens, total: vals.length };
}

// ─── STORAGE — shared=true so all users see same data ─────────────────────────
function safeKey(...parts) {
  return parts.map(p => String(p).replace(/[\s\/\\'"\.\-]/g, "_")).join("__");
}
async function sGet(key, shared = false) {
  try { const r = await window.storage.get(key, shared); return r ? JSON.parse(r.value) : null; }
  catch { return null; }
}
async function sSet(key, val, shared = false) {
  try { await window.storage.set(key, JSON.stringify(val), shared); }
  catch(e) { console.error("Storage write failed:", key, e); }
}

// ─── PASSWORDS ────────────────────────────────────────────────────────────────
const DEFAULT_ADMIN_PW   = "admin123";
const DEFAULT_MANAGER_PW = "manager123";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:"#F5F3EF", surface:"#FFFFFF", surfaceAlt:"#F0EDE6",
  border:"#E4DFD5", borderSub:"#EDE9E1",
  text:"#1C1916", textMid:"#6A655E", textLight:"#A09A92",
  accent:"#3558D4",
  green:  { bg:"#EDF5EE", border:"#BAD9BF", text:"#2A6036", dot:"#48A05E", heat:"#C8E6CB" },
  amber:  { bg:"#FBF4E7", border:"#DECA8C", text:"#6B4F10", dot:"#C49020", heat:"#FFE082" },
  red:    { bg:"#F5ECEA", border:"#D9AEAA", text:"#6B2A24", dot:"#B85550", heat:"#FFCDD2" },
  high:   { dot:"#B85550", bg:"#F5ECEA", border:"#D9AEAA" },
  mid:    { dot:"#C49020", bg:"#FBF4E7", border:"#DECA8C" },
  low:    { dot:"#48A05E", bg:"#EDF5EE", border:"#BAD9BF" },
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [mode, setMode]             = useState("home"); // home | csm | manager | admin
  const [csms, setCsms]             = useState([]);
  const [passwords, setPasswords]   = useState({ admin: DEFAULT_ADMIN_PW, manager: DEFAULT_MANAGER_PW });

  // auth states
  const [adminAuthed, setAdminAuthed]     = useState(false);
  const [managerAuthed, setManagerAuthed] = useState(false);
  const [loginTarget, setLoginTarget]     = useState(null); // "admin" | "manager"
  const [pwInput, setPwInput]             = useState("");
  const [pwError, setPwError]             = useState("");

  // CSM view state
  const [selectedCSM, setSelectedCSM]         = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState(currentQuarter());
  const [ratings, setRatings]                 = useState({});
  const [screen, setScreen]                   = useState("form");
  const [history, setHistory]                 = useState([]);
  const [expanded, setExpanded]               = useState(null);

  // Manager view state
  const [mgr_quarter, setMgrQuarter]   = useState(currentQuarter());
  const [mgr_filterCSM, setMgrFilterCSM] = useState("all");
  const [mgr_drill, setMgrDrill]       = useState(null); // { csm, account }
  const [mgr_drillHistory, setMgrDrillHistory] = useState([]);
  const [allData, setAllData]          = useState({}); // { "csm__account": latestEntry }

  // Admin state
  const [adminTab, setAdminTab]           = useState("csms");
  const [newCSMName, setNewCSMName]       = useState("");
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountCSM, setNewAccountCSM]   = useState("");
  const [newAdminPw, setNewAdminPw]       = useState("");
  const [newManagerPw, setNewManagerPw]   = useState("");

  const [loaded, setLoaded] = useState(false);
  const [toast, setToast]   = useState("");

  // 🔽 ADD DATABASE FETCH RIGHT HERE
useEffect(() => {
  fetchAllData();
}, []);

useEffect(() => {
  fetchAdminConfig();
}, []);

const fetchAdminConfig = async () => {
  try {
    const res = await fetch("/api/admin");
    const result = await res.json();

    if (result.success && result.data) {
      setCsms(result.data.csms || []);
      const dbPasswords = result.data.passwords || {};
      setPasswords({
        admin: dbPasswords.admin || DEFAULT_ADMIN_PW,
        manager: dbPasswords.manager || DEFAULT_MANAGER_PW,
      });
      console.log("Admin config loaded:", result.data);
    }
  } catch (err) {
    console.error("Failed to load admin config:", err);
  }
};

const saveAdminConfig = async (updatedCsms, updatedPasswords) => {
  try {
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        csms: updatedCsms,
        passwords: updatedPasswords,
      }),
    });

    const result = await res.json();
    if (!result.success) {
      throw new Error("Failed to save admin config");
    }

    console.log("Admin config saved to DB:", {
      csms: updatedCsms,
      passwords: updatedPasswords,
    });
  } catch (err) {
    console.error("Failed to save admin config:", err);
  }
};

const fetchAllData = async () => {
  try {
    const res = await fetch("/api/test");
    const result = await res.json();

    if (result.success && result.data) {
      const formatted = {};
      result.data.forEach((item) => {
        // Build key in the same format your app expects
        const key = `${item.csm}__${item.account}`;
      
        // Keep only the latest entry per CSM + Account
        if (
          !formatted[key] ||
          new Date(item.timestamp) > new Date(formatted[key].timestamp)
        ) {
          formatted[key] = item;
        }
      });

      setAllData(formatted);
      console.log("DB data loaded:", formatted);
    }
  } catch (err) {
    console.error("Failed to fetch DB data:", err);
  } finally {
    setLoaded(true);
  }
};

  // ── Boot ──
  useEffect(() => {
    (async () => {
      // CSM data is shared so all users see same accounts
      const data = await sGet("rp_csms_v5", true);
      if (data) setCsms(data);
      else {
        const def = [
          { name:"Alex Johnson", accounts:["Acme Corp","GlobalTech","NovaSystems"] },
          { name:"Priya Sharma", accounts:["DataFlow Inc","Pinnacle AI","Vertex Labs"] },
        ];
        setCsms(def); await sSet("rp_csms_v5", def, true);
      }
      const pw = await sGet("rp_passwords", true);
      if (pw) setPasswords(pw);
      setLoaded(true);
    })();
  }, []);

  // ── Load all account data for manager view ──
  async function loadAllData(quarter) {
    const result = {};
    for (const csm of csms) {
      for (const account of csm.accounts) {
        const key = safeKey("rp_hist", csm.name, account);
        const hist = await sGet(key, true);
        if (hist && hist.length > 0) {
          const entry = hist.find(h => h.quarter === quarter) || null;
          if (entry) result[`${csm.name}__${account}`] = { ...entry, csm: csm.name, account };
        }
      }
    }
    setAllData(result);
  }

  useEffect(() => {
    if (managerAuthed && csms.length > 0) loadAllData(mgr_quarter);
  }, [managerAuthed, mgr_quarter, csms]);

  const notify = msg => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const currentCSM = csms.find(c => c.name === selectedCSM);
  const accounts = currentCSM?.accounts || [];
  const ratingVals = Object.entries(ratings).filter(([k]) => !k.includes("_opt"));
  const progress = Math.round((ratingVals.length / PARAMETERS.length) * 100);
  const cleanRatings = () => Object.fromEntries(Object.entries(ratings).filter(([k]) => !k.includes("_opt")));

  // ── Login handler ──
  function handleLogin() {
    const correct = loginTarget === "admin" ? passwords.admin : passwords.manager;
    if (pwInput === correct) {
      if (loginTarget === "admin") setAdminAuthed(true);
      else setManagerAuthed(true);
      setMode(loginTarget);
      setPwInput(""); setPwError(""); setLoginTarget(null);
    } else {
      setPwError("Incorrect password. Please try again.");
    }
  }

  function openLogin(target) {
    if (target === "manager" && managerAuthed) { setMode("manager"); return; }
    if (target === "admin" && adminAuthed) { setMode("admin"); return; }
    setLoginTarget(target); setMode("login"); setPwInput(""); setPwError("");
  }

  // ── CSM handlers ──
  function handleCSMSelect(name) {
    setSelectedCSM(name); setSelectedAccount(""); setRatings({});
    setScreen("form"); setHistory([]); setExpanded(null);
  }
  function handleAccountSelect(acc) {
    setSelectedAccount(acc); setRatings({});
    setScreen("form"); setHistory([]); setExpanded(null);
  }
  async function handleSubmit() {
    const clean = cleanRatings();
    if (Object.keys(clean).length < PARAMETERS.length) {
      notify("Please rate all 13 parameters.");
      return;
    }
  
    const sc = getStatus(clean);
  
    const entry = {
      csm: selectedCSM,
      account: selectedAccount,
      quarter: selectedQuarter,
      ratings: clean,
      status: sc,
      timestamp: new Date().toISOString(),
    };
  
    try {
      // 🔥 NEW: Send data to MongoDB via API
      const res = await fetch("/api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entry),
      });
  
      const result = await res.json();
  
      if (!result.success) {
        throw new Error("Database save failed");
      }
  
      // (Keep your existing storage logic as backup)
      const key = safeKey("rp_hist", selectedCSM, selectedAccount);
      const prev = (await sGet(key, true)) || [];
      const updated = [entry, ...prev.filter(h => h.quarter !== selectedQuarter)]
        .sort((a,b) => QUARTERS.indexOf(b.quarter) - QUARTERS.indexOf(a.quarter));
  
      await sSet(key, updated, true);
  
      setHistory(updated);
      await fetchAllData(); // 🔥 Add this line
      setScreen("results");
      notify("Risk profile saved to database 🚀");
  
    } catch (error) {
      console.error("Submit error:", error);
      notify("Failed to save to database.");
    }
  }
  async function handleViewHistory() {
    const key = safeKey("rp_hist", selectedCSM, selectedAccount);
    const h = (await sGet(key, true)) || [];
    setHistory(h); setScreen("history");
  }

  // ── Manager drill-down ──
  async function openDrill(csm, account) {
    const key = safeKey("rp_hist", csm, account);
    const h = (await sGet(key, true)) || [];
    setMgrDrillHistory(h);
    setMgrDrill({ csm, account });
  }

  // ── Admin handlers ──
  async function saveCsms(updated) {
    setCsms(updated);
  
    // Keep local backup (optional but safe)
    await sSet("rp_csms_v5", updated, true);
  
    // 🔥 CRITICAL: Persist to MongoDB Admin Config
    await saveAdminConfig(updated, passwords);
  }
  async function addCSM() {
    const name = newCSMName.trim();
    if (!name || csms.find(c => c.name === name)) { notify("Invalid or duplicate name."); return; }
    await saveCsms([...csms, { name, accounts:[] }]); setNewCSMName(""); notify("CSM added.");
  }
  async function removeCSM(name) {
    await saveCsms(csms.filter(c => c.name !== name));
    if (selectedCSM === name) { setSelectedCSM(""); setSelectedAccount(""); }
    notify("Removed.");
  }
  async function addAccount() {
    const account = newAccountName.trim();
  
    if (!account || !newAccountCSM) {
      notify("Fill in both fields.");
      return;
    }
  
    const updated = csms.map(c => {
      if (c.name !== newAccountCSM) return c;
  
      // Prevent duplicate accounts
      if (c.accounts.includes(account)) {
        notify("Account already exists for this CSM.");
        return c;
      }
  
      return {
        ...c,
        accounts: [...c.accounts, account],
      };
    });
  
    await saveCsms(updated);
    setNewAccountName("");
    notify("Account added.");
  }
  async function removeAccount(csmName, accName) {
    await saveCsms(csms.map(c => c.name === csmName ? { ...c, accounts:c.accounts.filter(a => a !== accName) } : c));
    if (selectedAccount === accName) setSelectedAccount(""); notify("Removed.");
  }
  async function updatePasswords(updates) {
    const updated = {
      admin: updates.admin?.trim() || passwords.admin,
      manager: updates.manager?.trim() || passwords.manager,
    };
  
    setPasswords(updated);
    await sSet("rp_passwords", updated, true); // optional backup
    await saveAdminConfig(csms, updated); // persist to DB
    notify("Password updated and saved securely.");
  }

  if (!loaded) return <Loader />;

  // ── Rows for manager table ──
  const visibleCSMs = csms.filter(c => mgr_filterCSM === "all" || c.name === mgr_filterCSM);
  const tableRows = visibleCSMs.flatMap(c =>
    c.accounts.map(a => ({ csm: c.name, account: a, entry: allData[`${c.name}__${a}`] || null }))
  ).sort((a,b) => {
    // Sort: flagged first, then watch, then healthy, then no data
    const tier = e => !e ? 3 : e.status?.tier === "high" ? 0 : e.status?.tier === "mid" ? 1 : 2;
    return tier(a.entry) - tier(b.entry);
  });

  const totalAccounts = tableRows.length;
  const submitted = tableRows.filter(r => r.entry).length;
  const flagged = tableRows.filter(r => r.entry?.status?.reds >= 3).length;
  const watching = tableRows.filter(r => r.entry && r.entry.status?.reds >= 1 && r.entry.status?.reds < 3).length;

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans',system-ui,sans-serif", color:C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Lora:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:4px;}
        .pill{cursor:pointer;padding:7px 18px;border-radius:100px;font-size:12.5px;font-weight:500;border:1px solid transparent;transition:all .15s;background:transparent;color:${C.textMid};font-family:'DM Sans',sans-serif;}
        .pill:hover{background:${C.surfaceAlt};color:${C.text};}
        .pill.on{background:${C.text};color:#fff;}
        select,input[type=text],input[type=password]{background:${C.surface};border:1px solid ${C.border};color:${C.text};padding:10px 14px;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:13px;width:100%;outline:none;transition:border .15s;}
        select{appearance:none;cursor:pointer;}
        select:focus,input:focus{border-color:${C.accent};box-shadow:0 0 0 3px rgba(53,88,212,.08);}
        select:disabled{opacity:.4;cursor:not-allowed;}
        .btn{cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;border-radius:10px;transition:all .15s;padding:10px 22px;border:none;}
        .btn-dark{background:${C.text};color:#fff;}
        .btn-dark:hover{background:#2a2520;box-shadow:0 4px 14px rgba(0,0,0,.15);transform:translateY(-1px);}
        .btn-outline{background:transparent;color:${C.textMid};border:1px solid ${C.border};}
        .btn-outline:hover{color:${C.text};border-color:#9E9890;background:${C.surfaceAlt};}
        .btn-del{cursor:pointer;background:transparent;color:${C.red.text};border:1px solid ${C.red.border};padding:6px 14px;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:12px;transition:all .15s;}
        .btn-del:hover{background:${C.red.bg};}
        .opt{cursor:pointer;border-radius:10px;padding:11px 14px;font-family:'DM Sans',sans-serif;font-size:12.5px;text-align:left;width:100%;transition:all .15s;border:1.5px solid ${C.border};background:${C.surface};color:${C.textMid};line-height:1.55;}
        .opt:hover{border-color:#B5AFA5;color:${C.text};background:${C.surfaceAlt};}
        .opt.sel-green{background:${C.green.bg};border-color:${C.green.border};color:${C.green.text};}
        .opt.sel-amber{background:${C.amber.bg};border-color:${C.amber.border};color:${C.amber.text};}
        .opt.sel-red{background:${C.red.bg};border-color:${C.red.border};color:${C.red.text};}
        .prow{background:${C.surface};border:1px solid ${C.borderSub};border-radius:14px;overflow:hidden;margin-bottom:8px;transition:box-shadow .15s;}
        .prow:hover{box-shadow:0 2px 14px rgba(0,0,0,.06);}
        .phd{display:flex;align-items:center;justify-content:space-between;padding:15px 20px;cursor:pointer;user-select:none;}
        .chip{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:500;letter-spacing:.02em;}
        .srow{display:flex;align-items:center;justify-content:space-between;padding:11px 20px;}
        .srow+.srow{border-top:1px solid ${C.borderSub};}
        .toast{position:fixed;bottom:28px;right:28px;background:${C.text};color:#fff;padding:11px 20px;border-radius:10px;font-size:13px;font-weight:500;z-index:9999;animation:tin .2s ease;box-shadow:0 8px 24px rgba(0,0,0,.22);}
        @keyframes tin{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
        .flag-card{background:${C.red.bg};border:1px solid ${C.red.border};border-radius:12px;padding:16px 20px;margin-bottom:18px;}
        .flag-item{display:flex;align-items:flex-start;gap:10px;padding:8px 0;}
        .flag-item+.flag-item{border-top:1px solid ${C.red.border};}
        .tbl-row{display:grid;align-items:center;padding:12px 20px;border-top:1px solid ${C.borderSub};transition:background .12s;cursor:pointer;}
        .tbl-row:hover{background:${C.surfaceAlt};}
        .stat-card{background:${C.surface};border:1px solid ${C.border};border-radius:14px;padding:20px 24px;flex:1;}
        .home-card{background:${C.surface};border:1px solid ${C.border};border-radius:16px;padding:32px;cursor:pointer;transition:all .2s;flex:1;}
        .home-card:hover{box-shadow:0 8px 28px rgba(0,0,0,.1);transform:translateY(-2px);}
      `}</style>

      {toast && <div className="toast">{toast}</div>}

      {/* ── HEADER ── */}
      <header style={{ background:C.surface,borderBottom:`1px solid ${C.border}`,height:58,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 28px",position:"sticky",top:0,zIndex:100 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,cursor:"pointer" }} onClick={()=>setMode("home")}>
          <div style={{ width:30,height:30,borderRadius:9,background:C.text,display:"flex",alignItems:"center",justifyContent:"center" }}>
            <span style={{ color:"#fff",fontSize:14,fontFamily:"'Lora',serif",fontWeight:600 }}>R</span>
          </div>
          <span style={{ fontFamily:"'Lora',serif",fontWeight:600,fontSize:16.5,color:C.text,letterSpacing:"-.01em" }}>RiskPulse</span>
          <span style={{ color:C.border,fontSize:18,margin:"0 2px" }}>·</span>
          <span style={{ fontSize:12,color:C.textLight }}>Account Health Dashboard</span>
        </div>
        <div style={{ display:"flex",gap:4 }}>
          <button className={`pill ${mode==="csm"?"on":""}`} onClick={()=>setMode("csm")}>CSM</button>
          <button className={`pill ${mode==="manager"?"on":""}`} onClick={()=>openLogin("manager")}>Manager</button>
          <button className={`pill ${mode==="admin"?"on":""}`} onClick={()=>openLogin("admin")}>Admin</button>
        </div>
      </header>

      <main style={{ maxWidth:980,margin:"0 auto",padding:"36px 24px 80px" }}>

        {/* ══════════ HOME ══════════ */}
        {mode==="home" && (
          <div>
            <div style={{ marginBottom:36 }}>
              <h1 style={{ fontFamily:"'Lora',serif",fontWeight:600,fontSize:28,color:C.text,marginBottom:8 }}>Welcome to RiskPulse</h1>
              <p style={{ fontSize:14,color:C.textMid,maxWidth:520 }}>Track account health across your portfolio. CSMs update risk profiles quarterly. Managers get a live overview.</p>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16 }}>
              <div className="home-card" onClick={()=>setMode("csm")}>
                <div style={{ fontSize:28,marginBottom:16 }}>📋</div>
                <div style={{ fontFamily:"'Lora',serif",fontWeight:600,fontSize:17,color:C.text,marginBottom:6 }}>CSM View</div>
                <div style={{ fontSize:13,color:C.textMid,lineHeight:1.6 }}>Fill in or update risk profiles for your assigned accounts each quarter.</div>
              </div>
              <div className="home-card" onClick={()=>openLogin("manager")}>
                <div style={{ fontSize:28,marginBottom:16 }}>📊</div>
                <div style={{ fontFamily:"'Lora',serif",fontWeight:600,fontSize:17,color:C.text,marginBottom:6 }}>Manager View</div>
                <div style={{ fontSize:13,color:C.textMid,lineHeight:1.6 }}>See all accounts across the team, critical flags, and heatmaps in one place.</div>
                <div style={{ marginTop:12 }}><span className="chip" style={{ background:C.surfaceAlt,color:C.textLight,border:`1px solid ${C.border}` }}>🔒 Password protected</span></div>
              </div>
              <div className="home-card" onClick={()=>openLogin("admin")}>
                <div style={{ fontSize:28,marginBottom:16 }}>⚙️</div>
                <div style={{ fontFamily:"'Lora',serif",fontWeight:600,fontSize:17,color:C.text,marginBottom:6 }}>Admin</div>
                <div style={{ fontSize:13,color:C.textMid,lineHeight:1.6 }}>Manage CSMs, accounts, and access credentials.</div>
                <div style={{ marginTop:12 }}><span className="chip" style={{ background:C.surfaceAlt,color:C.textLight,border:`1px solid ${C.border}` }}>🔒 Password protected</span></div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ LOGIN ══════════ */}
        {mode==="login" && (
          <div style={{ maxWidth:380,margin:"80px auto 0" }}>
            <div style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:36 }}>
              <div style={{ marginBottom:24,textAlign:"center" }}>
                <div style={{ width:44,height:44,borderRadius:12,background:C.text,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px" }}>
                  <span style={{ color:"#fff",fontSize:18 }}>🔒</span>
                </div>
                <div style={{ fontFamily:"'Lora',serif",fontWeight:600,fontSize:18,color:C.text,marginBottom:6 }}>
                  {loginTarget==="manager" ? "Manager Access" : "Admin Access"}
                </div>
                <div style={{ fontSize:13,color:C.textLight }}>Enter your password to continue</div>
              </div>
              <div style={{ marginBottom:12 }}>
                <input type="password" placeholder="Password" value={pwInput}
                  onChange={e=>{ setPwInput(e.target.value); setPwError(""); }}
                  onKeyDown={e=>e.key==="Enter"&&handleLogin()} autoFocus />
              </div>
              {pwError && <div style={{ fontSize:12,color:C.red.text,marginBottom:10 }}>{pwError}</div>}
              <button className="btn btn-dark" style={{ width:"100%" }} onClick={handleLogin}>Continue →</button>
              <button className="btn btn-outline" style={{ width:"100%",marginTop:8 }} onClick={()=>setMode("home")}>← Back</button>
            </div>
          </div>
        )}

        {/* ══════════ CSM VIEW ══════════ */}
        {mode==="csm" && (
          <CSMView
            csms={csms} selectedCSM={selectedCSM} selectedAccount={selectedAccount}
            selectedQuarter={selectedQuarter} ratings={ratings} screen={screen}
            history={history} expanded={expanded} progress={progress} ratingVals={ratingVals}
            setSelectedCSM={handleCSMSelect} setSelectedAccount={handleAccountSelect}
            setSelectedQuarter={setSelectedQuarter} setRatings={setRatings}
            setScreen={setScreen} setExpanded={setExpanded}
            onSubmit={handleSubmit} onViewHistory={handleViewHistory}
            cleanRatings={cleanRatings}
          />
        )}

        {/* ══════════ MANAGER VIEW ══════════ */}
        {mode==="manager" && managerAuthed && (
          <ManagerView
            csms={csms} tableRows={tableRows} allData={allData}
            mgr_quarter={mgr_quarter} setMgrQuarter={setMgrQuarter}
            mgr_filterCSM={mgr_filterCSM} setMgrFilterCSM={setMgrFilterCSM}
            mgr_drill={mgr_drill} setMgrDrill={setMgrDrill}
            mgr_drillHistory={mgr_drillHistory} openDrill={openDrill}
            totalAccounts={totalAccounts} submitted={submitted} flagged={flagged} watching={watching}
            onLock={()=>{ setManagerAuthed(false); setMode("home"); }}
          />
        )}

        {/* ══════════ ADMIN VIEW ══════════ */}
        {mode==="admin" && adminAuthed && (
          <AdminView
            csms={csms} adminTab={adminTab} setAdminTab={setAdminTab}
            newCSMName={newCSMName} setNewCSMName={setNewCSMName}
            newAccountName={newAccountName} setNewAccountName={setNewAccountName}
            newAccountCSM={newAccountCSM} setNewAccountCSM={setNewAccountCSM}
            newAdminPw={newAdminPw} setNewAdminPw={setNewAdminPw}
            newManagerPw={newManagerPw} setNewManagerPw={setNewManagerPw}
            addCSM={addCSM} removeCSM={removeCSM} addAccount={addAccount} removeAccount={removeAccount}
            updatePasswords={updatePasswords}
            onLock={()=>{ setAdminAuthed(false); setMode("home"); }}
          />
        )}
      </main>
    </div>
  );
}

// ─── MANAGER VIEW ─────────────────────────────────────────────────────────────
function ManagerView({ csms, tableRows, allData, mgr_quarter, setMgrQuarter, mgr_filterCSM, setMgrFilterCSM,
  mgr_drill, setMgrDrill, mgr_drillHistory, openDrill, totalAccounts, submitted, flagged, watching, onLock }) {

  if (mgr_drill) {
    return (
      <ManagerDrill
        csm={mgr_drill.csm} account={mgr_drill.account}
        history={mgr_drillHistory}
        onBack={()=>setMgrDrill(null)}
      />
    );
  }

  const COL = "200px 120px 80px 80px 80px 1fr";

  return (<>
    <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:28,gap:12 }}>
      <div>
        <h1 style={{ fontFamily:"'Lora',serif",fontWeight:600,fontSize:24,color:C.text,marginBottom:4 }}>Manager Overview</h1>
        <p style={{ fontSize:13,color:C.textLight }}>Read-only view of all account risk profiles across the team.</p>
      </div>
      <button className="btn btn-outline" style={{ fontSize:12,marginTop:4 }} onClick={onLock}>Lock & Exit</button>
    </div>

    {/* Summary stats */}
    <div style={{ display:"flex",gap:14,marginBottom:28,flexWrap:"wrap" }}>
      {[
        { label:"Total Accounts", value:totalAccounts, sub:"in portfolio" },
        { label:"Submitted", value:submitted, sub:`of ${totalAccounts} this quarter`, color:C.accent },
        { label:"Critical Flags", value:flagged, sub:"3+ red parameters", color:C.red.text },
        { label:"Watching", value:watching, sub:"1–2 red parameters", color:C.amber.text },
      ].map(s=>(
        <div key={s.label} className="stat-card">
          <div style={{ fontSize:11,fontWeight:600,color:C.textLight,textTransform:"uppercase",letterSpacing:".08em",marginBottom:6 }}>{s.label}</div>
          <div style={{ fontFamily:"'Lora',serif",fontWeight:600,fontSize:28,color:s.color||C.text,lineHeight:1 }}>{s.value}</div>
          <div style={{ fontSize:11,color:C.textLight,marginTop:4 }}>{s.sub}</div>
        </div>
      ))}
    </div>

    {/* Filters */}
    <div style={{ display:"flex",gap:12,marginBottom:20,alignItems:"center" }}>
      <div style={{ position:"relative",width:160 }}>
        <select value={mgr_quarter} onChange={e=>setMgrQuarter(e.target.value)}>
          {QUARTERS.map(q=><option key={q} value={q}>{q}{q===currentQuarter()?" ·":"" }</option>)}
        </select>
        <span style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:C.textLight,pointerEvents:"none",fontSize:11 }}>▾</span>
      </div>
      <div style={{ position:"relative",width:200 }}>
        <select value={mgr_filterCSM} onChange={e=>setMgrFilterCSM(e.target.value)}>
          <option value="all">All CSMs</option>
          {csms.map(c=><option key={c.name} value={c.name}>{c.name}</option>)}
        </select>
        <span style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:C.textLight,pointerEvents:"none",fontSize:11 }}>▾</span>
      </div>
      <span style={{ fontSize:12,color:C.textLight,marginLeft:4 }}>{tableRows.length} accounts</span>
    </div>

    {/* Table */}
    <div style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden" }}>
      {/* Header */}
      <div style={{ display:"grid",gridTemplateColumns:COL,padding:"10px 20px",background:C.surfaceAlt,borderBottom:`1px solid ${C.border}` }}>
        {["Account","CSM","Flags","Watch","Healthy","Heatmap"].map(h=>(
          <div key={h} style={{ fontSize:10.5,fontWeight:600,color:C.textLight,textTransform:"uppercase",letterSpacing:".08em" }}>{h}</div>
        ))}
      </div>

      {tableRows.length===0 && (
        <div style={{ padding:48,textAlign:"center",color:C.textLight,fontSize:13 }}>No accounts found.</div>
      )}

      {tableRows.map(({ csm, account, entry }) => {
        const st = entry?.status;
        const hasCritical = st?.reds >= 3;
        const hasWatch = st?.reds >= 1 && st?.reds < 3;
        return (
          <div key={`${csm}__${account}`} className="tbl-row"
            style={{ gridTemplateColumns:COL }}
            onClick={()=>openDrill(csm, account)}>
            <div>
              <div style={{ fontSize:13,fontWeight:500,color:C.text }}>{account}</div>
              {hasCritical && <div style={{ fontSize:10,color:C.red.text,marginTop:2,fontWeight:600,letterSpacing:".04em" }}>● CRITICAL FLAGS</div>}
            </div>
            <div style={{ fontSize:12,color:C.textMid }}>{csm}</div>
            <div>
              {entry ? <span style={{ fontSize:13,fontWeight:600,color:st.reds>0?C.red.text:C.textLight }}>{st.reds}</span>
                : <span style={{ fontSize:11,color:C.textLight }}>—</span>}
            </div>
            <div>
              {entry ? <span style={{ fontSize:13,fontWeight:500,color:st.ambers>0?C.amber.text:C.textLight }}>{st.ambers}</span>
                : <span style={{ fontSize:11,color:C.textLight }}>—</span>}
            </div>
            <div>
              {entry ? <span style={{ fontSize:13,color:C.green.text }}>{st.greens}</span>
                : <span style={{ fontSize:11,color:C.textLight }}>—</span>}
            </div>
            <div style={{ display:"flex",gap:3,alignItems:"center",flexWrap:"wrap" }}>
              {entry
                ? PARAMETERS.map(p=>{
                    const r=entry.ratings[p.id];
                    return <div key={p.id} title={p.label} style={{ width:14,height:14,borderRadius:3,background:r?C[r].heat:C.surfaceAlt,flexShrink:0 }} />;
                  })
                : <span style={{ fontSize:11,color:C.textLight,fontStyle:"italic" }}>Not submitted</span>
              }
            </div>
          </div>
        );
      })}
    </div>

    <div style={{ fontSize:11,color:C.textLight,marginTop:12,textAlign:"right" }}>Click any row to drill into account history</div>
  </>);
}

// ─── MANAGER DRILL-DOWN ───────────────────────────────────────────────────────
function ManagerDrill({ csm, account, history, onBack }) {
  const sorted = [...history].sort((a,b) => QUARTERS.indexOf(a.quarter) - QUARTERS.indexOf(b.quarter));
  const [activeQ, setActiveQ] = useState(history[0]?.quarter || null);
  const activeEntry = history.find(h => h.quarter === activeQ);

  return (<>
    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22 }}>
      <div>
        <button className="btn btn-outline" style={{ fontSize:12,marginBottom:12 }} onClick={onBack}>← All Accounts</button>
        <h2 style={{ fontFamily:"'Lora',serif",fontWeight:600,fontSize:22,color:C.text,marginBottom:4 }}>{account}</h2>
        <div style={{ fontSize:12,color:C.textLight }}>CSM: {csm} · {history.length} quarter{history.length!==1?"s":""} submitted</div>
      </div>
    </div>

    {history.length===0 ? (
      <EmptyState icon="◌" text="No submissions found for this account yet." />
    ) : (<>
      {/* Trend */}
      <div style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:24,marginBottom:20 }}>
        <div style={{ fontSize:10.5,fontWeight:600,color:C.textLight,textTransform:"uppercase",letterSpacing:".09em",marginBottom:18 }}>Health Trend</div>
        <TrendChart data={sorted} activeQ={activeQ} onSelect={setActiveQ} />
      </div>

      {/* Quarter pills */}
      <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:20 }}>
        {history.map(h=>{
          const t=h.status?.tier||"low";
          const isActive=activeQ===h.quarter;
          return <button key={h.quarter} onClick={()=>setActiveQ(h.quarter)} style={{ cursor:"pointer",padding:"7px 16px",borderRadius:100,fontSize:12,fontWeight:500,fontFamily:"'DM Sans',sans-serif",transition:"all .15s",
            background:isActive?C[t].bg:C.surface,border:`1.5px solid ${isActive?C[t].dot:C.border}`,color:isActive?C[t].dot:C.textMid }}>{h.quarter}</button>;
        })}
      </div>

      {activeEntry && (<>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
          <span style={{ fontFamily:"'Lora',serif",fontWeight:600,fontSize:16,color:C.text }}>{activeEntry.quarter}</span>
          <span style={{ fontSize:11,color:C.textLight }}>{new Date(activeEntry.timestamp).toLocaleDateString()}</span>
          <span style={{ fontSize:11,color:C.textLight }}>· {activeEntry.status?.reds||0} flagged · {activeEntry.status?.ambers||0} watch · {activeEntry.status?.greens||0} healthy</span>
        </div>
        {(() => {
          const flags = PARAMETERS.filter(p=>activeEntry.ratings[p.id]==="red");
          return flags.length>0 ? (
            <div className="flag-card" style={{ marginBottom:16 }}>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
                <div style={{ width:6,height:6,borderRadius:"50%",background:C.red.dot }} />
                <span style={{ fontSize:11,fontWeight:700,color:C.red.text,textTransform:"uppercase",letterSpacing:".09em" }}>{flags.length} Critical Flag{flags.length>1?"s":""}</span>
              </div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
                {flags.map(p=><span key={p.id} className="chip" style={{ background:"rgba(255,255,255,.6)",color:C.red.text,border:`1px solid ${C.red.border}` }}>{p.label}</span>)}
              </div>
            </div>
          ) : (
            <div style={{ background:C.green.bg,border:`1px solid ${C.green.border}`,borderRadius:12,padding:"12px 18px",marginBottom:16,display:"flex",alignItems:"center",gap:8 }}>
              <div style={{ width:6,height:6,borderRadius:"50%",background:C.green.dot }} />
              <span style={{ fontSize:13,color:C.green.text }}>No critical flags this quarter.</span>
            </div>
          );
        })()}
        <HeatmapGrid ratings={activeEntry.ratings} />
      </>)}
    </>)}
  </>);
}

// ─── CSM VIEW (unchanged, extracted) ─────────────────────────────────────────
function CSMView({ csms, selectedCSM, selectedAccount, selectedQuarter, ratings, screen, history, expanded, progress, ratingVals,
  setSelectedCSM, setSelectedAccount, setSelectedQuarter, setRatings, setScreen, setExpanded, onSubmit, onViewHistory, cleanRatings }) {

  const currentCSM = csms.find(c => c.name === selectedCSM);
  const accounts = currentCSM?.accounts || [];

  return (<>
    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:32 }}>
      {[
        { label:"CSM", value:selectedCSM, onChange:setSelectedCSM, options:csms.map(c=>c.name), placeholder:"Select CSM…" },
        { label:"Account", value:selectedAccount, onChange:setSelectedAccount, options:accounts, placeholder:"Select Account…", disabled:!selectedCSM },
        { label:"Quarter", value:selectedQuarter, onChange:setSelectedQuarter, options:QUARTERS, isCurrent:true },
      ].map(s=>(
        <div key={s.label}>
          <label style={{ display:"block",fontSize:10.5,fontWeight:600,color:C.textLight,textTransform:"uppercase",letterSpacing:".09em",marginBottom:7 }}>{s.label}</label>
          <div style={{ position:"relative" }}>
            <select value={s.value} onChange={e=>s.onChange(e.target.value)} disabled={s.disabled}>
              {s.placeholder && <option value="">{s.placeholder}</option>}
              {s.options.map(o=><option key={o} value={o}>{o}{s.isCurrent&&o===currentQuarter()?" (current)":""}</option>)}
            </select>
            <span style={{ position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",color:C.textLight,pointerEvents:"none",fontSize:11 }}>▾</span>
          </div>
        </div>
      ))}
    </div>

    {!selectedCSM && <EmptyState icon="◈" text="Select a CSM to get started" />}
    {selectedCSM && !selectedAccount && <EmptyState icon="◎" text="Select an account to begin assessment" />}

    {selectedAccount && screen==="form" && (
      <FormScreen account={selectedAccount} csm={selectedCSM} quarter={selectedQuarter}
        ratings={ratings} setRatings={setRatings} progress={progress} ratingCount={ratingVals.length}
        expanded={expanded} setExpanded={setExpanded}
        onSubmit={onSubmit} onReset={()=>{ setRatings({}); setExpanded(null); }} onViewHistory={onViewHistory} />
    )}
    {selectedAccount && screen==="results" && (
      <ResultsScreen account={selectedAccount} csm={selectedCSM} quarter={selectedQuarter}
        ratings={cleanRatings()} onViewHistory={onViewHistory} onNewAssessment={()=>{ setRatings({}); setScreen("form"); setExpanded(null); }} />
    )}
    {selectedAccount && screen==="history" && (
      <HistoryScreen account={selectedAccount} csm={selectedCSM} history={history}
        onBack={()=>setScreen("results")} />
    )}
  </>);
}

// ─── ADMIN VIEW ───────────────────────────────────────────────────────────────
function AdminView({ csms, adminTab, setAdminTab, newCSMName, setNewCSMName, newAccountName, setNewAccountName,
  newAccountCSM, setNewAccountCSM, newAdminPw, setNewAdminPw, newManagerPw, setNewManagerPw,
  addCSM, removeCSM, addAccount, removeAccount, updatePasswords, onLock }) {
  return (<>
    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28 }}>
      <div>
        <h1 style={{ fontFamily:"'Lora',serif",fontWeight:600,fontSize:22,color:C.text,marginBottom:4 }}>Admin Panel</h1>
        <p style={{ fontSize:13,color:C.textLight }}>Manage CSMs, accounts, and access credentials.</p>
      </div>
      <button className="btn btn-outline" style={{ fontSize:12 }} onClick={onLock}>Lock & Exit</button>
    </div>
    <div style={{ display:"flex",gap:4,marginBottom:28 }}>
      {["csms","accounts","security"].map(t=>(
        <button key={t} className={`pill ${adminTab===t?"on":""}`} onClick={()=>setAdminTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
      ))}
    </div>

    {adminTab==="csms" && (<>
      <div style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:18 }}>
        <div style={{ fontSize:10.5,fontWeight:600,color:C.textLight,textTransform:"uppercase",letterSpacing:".08em",marginBottom:11 }}>Add New CSM</div>
        <div style={{ display:"flex",gap:10 }}>
          <input type="text" placeholder="Full name" value={newCSMName} onChange={e=>setNewCSMName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCSM()} />
          <button className="btn btn-dark" style={{ whiteSpace:"nowrap" }} onClick={addCSM}>Add</button>
        </div>
      </div>
      <div style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden" }}>
        {csms.length===0
          ? <div style={{ padding:32,textAlign:"center",color:C.textLight,fontSize:13 }}>No CSMs yet.</div>
          : csms.map((c,i)=>(
            <div key={c.name} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px",borderTop:i>0?`1px solid ${C.borderSub}`:"none" }}>
              <div>
                <div style={{ fontSize:14,fontWeight:500,color:C.text }}>{c.name}</div>
                <div style={{ fontSize:11,color:C.textLight,marginTop:2 }}>{c.accounts.length} account{c.accounts.length!==1?"s":""}</div>
              </div>
              <button className="btn-del" onClick={()=>removeCSM(c.name)}>Remove</button>
            </div>
          ))}
      </div>
    </>)}

    {adminTab==="accounts" && (<>
      <div style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:18 }}>
        <div style={{ fontSize:10.5,fontWeight:600,color:C.textLight,textTransform:"uppercase",letterSpacing:".08em",marginBottom:11 }}>Assign Account to CSM</div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:10 }}>
          <input type="text" placeholder="Account name" value={newAccountName} onChange={e=>setNewAccountName(e.target.value)} />
          <div style={{ position:"relative" }}>
            <select value={newAccountCSM} onChange={e=>setNewAccountCSM(e.target.value)}>
              <option value="">Select CSM…</option>
              {csms.map(c=><option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
            <span style={{ position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",color:C.textLight,pointerEvents:"none",fontSize:11 }}>▾</span>
          </div>
          <button className="btn btn-dark" style={{ whiteSpace:"nowrap" }} onClick={addAccount}>Assign</button>
        </div>
      </div>
      {csms.filter(c=>c.accounts.length>0).map(c=>(
        <div key={c.name} style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden",marginBottom:12 }}>
          <div style={{ padding:"11px 20px",background:C.surfaceAlt,borderBottom:`1px solid ${C.border}`,fontSize:12,fontWeight:600,color:C.textMid }}>{c.name}</div>
          {c.accounts.map((a,i)=>(
            <div key={a} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 20px",borderTop:i>0?`1px solid ${C.borderSub}`:"none" }}>
              <span style={{ fontSize:13,color:C.text }}>{a}</span>
              <button className="btn-del" onClick={()=>removeAccount(c.name,a)}>Remove</button>
            </div>
          ))}
        </div>
      ))}
    </>)}

    {adminTab==="security" && (
      <div style={{ display:"flex",flexDirection:"column",gap:16,maxWidth:440 }}>
        {[
          { label:"Manager Password", sub:"Password required for the Manager view", val:newManagerPw, setVal:setNewManagerPw, key:"manager" },
          { label:"Admin Password", sub:"Password required for this Admin panel", val:newAdminPw, setVal:setNewAdminPw, key:"admin" },
        ].map(s=>(
          <div key={s.key} style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:22 }}>
            <div style={{ fontSize:13,fontWeight:600,color:C.text,marginBottom:3 }}>{s.label}</div>
            <div style={{ fontSize:12,color:C.textLight,marginBottom:14 }}>{s.sub}</div>
            <div style={{ display:"flex",gap:10 }}>
              <input type="password" placeholder="New password (min 4 chars)" value={s.val} onChange={e=>s.setVal(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&updatePasswords({ [s.key]:s.val })} />
              <button className="btn btn-dark" style={{ whiteSpace:"nowrap" }} onClick={()=>updatePasswords({ [s.key]:s.val })}>Update</button>
            </div>
          </div>
        ))}
      </div>
    )}
  </>);
}

// ─── FORM SCREEN ──────────────────────────────────────────────────────────────
function FormScreen({ account, csm, quarter, ratings, setRatings, progress, ratingCount, expanded, setExpanded, onSubmit, onReset, onViewHistory }) {
  return (<>
    <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20,gap:12 }}>
      <div>
        <h1 style={{ fontFamily:"'Lora',serif",fontWeight:600,fontSize:22,color:C.text,marginBottom:6 }}>{account}</h1>
        <div style={{ fontSize:12,color:C.textLight,display:"flex",alignItems:"center",gap:8 }}>
          <span>{csm}</span><span style={{ color:C.border }}>·</span>
          <span style={{ background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:500,color:C.textMid }}>{quarter}</span>
          <span style={{ color:C.border }}>·</span><span>{ratingCount} of {PARAMETERS.length} rated</span>
        </div>
      </div>
      <button className="btn btn-outline" style={{ marginTop:4,whiteSpace:"nowrap" }} onClick={onViewHistory}>View History</button>
    </div>
    <div style={{ background:C.surfaceAlt,borderRadius:100,height:3,marginBottom:26,overflow:"hidden" }}>
      <div style={{ height:"100%",background:C.accent,borderRadius:100,width:`${progress}%`,transition:"width .35s ease" }} />
    </div>
    {PARAMETERS.map(param => {
      const sel=ratings[param.id], isOpen=expanded===param.id, st=sel?C[sel]:null;
      return (
        <div key={param.id} className="prow">
          <div className="phd" onClick={()=>setExpanded(isOpen?null:param.id)}>
            <div style={{ display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0 }}>
              <div style={{ width:7,height:7,borderRadius:"50%",background:st?st.dot:C.border,flexShrink:0,transition:"background .2s" }} />
              <span style={{ fontSize:13.5,fontWeight:500,color:C.text }}>{param.label}</span>
              {sel && <span className="chip" style={{ background:st.bg,color:st.text,border:`1px solid ${st.border}` }}>
                {sel==="green"?"Healthy":sel==="amber"?"Watch":"Flagged"}
              </span>}
            </div>
            <span style={{ color:C.textLight,fontSize:11,flexShrink:0,marginLeft:12,display:"inline-block",transform:isOpen?"rotate(180deg)":"none",transition:"transform .2s" }}>▾</span>
          </div>
          {isOpen && <div style={{ padding:"0 20px 18px",borderTop:`1px solid ${C.borderSub}` }}>
            <p style={{ fontSize:12.5,color:C.textMid,lineHeight:1.6,margin:"14px 0 16px" }}>{param.question}</p>
            {["green","amber","red"].map(t=>{
              const st2=C[t], tLabel=t==="green"?"Healthy":t==="amber"?"Watch":"Flagged";
              return <div key={t} style={{ marginBottom:12 }}>
                <div style={{ display:"flex",alignItems:"center",gap:5,marginBottom:6 }}>
                  <div style={{ width:6,height:6,borderRadius:"50%",background:st2.dot }} />
                  <span style={{ fontSize:10.5,fontWeight:600,color:st2.text,textTransform:"uppercase",letterSpacing:".08em" }}>{tLabel}</span>
                </div>
                <div style={{ display:"flex",flexDirection:"column",gap:5 }}>
                  {param.options[t].map((opt,i)=>{
                    const optKey=`${t}_${i}`;
                    const isSel=ratings[param.id]===t&&(param.options[t].length===1?true:ratings[`${param.id}_opt`]===optKey);
                    return <button key={i} className={`opt${isSel?` sel-${t}`:""}`}
                      onClick={()=>setRatings(prev=>({...prev,[param.id]:t,[`${param.id}_opt`]:optKey}))}>{opt}</button>;
                  })}
                </div>
              </div>;
            })}
          </div>}
        </div>
      );
    })}
    <div style={{ display:"flex",justifyContent:"flex-end",gap:10,marginTop:22 }}>
      <button className="btn btn-outline" onClick={onReset}>Reset</button>
      <button className="btn btn-dark" onClick={onSubmit}>Save Risk Profile →</button>
    </div>
  </>);
}

// ─── RESULTS SCREEN ───────────────────────────────────────────────────────────
function ResultsScreen({ account, csm, quarter, ratings, onViewHistory, onNewAssessment }) {
  const flagged = PARAMETERS.filter(p=>ratings[p.id]==="red");
  const watched  = PARAMETERS.filter(p=>ratings[p.id]==="amber");
  return (<>
    <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:22 }}>
      <div>
        <h1 style={{ fontFamily:"'Lora',serif",fontWeight:600,fontSize:22,color:C.text,marginBottom:6 }}>{account}</h1>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <span style={{ background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:500,color:C.textMid }}>{quarter}</span>
          <span style={{ fontSize:12,color:C.textLight }}>· {csm}</span>
        </div>
      </div>
      <button className="btn btn-outline" style={{ marginTop:4 }} onClick={onViewHistory}>View History →</button>
    </div>
    {flagged.length>0 && (
      <div className="flag-card">
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:12 }}>
          <div style={{ width:6,height:6,borderRadius:"50%",background:C.red.dot }} />
          <span style={{ fontSize:11,fontWeight:700,color:C.red.text,textTransform:"uppercase",letterSpacing:".09em" }}>{flagged.length} Critical Flag{flagged.length>1?"s":""} Requiring Attention</span>
        </div>
        {flagged.map((p,i)=>(
          <div key={p.id} className="flag-item">
            <div style={{ width:20,height:20,borderRadius:6,background:C.red.border,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1 }}>
              <span style={{ fontSize:10,color:C.red.text,fontWeight:700 }}>{i+1}</span>
            </div>
            <div>
              <div style={{ fontSize:13,fontWeight:600,color:C.red.text,marginBottom:2 }}>{p.label}</div>
            </div>
          </div>
        ))}
      </div>
    )}
    {flagged.length===0&&watched.length===0 && (
      <div style={{ background:C.green.bg,border:`1px solid ${C.green.border}`,borderRadius:12,padding:"14px 20px",marginBottom:18,display:"flex",alignItems:"center",gap:10 }}>
        <div style={{ width:6,height:6,borderRadius:"50%",background:C.green.dot }} />
        <span style={{ fontSize:13,color:C.green.text,fontWeight:500 }}>All parameters are healthy — no flags to review.</span>
      </div>
    )}
    <HeatmapGrid ratings={ratings} />
    {watched.length>0 && (
      <div style={{ background:C.amber.bg,border:`1px solid ${C.amber.border}`,borderRadius:12,padding:"14px 20px",marginTop:14 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
          <div style={{ width:6,height:6,borderRadius:"50%",background:C.amber.dot }} />
          <span style={{ fontSize:11,fontWeight:700,color:C.amber.text,textTransform:"uppercase",letterSpacing:".09em" }}>{watched.length} Parameter{watched.length>1?"s":""} to Watch</span>
        </div>
        <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
          {watched.map(p=><span key={p.id} className="chip" style={{ background:"rgba(255,255,255,.6)",color:C.amber.text,border:`1px solid ${C.amber.border}` }}>{p.label}</span>)}
        </div>
      </div>
    )}
    <div style={{ display:"flex",gap:10,marginTop:18 }}>
      <button className="btn btn-outline" onClick={onViewHistory}>View Trend →</button>
      <button className="btn btn-dark" onClick={onNewAssessment}>New Assessment</button>
    </div>
  </>);
}

// ─── HISTORY SCREEN ───────────────────────────────────────────────────────────
function HistoryScreen({ account, csm, history, onBack }) {
  const sorted = [...history].sort((a,b)=>QUARTERS.indexOf(a.quarter)-QUARTERS.indexOf(b.quarter));
  const [activeQ, setActiveQ] = useState(history[0]?.quarter||null);
  const activeEntry = history.find(h=>h.quarter===activeQ);
  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22 }}>
        <div>
          <h2 style={{ fontFamily:"'Lora',serif",fontWeight:600,fontSize:20,color:C.text,marginBottom:3 }}>Quarterly History</h2>
          <div style={{ fontSize:12,color:C.textLight }}>{account} · {csm}</div>
        </div>
        <button className="btn btn-outline" onClick={onBack}>← Back</button>
      </div>
      {history.length===0 ? <EmptyState icon="◌" text="No quarterly submissions found yet." /> : (<>
        <div style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:24,marginBottom:20 }}>
          <div style={{ fontSize:10.5,fontWeight:600,color:C.textLight,textTransform:"uppercase",letterSpacing:".09em",marginBottom:18 }}>Health Trend</div>
          <TrendChart data={sorted} activeQ={activeQ} onSelect={setActiveQ} />
        </div>
        <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:20 }}>
          {history.map(h=>{ const t=h.status?.tier||"low",isActive=activeQ===h.quarter;
            return <button key={h.quarter} onClick={()=>setActiveQ(h.quarter)} style={{ cursor:"pointer",padding:"7px 16px",borderRadius:100,fontSize:12,fontWeight:500,fontFamily:"'DM Sans',sans-serif",transition:"all .15s",
              background:isActive?C[t].bg:C.surface,border:`1.5px solid ${isActive?C[t].dot:C.border}`,color:isActive?C[t].dot:C.textMid }}>{h.quarter}</button>;
          })}
        </div>
        {activeEntry && (<>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
            <span style={{ fontFamily:"'Lora',serif",fontWeight:600,fontSize:16,color:C.text }}>{activeEntry.quarter}</span>
            <span style={{ fontSize:11,color:C.textLight }}>{new Date(activeEntry.timestamp).toLocaleDateString()} · {activeEntry.status?.reds||0} flagged · {activeEntry.status?.ambers||0} watch · {activeEntry.status?.greens||0} healthy</span>
          </div>
          {(() => { const flags=PARAMETERS.filter(p=>activeEntry.ratings[p.id]==="red");
            return flags.length>0 ? (
              <div className="flag-card" style={{ marginBottom:16 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
                  <div style={{ width:6,height:6,borderRadius:"50%",background:C.red.dot }} />
                  <span style={{ fontSize:11,fontWeight:700,color:C.red.text,textTransform:"uppercase",letterSpacing:".09em" }}>{flags.length} Critical Flag{flags.length>1?"s":""}</span>
                </div>
                <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
                  {flags.map(p=><span key={p.id} className="chip" style={{ background:"rgba(255,255,255,.6)",color:C.red.text,border:`1px solid ${C.red.border}` }}>{p.label}</span>)}
                </div>
              </div>
            ) : (
              <div style={{ background:C.green.bg,border:`1px solid ${C.green.border}`,borderRadius:12,padding:"12px 18px",marginBottom:16,display:"flex",alignItems:"center",gap:8 }}>
                <div style={{ width:6,height:6,borderRadius:"50%",background:C.green.dot }} /><span style={{ fontSize:13,color:C.green.text }}>No critical flags this quarter.</span>
              </div>
            );
          })()}
          <HeatmapGrid ratings={activeEntry.ratings} />
        </>)}
      </>)}
    </div>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function HeatmapGrid({ ratings }) {
  return (
    <div style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:24 }}>
      <div style={{ fontSize:10.5,fontWeight:600,color:C.textLight,textTransform:"uppercase",letterSpacing:".09em",marginBottom:16 }}>Parameter Heatmap</div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8 }}>
        {PARAMETERS.map(p=>{
          const r=ratings[p.id],st=r?C[r]:null;
          return <div key={p.id} style={{ borderRadius:10,height:52,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,padding:"6px 8px",background:st?st.heat:C.surfaceAlt }}>
            <span style={{ fontSize:10,fontWeight:600,textAlign:"center",lineHeight:1.3,color:st?C[r].text:C.textLight }}>{p.short}</span>
            {r && <div style={{ width:5,height:5,borderRadius:"50%",background:st.dot,opacity:.7 }} />}
          </div>;
        })}
      </div>
      <div style={{ display:"flex",gap:16,marginTop:14,justifyContent:"flex-end" }}>
        {[["green","Healthy"],["amber","Watch"],["red","Flagged"]].map(([t,lbl])=>(
          <div key={t} style={{ display:"flex",alignItems:"center",gap:5 }}>
            <div style={{ width:11,height:11,borderRadius:3,background:C[t].heat }} />
            <span style={{ fontSize:11,color:C.textMid }}>{lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendChart({ data, activeQ, onSelect }) {
  if(!data.length) return null;
  const W=700,H=100,PAD=28;
  const tierY={ low:PAD, mid:PAD+(H-PAD*2)/2, high:PAD+(H-PAD*2) };
  const points=data.map((d,i)=>({ x:data.length===1?W/2:PAD+(i/(data.length-1))*(W-PAD*2), y:tierY[d.status?.tier||"low"], d }));
  const pathD=points.length<2?"":points.map((p,i)=>{ if(i===0) return `M ${p.x} ${p.y}`; const prev=points[i-1],cx=(prev.x+p.x)/2; return `C ${cx} ${prev.y} ${cx} ${p.y} ${p.x} ${p.y}`; }).join(" ");
  const yLabels=[{label:"Healthy",y:tierY.low},{label:"Watch",y:tierY.mid},{label:"Flagged",y:tierY.high}];
  return (
    <div style={{ overflowX:"auto" }}>
      <svg viewBox={`-72 0 ${W+80} ${H+28}`} style={{ width:"100%",minWidth:280,maxHeight:180 }}>
        {yLabels.map(yl=>(
          <g key={yl.label}>
            <line x1={PAD-4} y1={yl.y} x2={W-PAD+4} y2={yl.y} stroke={C.borderSub} strokeWidth="1" strokeDasharray="4 3"/>
            <text x={PAD-8} y={yl.y+4} textAnchor="end" fontSize="9" fill={C.textLight} fontFamily="DM Sans,sans-serif">{yl.label}</text>
          </g>
        ))}
        {points.length>1 && <path d={pathD} fill="none" stroke={C.accent} strokeWidth="1.5" strokeOpacity=".3"/>}
        {points.map((p,i)=>{ const t=p.d.status?.tier||"low",isActive=activeQ===p.d.quarter;
          return <g key={i} style={{ cursor:"pointer" }} onClick={()=>onSelect(p.d.quarter)}>
            <circle cx={p.x} cy={p.y} r={isActive?9:6} fill={C[t].bg} stroke={C[t].dot} strokeWidth={isActive?2.5:1.5}/>
            <circle cx={p.x} cy={p.y} r={isActive?4:2.5} fill={C[t].dot}/>
            <text x={p.x} y={H+20} textAnchor="middle" fontSize="9.5" fill={isActive?C.text:C.textLight} fontFamily="DM Sans,sans-serif" fontWeight={isActive?"600":"400"}>{p.d.quarter}</text>
          </g>;
        })}
      </svg>
    </div>
  );
}

function EmptyState({ icon, text }) {
  return <div style={{ textAlign:"center",padding:"80px 0",color:C.textLight }}><div style={{ fontSize:32,opacity:.25,marginBottom:12 }}>{icon}</div><div style={{ fontSize:13 }}>{text}</div></div>;
}

function Loader() {
  return <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:C.bg,color:C.textLight,fontFamily:"serif",fontSize:14 }}>Loading…</div>;
}
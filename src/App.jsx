import { useState } from "react";

const FORGE_SYSTEM_PROMPT = `Tu es FORGE, l'IA interne de Coaxis Growth Agency.

Coaxis aide les coaches sportifs et nutritionnels francophones à atteindre 10 000€/mois grâce à la méthode SYSTEM 10K — un système complet : offre, contenu Instagram, tunnel automatisé ManyChat/email, système de vente setter/closer, et Meta Ads.

La preuve de concept centrale est Adeline (@adeline_dietetfit), coach nutrition spécialisée petites femmes, dont le système complet a été construit par Coaxis : Meta Ads, ManyChat, tunnel email Systeme.io, scripts setter/closer, stratégie de contenu.

Ton rôle : générer des livrables ultra-précis, prêts à l'emploi, basés sur le profil du coach fourni. Chaque livrable doit être :
- Directement utilisable sans réécriture
- Adapté à la niche et à l'audience du coach
- Orienté conversion
- En français, ton professionnel et direct

Ne génère JAMAIS de blabla introductif. Va directement au livrable.`;

const DELIVERABLES = [
  {
    id: "positioning",
    label: "Positionnement",
    icon: "◈",
    desc: "Angle différenciant + promesse centrale",
    prompt: (data) => `Génère le positionnement différenciant pour ce coach.

PROFIL :
- Prénom : ${data.prenom}
- Niche : ${data.niche}
- Audience cible : ${data.audience}
- Résultats clients prouvés : ${data.resultats}
- Différenciateur perçu : ${data.differenciateur}
- Revenus actuels : ${data.revenus_actuels}€/mois

LIVRABLE ATTENDU :
1. **Angle de positionnement** (1 phrase tranchée — ce qui le rend unique)
2. **Promesse centrale** (ce qu'il promet en X jours/semaines)
3. **Pour qui / Pas pour qui** (2-3 bullets chaque)
4. **Proof point principal** (l'argument #1 de crédibilité)
5. **Tagline** (5-8 mots max, mémorable)`,
  },
  {
    id: "bio",
    label: "Bio Instagram",
    icon: "◉",
    desc: "Bio optimisée prête à coller",
    prompt: (data) => `Génère la bio Instagram optimisée pour ce coach.

PROFIL :
- Prénom : ${data.prenom}
- Niche : ${data.niche}
- Audience cible : ${data.audience}
- Résultats clients : ${data.resultats}
- Différenciateur : ${data.differenciateur}
- Plateforme principale : ${data.plateforme}

CONTRAINTES :
- 150 caractères max
- Pas d'emojis génériques
- 1 CTA clair en dernière ligne
- Doit inclure : qui tu aides / ce que tu promets / preuve / CTA

Génère 3 versions (A/B/C) avec approche différente pour chaque.`,
  },
  {
    id: "offer",
    label: "Structure d'offre",
    icon: "◆",
    desc: "Offre signature + prix + arguments",
    prompt: (data) => `Génère la structure complète de l'offre signature pour ce coach.

PROFIL :
- Prénom : ${data.prenom}
- Niche : ${data.niche}
- Audience cible : ${data.audience}
- Offre actuelle : ${data.offre_actuelle} à ${data.prix_actuel}€
- Résultats clients : ${data.resultats}
- Objectif revenus : ${data.objectif_revenus}€/mois

LIVRABLE ATTENDU :
1. **Nom de l'offre** (mémorable, différenciant)
2. **Promesse centrale** (résultat en X jours)
3. **Ce que l'offre inclut** (liste des modules/éléments — concret)
4. **Prix recommandé** + justification
5. **Argument de vente #1** (pourquoi ce prix est justifié)
6. **Objection principale + réponse**`,
  },
  {
    id: "dm_script",
    label: "Script DM Setter",
    icon: "◇",
    desc: "Séquence DM Instagram en 5 messages",
    prompt: (data) => `Génère le script DM setter Instagram complet pour ce coach.

PROFIL :
- Prénom : ${data.prenom}
- Niche : ${data.niche}
- Audience cible : ${data.audience}
- Offre : ${data.offre_actuelle}
- Résultats clients : ${data.resultats}

CONTEXTE : Le setter contacte des prospects qui ont interagi avec le contenu (like, commentaire, partage). L'objectif est de qualifier et booker un appel découverte — pas de vendre directement.

LIVRABLE : Séquence de 5 messages DM (Message 1 à 5) :
- M1 : Accroche personnalisée (pas de pitch)
- M2 : Valeur / curiosité (si réponse)
- M3 : Qualification douce
- M4 : Transition vers l'appel
- M5 : Relance (si pas de réponse à M4)

Chaque message : max 3 lignes. Naturel, pas commercial.`,
  },
  {
    id: "content_plan",
    label: "Plan contenu 30j",
    icon: "◎",
    desc: "30 idées de posts/Reels avec angles",
    prompt: (data) => `Génère le plan de contenu Instagram 30 jours pour ce coach.

PROFIL :
- Prénom : ${data.prenom}
- Niche : ${data.niche}
- Audience cible : ${data.audience}
- Résultats clients : ${data.resultats}
- Différenciateur : ${data.differenciateur}

FORMAT : 1 post/jour sur 30 jours.
Pour chaque post :
- Numéro + Type (Reel / Carrousel / Post statique)
- Hook (première ligne accrocheuse)
- Angle (éducatif / preuve / polémique / behind-the-scenes / storytelling)

Organise par semaine (S1 à S4). Varie les formats et les angles.`,
  },
  {
    id: "email_sequence",
    label: "Séquence email nurture",
    icon: "◐",
    desc: "5 emails post-inscription",
    prompt: (data) => `Génère la séquence email nurture complète (5 emails) pour ce coach.

PROFIL :
- Prénom : ${data.prenom}
- Niche : ${data.niche}
- Audience cible : ${data.audience}
- Offre : ${data.offre_actuelle}
- Résultats clients : ${data.resultats}
- Prix de l'offre : ${data.prix_actuel}€

CONTEXTE : L'abonné vient de s'inscrire via une page de capture (lead magnet ou liste d'attente).

SÉQUENCE :
- Email 1 (J0) : Bienvenue + valeur immédiate
- Email 2 (J2) : Le problème qu'il a (miroir)
- Email 3 (J4) : La solution / méthode (sans tout révéler)
- Email 4 (J6) : Preuve sociale (résultats clients)
- Email 5 (J8) : CTA appel découverte

Pour chaque email : Objet / Préheader / Corps complet.`,
  },
];

const STEPS = ["profil", "livrable", "resultat"];

export default function FORGE() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    prenom: "",
    niche: "",
    audience: "",
    offre_actuelle: "",
    prix_actuel: "",
    revenus_actuels: "",
    objectif_revenus: "",
    resultats: "",
    differenciateur: "",
    plateforme: "Instagram",
  });
  const [selectedDeliverable, setSelectedDeliverable] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const updateForm = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const canProceed = () => {
    return (
      form.prenom && form.niche && form.audience && form.resultats
    );
  };

  const generate = async () => {
    if (!selectedDeliverable) return;
    setLoading(true);
    setError("");
    setResult("");
    const deliverable = DELIVERABLES.find((d) => d.id === selectedDeliverable);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: FORGE_SYSTEM_PROMPT,
          messages: [{ role: "user", content: deliverable.prompt(form) }],
        }),
      });
      const data = await res.json();
      if (data.content?.[0]?.text) {
        setResult(data.content[0].text);
        setStep(2);
      } else {
        setError("Erreur lors de la génération. Réessaie.");
      }
    } catch (e) {
      setError("Erreur de connexion à l'API.");
    }
    setLoading(false);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setStep(0);
    setResult("");
    setSelectedDeliverable(null);
    setError("");
  };

  const goToDeliverables = () => {
    if (canProceed()) setStep(1);
  };

  const selectedDel = DELIVERABLES.find((d) => d.id === selectedDeliverable);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      fontFamily: "'DM Mono', 'Courier New', monospace",
      color: "#e8e0d0",
      padding: "0",
      margin: "0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #e05a00; border-radius: 2px; }
        
        .forge-input {
          background: #111;
          border: 1px solid #2a2a2a;
          border-radius: 2px;
          color: #e8e0d0;
          padding: 10px 14px;
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          width: 100%;
          outline: none;
          transition: border-color 0.2s;
        }
        .forge-input:focus {
          border-color: #e05a00;
        }
        .forge-input::placeholder { color: #444; }
        
        .del-card {
          background: #111;
          border: 1px solid #1e1e1e;
          border-radius: 3px;
          padding: 16px 18px;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .del-card:hover {
          border-color: #e05a00;
          background: #141414;
        }
        .del-card.selected {
          border-color: #e05a00;
          background: #1a0e00;
        }
        
        .forge-btn {
          background: #e05a00;
          color: #0a0a0a;
          border: none;
          padding: 12px 28px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px;
          letter-spacing: 2px;
          cursor: pointer;
          border-radius: 2px;
          transition: all 0.15s;
        }
        .forge-btn:hover { background: #ff6a0d; }
        .forge-btn:disabled { background: #333; color: #555; cursor: not-allowed; }
        
        .forge-btn-ghost {
          background: transparent;
          color: #555;
          border: 1px solid #2a2a2a;
          padding: 10px 22px;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          letter-spacing: 1px;
          cursor: pointer;
          border-radius: 2px;
          transition: all 0.15s;
        }
        .forge-btn-ghost:hover { border-color: #555; color: #888; }
        
        .result-content {
          white-space: pre-wrap;
          line-height: 1.8;
          font-size: 13px;
          color: #c8c0b0;
        }
        
        .step-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #2a2a2a;
        }
        .step-dot.active { background: #e05a00; }
        .step-dot.done { background: #555; }

        .pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .result-block {
          background: #0f0f0f;
          border: 1px solid #1e1e1e;
          border-radius: 3px;
          padding: 28px;
          max-height: 60vh;
          overflow-y: auto;
        }

        label {
          display: block;
          font-size: 10px;
          letter-spacing: 2px;
          color: #555;
          margin-bottom: 6px;
          text-transform: uppercase;
        }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1a1a1a",
        padding: "20px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "28px",
            letterSpacing: "6px",
            color: "#e05a00",
          }}>FORGE</span>
          <span style={{
            fontSize: "10px",
            color: "#333",
            letterSpacing: "3px",
            textTransform: "uppercase",
            borderLeft: "1px solid #222",
            paddingLeft: "12px",
          }}>by Coaxis</span>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {["PROFIL", "LIVRABLE", "RÉSULTAT"].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div className={`step-dot ${step === i ? "active" : step > i ? "done" : ""}`} />
              <span style={{
                fontSize: "9px",
                letterSpacing: "2px",
                color: step === i ? "#e05a00" : step > i ? "#444" : "#2a2a2a",
              }}>{s}</span>
              {i < 2 && <span style={{ color: "#1e1e1e", fontSize: "10px" }}>—</span>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 24px" }}>

        {/* STEP 0 — PROFIL */}
        {step === 0 && (
          <div>
            <div style={{ marginBottom: "36px" }}>
              <h1 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "36px",
                letterSpacing: "4px",
                color: "#e8e0d0",
                margin: "0 0 8px 0",
              }}>PROFIL DU COACH</h1>
              <p style={{ fontSize: "12px", color: "#444", margin: 0, letterSpacing: "1px" }}>
                Ces informations servent à personnaliser chaque livrable généré.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label>Prénom *</label>
                  <input className="forge-input" placeholder="Ex : Sarah" value={form.prenom}
                    onChange={e => updateForm("prenom", e.target.value)} />
                </div>
                <div>
                  <label>Plateforme principale</label>
                  <select className="forge-input" value={form.plateforme}
                    onChange={e => updateForm("plateforme", e.target.value)}
                    style={{ appearance: "none" }}>
                    <option>Instagram</option>
                    <option>TikTok</option>
                    <option>YouTube</option>
                    <option>LinkedIn</option>
                  </select>
                </div>
              </div>

              <div>
                <label>Niche exacte *</label>
                <input className="forge-input" placeholder="Ex : coach nutrition spécialisé femmes 35-50 ans post-grossesse"
                  value={form.niche} onChange={e => updateForm("niche", e.target.value)} />
              </div>

              <div>
                <label>Audience cible *</label>
                <input className="forge-input" placeholder="Ex : femmes actives 35-50 ans qui veulent perdre du poids après grossesse"
                  value={form.audience} onChange={e => updateForm("audience", e.target.value)} />
              </div>

              <div>
                <label>Résultats clients prouvés *</label>
                <textarea className="forge-input" rows={3}
                  placeholder="Ex : 47 clientes accompagnées, -8kg en moyenne sur 3 mois, 92% maintiennent leur résultat 6 mois après"
                  value={form.resultats} onChange={e => updateForm("resultats", e.target.value)}
                  style={{ resize: "vertical" }} />
              </div>

              <div>
                <label>Ton différenciateur principal</label>
                <input className="forge-input" placeholder="Ex : approche sans restriction, protocole adapté aux mères qui allaitent"
                  value={form.differenciateur} onChange={e => updateForm("differenciateur", e.target.value)} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                <div>
                  <label>Offre actuelle</label>
                  <input className="forge-input" placeholder="Ex : suivi 3 mois"
                    value={form.offre_actuelle} onChange={e => updateForm("offre_actuelle", e.target.value)} />
                </div>
                <div>
                  <label>Prix actuel (€)</label>
                  <input className="forge-input" type="number" placeholder="Ex : 800"
                    value={form.prix_actuel} onChange={e => updateForm("prix_actuel", e.target.value)} />
                </div>
                <div>
                  <label>Revenus/mois (€)</label>
                  <input className="forge-input" type="number" placeholder="Ex : 2000"
                    value={form.revenus_actuels} onChange={e => updateForm("revenus_actuels", e.target.value)} />
                </div>
              </div>

              <div>
                <label>Objectif revenus/mois (€)</label>
                <input className="forge-input" type="number" placeholder="Ex : 10000"
                  value={form.objectif_revenus} onChange={e => updateForm("objectif_revenus", e.target.value)} />
              </div>
            </div>

            <div style={{ marginTop: "36px", display: "flex", justifyContent: "flex-end" }}>
              <button className="forge-btn" onClick={goToDeliverables}
                disabled={!canProceed()}>
                CHOISIR LE LIVRABLE →
              </button>
            </div>

            {!canProceed() && (
              <p style={{ fontSize: "10px", color: "#333", textAlign: "right", marginTop: "8px", letterSpacing: "1px" }}>
                * champs obligatoires
              </p>
            )}
          </div>
        )}

        {/* STEP 1 — LIVRABLE */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: "36px" }}>
              <h1 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "36px",
                letterSpacing: "4px",
                color: "#e8e0d0",
                margin: "0 0 8px 0",
              }}>QUEL LIVRABLE ?</h1>
              <p style={{ fontSize: "12px", color: "#444", margin: 0, letterSpacing: "1px" }}>
                Sélectionne le livrable à générer pour {form.prenom}.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
              {DELIVERABLES.map((d) => (
                <div key={d.id}
                  className={`del-card ${selectedDeliverable === d.id ? "selected" : ""}`}
                  onClick={() => setSelectedDeliverable(d.id)}>
                  <span style={{ fontSize: "18px", color: selectedDeliverable === d.id ? "#e05a00" : "#333", marginTop: "1px" }}>
                    {d.icon}
                  </span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "500", letterSpacing: "1px", marginBottom: "3px" }}>
                      {d.label}
                    </div>
                    <div style={{ fontSize: "11px", color: "#555", letterSpacing: "0.5px" }}>
                      {d.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div style={{ background: "#1a0000", border: "1px solid #400", borderRadius: "2px",
                padding: "12px 16px", marginBottom: "20px", fontSize: "12px", color: "#e05a00" }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button className="forge-btn-ghost" onClick={() => setStep(0)}>← RETOUR</button>
              <button className="forge-btn" onClick={generate}
                disabled={!selectedDeliverable || loading}>
                {loading ? (
                  <span className="pulse">GÉNÉRATION EN COURS...</span>
                ) : "GÉNÉRER →"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — RÉSULTAT */}
        {step === 2 && (
          <div>
            <div style={{ marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h1 style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "36px",
                  letterSpacing: "4px",
                  color: "#e8e0d0",
                  margin: "0 0 4px 0",
                }}>{selectedDel?.label?.toUpperCase()}</h1>
                <p style={{ fontSize: "11px", color: "#444", margin: 0, letterSpacing: "1px" }}>
                  Généré pour {form.prenom} · {form.niche}
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button className="forge-btn-ghost" onClick={copyResult}>
                  {copied ? "✓ COPIÉ" : "COPIER"}
                </button>
              </div>
            </div>

            <div className="result-block">
              <div className="result-content">{result}</div>
            </div>

            <div style={{ marginTop: "24px", display: "flex", gap: "12px", justifyContent: "space-between" }}>
              <button className="forge-btn-ghost" onClick={() => { setStep(1); setResult(""); }}>
                ← AUTRE LIVRABLE
              </button>
              <button className="forge-btn" onClick={reset}>
                NOUVEAU PROFIL
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: "1px solid #111",
        padding: "10px 32px",
        display: "flex",
        justifyContent: "space-between",
        background: "#0a0a0a",
      }}>
        <span style={{ fontSize: "9px", color: "#222", letterSpacing: "2px" }}>
          FORGE v0.1 · COAXIS GROWTH AGENCY
        </span>
        <span style={{ fontSize: "9px", color: "#222", letterSpacing: "2px" }}>
          USAGE INTERNE · SYSTEM 10K
        </span>
      </div>
    </div>
  );
}

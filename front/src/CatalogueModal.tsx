import { useState, type ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Service {
  id: string;
  nom: string;
  description: string;
  laptops: string[];
  applications_metier: string[];
}

interface Laptop {
  id: string;
  modele: string;
  processeur: string;
  ram: string;
  stockage: string;
  ecran: string;
  os: string;
  profil: string;
  services_cibles: string[];
}

interface Application {
  id: string;
  nom: string;
  editeur: string;
  type: string;
  licences: string;
  services_cibles: string[];
  contact_support: string;
}

interface OutilSupport {
  id: string;
  nom: string;
  type: string;
  description: string;
  url_intranet: string;
  acces: string;
}

interface CatalogueData {
  entreprise: string;
  secteur: string;
  services: Service[];
  materiel: {
    laptop_ordinaire: Laptop[];
    laptop_developpeur: Laptop[];
    laptop_luxe: Laptop[];
  };
  applications_metier: Application[];
  support: {
    materiel: string[];
    outils: OutilSupport[];
  };
}

type CatTab = 'general' | 'services' | 'materiel' | 'apps' | 'outils';
type MatSubTab = 'ordinaire' | 'developpeur' | 'luxe';

interface Props {
  initialContent: string;
  onSave: (content: string) => Promise<void>;
  onClose: () => void;
}

const emptyService  = (): Service      => ({ id: '', nom: '', description: '', laptops: [], applications_metier: [] });
const emptyLaptop   = (): Laptop       => ({ id: '', modele: '', processeur: '', ram: '', stockage: '', ecran: '', os: '', profil: '', services_cibles: [] });
const emptyApp      = (): Application  => ({ id: '', nom: '', editeur: '', type: '', licences: '', services_cibles: [], contact_support: '' });
const emptyOutil    = (): OutilSupport => ({ id: '', nom: '', type: '', description: '', url_intranet: '', acces: '' });

function toggleArr(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
}

// ── Micro-composants ──────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="cat-field">
      <label className="cat-field-label">{label}</label>
      {children}
    </div>
  );
}

function CheckboxList({
  options,
  selected,
  onChange,
}: {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="cat-checkbox-list">
      {options.length === 0 && (
        <span className="cat-checkbox-empty">Aucune option disponible</span>
      )}
      {options.map(opt => (
        <label key={opt.value} className="cat-checkbox-item">
          <input
            type="checkbox"
            checked={selected.includes(opt.value)}
            onChange={() => onChange(toggleArr(selected, opt.value))}
          />
          <span className="cat-checkbox-id">{opt.value}</span>
          {opt.label !== opt.value && (
            <span className="cat-checkbox-label"> — {opt.label}</span>
          )}
        </label>
      ))}
    </div>
  );
}

// ── Formulaires par entité ────────────────────────────────────────────────────

function ServiceForm({
  data, isNew, allLaptopIds, allAppIds, onChange, onValidate, onCancel,
}: {
  data: Service; isNew: boolean;
  allLaptopIds: { value: string; label: string }[];
  allAppIds: { value: string; label: string }[];
  onChange: (d: Service) => void; onValidate: () => void; onCancel: () => void;
}) {
  return (
    <div className="cat-form">
      <Field label="ID (ex : IT, MKT, RH)">
        <input className="admin-input" value={data.id} readOnly={!isNew}
          onChange={e => onChange({ ...data, id: e.target.value.toUpperCase() })}
          placeholder="IT" />
      </Field>
      <Field label="Nom">
        <input className="admin-input" value={data.nom}
          onChange={e => onChange({ ...data, nom: e.target.value })}
          placeholder="Informatique" />
      </Field>
      <Field label="Description">
        <input className="admin-input" value={data.description}
          onChange={e => onChange({ ...data, description: e.target.value })}
          placeholder="Infrastructure, support, cybersécurité..." />
      </Field>
      <Field label="Laptops attribués">
        <CheckboxList options={allLaptopIds} selected={data.laptops}
          onChange={v => onChange({ ...data, laptops: v })} />
      </Field>
      <Field label="Applications métier">
        <CheckboxList options={allAppIds} selected={data.applications_metier}
          onChange={v => onChange({ ...data, applications_metier: v })} />
      </Field>
      <div className="cat-form-actions">
        <button className="btn-save" onClick={onValidate}>Valider</button>
        <button className="btn-doc-cancel" onClick={onCancel}>Annuler</button>
      </div>
    </div>
  );
}

function LaptopForm({
  data, isNew, allServiceIds, onChange, onValidate, onCancel,
}: {
  data: Laptop; isNew: boolean;
  allServiceIds: { value: string; label: string }[];
  onChange: (d: Laptop) => void; onValidate: () => void; onCancel: () => void;
}) {
  return (
    <div className="cat-form">
      <Field label="ID (ex : LPT-STD-005)">
        <input className="admin-input" value={data.id} readOnly={!isNew}
          onChange={e => onChange({ ...data, id: e.target.value.toUpperCase() })}
          placeholder="LPT-STD-005" />
      </Field>
      <Field label="Modèle">
        <input className="admin-input" value={data.modele}
          onChange={e => onChange({ ...data, modele: e.target.value })}
          placeholder="Lenovo ThinkPad E16..." />
      </Field>
      <Field label="Processeur">
        <input className="admin-input" value={data.processeur}
          onChange={e => onChange({ ...data, processeur: e.target.value })}
          placeholder="Intel Core i5-1335U" />
      </Field>
      <div className="cat-form-row">
        <Field label="RAM">
          <input className="admin-input" value={data.ram}
            onChange={e => onChange({ ...data, ram: e.target.value })}
            placeholder="16 Go" />
        </Field>
        <Field label="Stockage">
          <input className="admin-input" value={data.stockage}
            onChange={e => onChange({ ...data, stockage: e.target.value })}
            placeholder="512 Go SSD NVMe" />
        </Field>
      </div>
      <Field label="Écran">
        <input className="admin-input" value={data.ecran}
          onChange={e => onChange({ ...data, ecran: e.target.value })}
          placeholder='14" FHD IPS' />
      </Field>
      <Field label="OS">
        <input className="admin-input" value={data.os}
          onChange={e => onChange({ ...data, os: e.target.value })}
          placeholder="Windows 11 Pro" />
      </Field>
      <Field label="Profil">
        <input className="admin-input" value={data.profil}
          onChange={e => onChange({ ...data, profil: e.target.value })}
          placeholder="Collaborateur standard" />
      </Field>
      <Field label="Services cibles">
        <CheckboxList options={allServiceIds} selected={data.services_cibles}
          onChange={v => onChange({ ...data, services_cibles: v })} />
      </Field>
      <div className="cat-form-actions">
        <button className="btn-save" onClick={onValidate}>Valider</button>
        <button className="btn-doc-cancel" onClick={onCancel}>Annuler</button>
      </div>
    </div>
  );
}

function AppForm({
  data, isNew, allServiceIds, onChange, onValidate, onCancel,
}: {
  data: Application; isNew: boolean;
  allServiceIds: { value: string; label: string }[];
  onChange: (d: Application) => void; onValidate: () => void; onCancel: () => void;
}) {
  return (
    <div className="cat-form">
      <Field label="ID (ex : APP-030)">
        <input className="admin-input" value={data.id} readOnly={!isNew}
          onChange={e => onChange({ ...data, id: e.target.value.toUpperCase() })}
          placeholder="APP-030" />
      </Field>
      <Field label="Nom">
        <input className="admin-input" value={data.nom}
          onChange={e => onChange({ ...data, nom: e.target.value })}
          placeholder="Bloomberg Terminal" />
      </Field>
      <Field label="Éditeur">
        <input className="admin-input" value={data.editeur}
          onChange={e => onChange({ ...data, editeur: e.target.value })}
          placeholder="Bloomberg LP" />
      </Field>
      <Field label="Type">
        <input className="admin-input" value={data.type}
          onChange={e => onChange({ ...data, type: e.target.value })}
          placeholder="Données financières temps réel" />
      </Field>
      <Field label="Licences">
        <input className="admin-input" value={data.licences}
          onChange={e => onChange({ ...data, licences: e.target.value })}
          placeholder="Nominatives — 45 licences actives" />
      </Field>
      <Field label="Services cibles">
        <CheckboxList options={allServiceIds} selected={data.services_cibles}
          onChange={v => onChange({ ...data, services_cibles: v })} />
      </Field>
      <Field label="Contact support">
        <input className="admin-input" value={data.contact_support}
          onChange={e => onChange({ ...data, contact_support: e.target.value })}
          placeholder="Bloomberg Anywhere Help Desk" />
      </Field>
      <div className="cat-form-actions">
        <button className="btn-save" onClick={onValidate}>Valider</button>
        <button className="btn-doc-cancel" onClick={onCancel}>Annuler</button>
      </div>
    </div>
  );
}

function OutilForm({
  data, isNew, onChange, onValidate, onCancel,
}: {
  data: OutilSupport; isNew: boolean;
  onChange: (d: OutilSupport) => void; onValidate: () => void; onCancel: () => void;
}) {
  return (
    <div className="cat-form">
      <Field label="ID (ex : SUP-OTL-012)">
        <input className="admin-input" value={data.id} readOnly={!isNew}
          onChange={e => onChange({ ...data, id: e.target.value.toUpperCase() })}
          placeholder="SUP-OTL-012" />
      </Field>
      <Field label="Nom">
        <input className="admin-input" value={data.nom}
          onChange={e => onChange({ ...data, nom: e.target.value })}
          placeholder="Portail ITSM — ServiceNow" />
      </Field>
      <Field label="Type">
        <input className="admin-input" value={data.type}
          onChange={e => onChange({ ...data, type: e.target.value })}
          placeholder="Application Intranet" />
      </Field>
      <Field label="Description">
        <textarea className="admin-textarea" rows={3} value={data.description}
          onChange={e => onChange({ ...data, description: e.target.value })}
          placeholder="Portail principal d'ouverture de tickets..." />
      </Field>
      <Field label="URL / Accès intranet">
        <input className="admin-input" value={data.url_intranet}
          onChange={e => onChange({ ...data, url_intranet: e.target.value })}
          placeholder="https://fincorp.service-now.com" />
      </Field>
      <Field label="Accès requis">
        <input className="admin-input" value={data.acces}
          onChange={e => onChange({ ...data, acces: e.target.value })}
          placeholder="Tous collaborateurs — SSO" />
      </Field>
      <div className="cat-form-actions">
        <button className="btn-save" onClick={onValidate}>Valider</button>
        <button className="btn-doc-cancel" onClick={onCancel}>Annuler</button>
      </div>
    </div>
  );
}

// ── CatalogueModal ────────────────────────────────────────────────────────────

export default function CatalogueModal({ initialContent, onSave, onClose }: Props) {
  const [data, setData] = useState<CatalogueData>(() => {
    try { return JSON.parse(initialContent); }
    catch {
      return {
        entreprise: '', secteur: '', services: [],
        materiel: { laptop_ordinaire: [], laptop_developpeur: [], laptop_luxe: [] },
        applications_metier: [], support: { materiel: [], outils: [] },
      };
    }
  });

  const [activeTab, setActiveTab]   = useState<CatTab>('services');
  const [matSubTab, setMatSubTab]   = useState<MatSubTab>('ordinaire');
  const [saving, setSaving]         = useState(false);
  const [saveMsg, setSaveMsg]       = useState('');

  // États d'édition (un jeu par type d'entité — null = rien, -1 = ajout)
  const [editSvcIdx, setEditSvcIdx]     = useState<number | null>(null);
  const [editSvcData, setEditSvcData]   = useState<Service | null>(null);

  const [editLptIdx, setEditLptIdx]     = useState<number | null>(null);
  const [editLptData, setEditLptData]   = useState<Laptop | null>(null);

  const [editAppIdx, setEditAppIdx]     = useState<number | null>(null);
  const [editAppData, setEditAppData]   = useState<Application | null>(null);

  const [editOutilIdx, setEditOutilIdx] = useState<number | null>(null);
  const [editOutilData, setEditOutilData] = useState<OutilSupport | null>(null);

  // Listes dérivées pour les checkboxes
  const allLaptopIds = [
    ...data.materiel.laptop_ordinaire,
    ...data.materiel.laptop_developpeur,
    ...data.materiel.laptop_luxe,
  ].map(l => ({ value: l.id, label: l.modele }));

  const allAppIds      = data.applications_metier.map(a => ({ value: a.id, label: a.nom }));
  const allServiceIds  = data.services.map(s => ({ value: s.id, label: s.nom }));

  const matKey: Record<MatSubTab, keyof CatalogueData['materiel']> = {
    ordinaire:   'laptop_ordinaire',
    developpeur: 'laptop_developpeur',
    luxe:        'laptop_luxe',
  };
  const currentLaptops = data.materiel[matKey[matSubTab]];

  // ── Sauvegarde ────────────────────────────────────────────────────────────
  async function handleSave() {
    setSaving(true);
    setSaveMsg('Enregistrement et réindexation en cours...');
    try {
      await onSave(JSON.stringify(data, null, 2));
      setSaveMsg('✅ Réindexation terminée.');
    } catch (e) {
      setSaveMsg(`Erreur : ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setSaving(false);
    }
  }

  // ── CRUD Services ─────────────────────────────────────────────────────────
  const cancelSvc = () => { setEditSvcIdx(null); setEditSvcData(null); };

  function startEditSvc(idx: number) {
    const s = data.services[idx];
    setEditSvcIdx(idx);
    setEditSvcData({ ...s, laptops: [...s.laptops], applications_metier: [...s.applications_metier] });
  }

  function validateSvc() {
    if (!editSvcData?.id.trim() || !editSvcData.nom.trim()) return;
    if (editSvcIdx === -1) {
      setData(d => ({ ...d, services: [...d.services, editSvcData!] }));
    } else {
      setData(d => ({ ...d, services: d.services.map((s, i) => i === editSvcIdx ? editSvcData! : s) }));
    }
    cancelSvc();
  }

  function deleteSvc(idx: number) {
    setData(d => ({ ...d, services: d.services.filter((_, i) => i !== idx) }));
    if (editSvcIdx === idx) cancelSvc();
  }

  // ── CRUD Laptops ──────────────────────────────────────────────────────────
  const cancelLpt = () => { setEditLptIdx(null); setEditLptData(null); };

  function startEditLpt(idx: number) {
    const l = currentLaptops[idx];
    setEditLptIdx(idx);
    setEditLptData({ ...l, services_cibles: [...l.services_cibles] });
  }

  function validateLpt() {
    if (!editLptData?.id.trim() || !editLptData.modele.trim()) return;
    const key = matKey[matSubTab];
    if (editLptIdx === -1) {
      setData(d => ({ ...d, materiel: { ...d.materiel, [key]: [...d.materiel[key], editLptData!] } }));
    } else {
      setData(d => ({
        ...d,
        materiel: { ...d.materiel, [key]: d.materiel[key].map((l, i) => i === editLptIdx ? editLptData! : l) },
      }));
    }
    cancelLpt();
  }

  function deleteLpt(idx: number) {
    const key = matKey[matSubTab];
    setData(d => ({ ...d, materiel: { ...d.materiel, [key]: d.materiel[key].filter((_, i) => i !== idx) } }));
    if (editLptIdx === idx) cancelLpt();
  }

  // ── CRUD Applications ─────────────────────────────────────────────────────
  const cancelApp = () => { setEditAppIdx(null); setEditAppData(null); };

  function startEditApp(idx: number) {
    const a = data.applications_metier[idx];
    setEditAppIdx(idx);
    setEditAppData({ ...a, services_cibles: [...a.services_cibles] });
  }

  function validateApp() {
    if (!editAppData?.id.trim() || !editAppData.nom.trim()) return;
    if (editAppIdx === -1) {
      setData(d => ({ ...d, applications_metier: [...d.applications_metier, editAppData!] }));
    } else {
      setData(d => ({
        ...d,
        applications_metier: d.applications_metier.map((a, i) => i === editAppIdx ? editAppData! : a),
      }));
    }
    cancelApp();
  }

  function deleteApp(idx: number) {
    setData(d => ({ ...d, applications_metier: d.applications_metier.filter((_, i) => i !== idx) }));
    if (editAppIdx === idx) cancelApp();
  }

  // ── CRUD Outils support ───────────────────────────────────────────────────
  const cancelOutil = () => { setEditOutilIdx(null); setEditOutilData(null); };

  function startEditOutil(idx: number) {
    setEditOutilIdx(idx);
    setEditOutilData({ ...data.support.outils[idx] });
  }

  function validateOutil() {
    if (!editOutilData?.id.trim() || !editOutilData.nom.trim()) return;
    if (editOutilIdx === -1) {
      setData(d => ({ ...d, support: { ...d.support, outils: [...d.support.outils, editOutilData!] } }));
    } else {
      setData(d => ({
        ...d,
        support: { ...d.support, outils: d.support.outils.map((o, i) => i === editOutilIdx ? editOutilData! : o) },
      }));
    }
    cancelOutil();
  }

  function deleteOutil(idx: number) {
    setData(d => ({ ...d, support: { ...d.support, outils: d.support.outils.filter((_, i) => i !== idx) } }));
    if (editOutilIdx === idx) cancelOutil();
  }

  // ── Onglets ───────────────────────────────────────────────────────────────
  const lptCount = data.materiel.laptop_ordinaire.length
    + data.materiel.laptop_developpeur.length
    + data.materiel.laptop_luxe.length;

  const tabs: { key: CatTab; label: string }[] = [
    { key: 'general',  label: 'Général' },
    { key: 'services', label: `Services (${data.services.length})` },
    { key: 'materiel', label: `Matériel (${lptCount})` },
    { key: 'apps',     label: `Applications (${data.applications_metier.length})` },
    { key: 'outils',   label: `Outils (${data.support.outils.length})` },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="modal-overlay cat-modal-overlay" onClick={onClose}>
      <div className="modal-card catalogue-modal-card" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <span className="modal-title">📋 Éditeur du catalogue IT</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="cat-tabs">
          {tabs.map(t => (
            <button
              key={t.key}
              className={`cat-tab ${activeTab === t.key ? 'cat-tab--active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="cat-body">

          {/* ── Général ──────────────────────────────────────────────────── */}
          {activeTab === 'general' && (
            <div className="cat-tab-content">
              <Field label="Entreprise">
                <input className="admin-input" value={data.entreprise}
                  onChange={e => setData(d => ({ ...d, entreprise: e.target.value }))} />
              </Field>
              <Field label="Secteur">
                <input className="admin-input" value={data.secteur}
                  onChange={e => setData(d => ({ ...d, secteur: e.target.value }))} />
              </Field>
            </div>
          )}

          {/* ── Services ─────────────────────────────────────────────────── */}
          {activeTab === 'services' && (
            <div className="cat-tab-content">
              <ul className="cat-list">
                {data.services.map((svc, i) => (
                  <li key={svc.id} className={`cat-list-item ${editSvcIdx === i ? 'cat-list-item--active' : ''}`}>
                    <div className="cat-list-row">
                      <span className="cat-list-id">{svc.id}</span>
                      <span className="cat-list-name">{svc.nom}</span>
                      <div className="cat-list-actions">
                        <button className="btn-cat-edit"
                          onClick={() => editSvcIdx === i ? cancelSvc() : startEditSvc(i)}>
                          {editSvcIdx === i ? 'Fermer' : 'Modifier'}
                        </button>
                        <button className="btn-cat-delete" onClick={() => deleteSvc(i)}>Supprimer</button>
                      </div>
                    </div>
                    {editSvcIdx === i && editSvcData && (
                      <ServiceForm data={editSvcData} isNew={false}
                        allLaptopIds={allLaptopIds} allAppIds={allAppIds}
                        onChange={setEditSvcData} onValidate={validateSvc} onCancel={cancelSvc} />
                    )}
                  </li>
                ))}
              </ul>
              {editSvcIdx === -1 && editSvcData ? (
                <div className="cat-add-form">
                  <div className="cat-add-title">Nouveau service</div>
                  <ServiceForm data={editSvcData} isNew={true}
                    allLaptopIds={allLaptopIds} allAppIds={allAppIds}
                    onChange={setEditSvcData} onValidate={validateSvc} onCancel={cancelSvc} />
                </div>
              ) : (
                <button className="btn-cat-add" disabled={editSvcIdx !== null}
                  onClick={() => { setEditSvcIdx(-1); setEditSvcData(emptyService()); }}>
                  + Ajouter un service
                </button>
              )}
            </div>
          )}

          {/* ── Matériel ─────────────────────────────────────────────────── */}
          {activeTab === 'materiel' && (
            <div className="cat-tab-content">
              <div className="cat-subtabs">
                {([
                  ['ordinaire',   'Standard',    data.materiel.laptop_ordinaire.length],
                  ['developpeur', 'Développeur', data.materiel.laptop_developpeur.length],
                  ['luxe',        'Luxe',        data.materiel.laptop_luxe.length],
                ] as [MatSubTab, string, number][]).map(([key, label, count]) => (
                  <button key={key}
                    className={`cat-subtab ${matSubTab === key ? 'cat-subtab--active' : ''}`}
                    onClick={() => { setMatSubTab(key); cancelLpt(); }}>
                    {label} ({count})
                  </button>
                ))}
              </div>
              <ul className="cat-list">
                {currentLaptops.map((lpt, i) => (
                  <li key={lpt.id} className={`cat-list-item ${editLptIdx === i ? 'cat-list-item--active' : ''}`}>
                    <div className="cat-list-row">
                      <span className="cat-list-id">{lpt.id}</span>
                      <span className="cat-list-name">{lpt.modele}</span>
                      <div className="cat-list-actions">
                        <button className="btn-cat-edit"
                          onClick={() => editLptIdx === i ? cancelLpt() : startEditLpt(i)}>
                          {editLptIdx === i ? 'Fermer' : 'Modifier'}
                        </button>
                        <button className="btn-cat-delete" onClick={() => deleteLpt(i)}>Supprimer</button>
                      </div>
                    </div>
                    {editLptIdx === i && editLptData && (
                      <LaptopForm data={editLptData} isNew={false} allServiceIds={allServiceIds}
                        onChange={setEditLptData} onValidate={validateLpt} onCancel={cancelLpt} />
                    )}
                  </li>
                ))}
              </ul>
              {editLptIdx === -1 && editLptData ? (
                <div className="cat-add-form">
                  <div className="cat-add-title">Nouveau laptop — {matSubTab}</div>
                  <LaptopForm data={editLptData} isNew={true} allServiceIds={allServiceIds}
                    onChange={setEditLptData} onValidate={validateLpt} onCancel={cancelLpt} />
                </div>
              ) : (
                <button className="btn-cat-add" disabled={editLptIdx !== null}
                  onClick={() => { setEditLptIdx(-1); setEditLptData(emptyLaptop()); }}>
                  + Ajouter un laptop
                </button>
              )}
            </div>
          )}

          {/* ── Applications ──────────────────────────────────────────────── */}
          {activeTab === 'apps' && (
            <div className="cat-tab-content">
              <ul className="cat-list">
                {data.applications_metier.map((app, i) => (
                  <li key={app.id} className={`cat-list-item ${editAppIdx === i ? 'cat-list-item--active' : ''}`}>
                    <div className="cat-list-row">
                      <span className="cat-list-id">{app.id}</span>
                      <span className="cat-list-name">{app.nom}</span>
                      <div className="cat-list-actions">
                        <button className="btn-cat-edit"
                          onClick={() => editAppIdx === i ? cancelApp() : startEditApp(i)}>
                          {editAppIdx === i ? 'Fermer' : 'Modifier'}
                        </button>
                        <button className="btn-cat-delete" onClick={() => deleteApp(i)}>Supprimer</button>
                      </div>
                    </div>
                    {editAppIdx === i && editAppData && (
                      <AppForm data={editAppData} isNew={false} allServiceIds={allServiceIds}
                        onChange={setEditAppData} onValidate={validateApp} onCancel={cancelApp} />
                    )}
                  </li>
                ))}
              </ul>
              {editAppIdx === -1 && editAppData ? (
                <div className="cat-add-form">
                  <div className="cat-add-title">Nouvelle application</div>
                  <AppForm data={editAppData} isNew={true} allServiceIds={allServiceIds}
                    onChange={setEditAppData} onValidate={validateApp} onCancel={cancelApp} />
                </div>
              ) : (
                <button className="btn-cat-add" disabled={editAppIdx !== null}
                  onClick={() => { setEditAppIdx(-1); setEditAppData(emptyApp()); }}>
                  + Ajouter une application
                </button>
              )}
            </div>
          )}

          {/* ── Outils support ────────────────────────────────────────────── */}
          {activeTab === 'outils' && (
            <div className="cat-tab-content">
              <ul className="cat-list">
                {data.support.outils.map((outil, i) => (
                  <li key={outil.id} className={`cat-list-item ${editOutilIdx === i ? 'cat-list-item--active' : ''}`}>
                    <div className="cat-list-row">
                      <span className="cat-list-id">{outil.id}</span>
                      <span className="cat-list-name">{outil.nom}</span>
                      <div className="cat-list-actions">
                        <button className="btn-cat-edit"
                          onClick={() => editOutilIdx === i ? cancelOutil() : startEditOutil(i)}>
                          {editOutilIdx === i ? 'Fermer' : 'Modifier'}
                        </button>
                        <button className="btn-cat-delete" onClick={() => deleteOutil(i)}>Supprimer</button>
                      </div>
                    </div>
                    {editOutilIdx === i && editOutilData && (
                      <OutilForm data={editOutilData} isNew={false}
                        onChange={setEditOutilData} onValidate={validateOutil} onCancel={cancelOutil} />
                    )}
                  </li>
                ))}
              </ul>
              {editOutilIdx === -1 && editOutilData ? (
                <div className="cat-add-form">
                  <div className="cat-add-title">Nouvel outil support</div>
                  <OutilForm data={editOutilData} isNew={true}
                    onChange={setEditOutilData} onValidate={validateOutil} onCancel={cancelOutil} />
                </div>
              ) : (
                <button className="btn-cat-add" disabled={editOutilIdx !== null}
                  onClick={() => { setEditOutilIdx(-1); setEditOutilData(emptyOutil()); }}>
                  + Ajouter un outil
                </button>
              )}
            </div>
          )}

        </div>

        <div className="admin-modal-footer cat-footer">
          <div className="cat-footer-save">
            <button className="btn-save" onClick={handleSave} disabled={saving}>
              {saving ? 'Sauvegarde...' : 'Sauvegarder et réindexer'}
            </button>
            {saveMsg && <span className="admin-msg">{saveMsg}</span>}
          </div>
          <button className="btn-admin-close" onClick={onClose}>Fermer</button>
        </div>

      </div>
    </div>
  );
}

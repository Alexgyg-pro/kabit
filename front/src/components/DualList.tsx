import { useState } from 'react';

export interface DualListItem {
  value: string;
  label: string;
}

interface Props {
  all: DualListItem[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function DualList({ all, selected, onChange }: Props) {
  const [leftSel,    setLeftSel]    = useState<string[]>([]);
  const [rightSel,   setRightSel]   = useState<string[]>([]);
  const [leftFilter, setLeftFilter] = useState('');
  const [rightFilter,setRightFilter]= useState('');

  const available     = all.filter(i => !selected.includes(i.value));
  const selectedItems = selected.map(v => all.find(i => i.value === v) ?? { value: v, label: v });

  const filtLeft  = available.filter(i =>
    i.value.toLowerCase().includes(leftFilter.toLowerCase()) ||
    i.label.toLowerCase().includes(leftFilter.toLowerCase())
  );
  const filtRight = selectedItems.filter(i =>
    i.value.toLowerCase().includes(rightFilter.toLowerCase()) ||
    i.label.toLowerCase().includes(rightFilter.toLowerCase())
  );

  const toggleL = (v: string) => setLeftSel(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);
  const toggleR = (v: string) => setRightSel(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

  function addSelection() {
    if (!leftSel.length) return;
    onChange([...selected, ...leftSel.filter(v => !selected.includes(v))]);
    setLeftSel([]);
  }
  function addAll() {
    onChange([...selected, ...available.map(i => i.value)]);
    setLeftSel([]);
  }
  function removeSelection() {
    if (!rightSel.length) return;
    onChange(selected.filter(v => !rightSel.includes(v)));
    setRightSel([]);
  }
  function removeAll() {
    onChange([]);
    setRightSel([]);
  }

  return (
    <div className="dual-list">

      {/* ── Panneau gauche : disponible ─────────────────────────────── */}
      <div className="dual-list-panel">
        <div className="dual-list-header">Disponible ({available.length})</div>
        <input
          className="dual-list-filter"
          placeholder="Filtrer..."
          value={leftFilter}
          onChange={e => setLeftFilter(e.target.value)}
        />
        <ul className="dual-list-ul">
          {filtLeft.map(item => (
            <li
              key={item.value}
              className={`dual-list-item ${leftSel.includes(item.value) ? 'dual-list-item--sel' : ''}`}
              onClick={() => toggleL(item.value)}
              onDoubleClick={() => {
                onChange([...selected, item.value]);
                setLeftSel(s => s.filter(v => v !== item.value));
              }}
            >
              <span className="dual-list-id">{item.value}</span>
              {item.label !== item.value && (
                <span className="dual-list-name"> — {item.label}</span>
              )}
            </li>
          ))}
          {filtLeft.length === 0 && (
            <li className="dual-list-empty">
              {leftFilter ? 'Aucun résultat' : 'Tous ajoutés'}
            </li>
          )}
        </ul>
      </div>

      {/* ── Boutons ─────────────────────────────────────────────────── */}
      <div className="dual-list-controls">
        <button className="btn-dual" onClick={addAll}         title="Tout ajouter"          disabled={!available.length}>&#xBB;</button>
        <button className="btn-dual" onClick={addSelection}   title="Ajouter la sélection"  disabled={!leftSel.length}>&#x203A;</button>
        <button className="btn-dual" onClick={removeSelection} title="Retirer la sélection" disabled={!rightSel.length}>&#x2039;</button>
        <button className="btn-dual" onClick={removeAll}      title="Tout retirer"           disabled={!selected.length}>&#xAB;</button>
      </div>

      {/* ── Panneau droit : sélectionné ─────────────────────────────── */}
      <div className="dual-list-panel">
        <div className="dual-list-header">Sélectionné ({selectedItems.length})</div>
        <input
          className="dual-list-filter"
          placeholder="Filtrer..."
          value={rightFilter}
          onChange={e => setRightFilter(e.target.value)}
        />
        <ul className="dual-list-ul">
          {filtRight.map(item => (
            <li
              key={item.value}
              className={`dual-list-item ${rightSel.includes(item.value) ? 'dual-list-item--sel' : ''}`}
              onClick={() => toggleR(item.value)}
              onDoubleClick={() => {
                onChange(selected.filter(v => v !== item.value));
                setRightSel(s => s.filter(v => v !== item.value));
              }}
            >
              <span className="dual-list-id">{item.value}</span>
              {item.label !== item.value && (
                <span className="dual-list-name"> — {item.label}</span>
              )}
            </li>
          ))}
          {filtRight.length === 0 && (
            <li className="dual-list-empty">
              {rightFilter ? 'Aucun résultat' : 'Aucun sélectionné'}
            </li>
          )}
        </ul>
      </div>

    </div>
  );
}

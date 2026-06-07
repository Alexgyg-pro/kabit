import { useState } from 'react';

interface CorpusFile {
  path: string;
  title: string;
}

interface Props {
  files: CorpusFile[];
  onSelect: (path: string, title: string) => void;
}

export default function CorpusFileList({ files, onSelect }: Props) {
  const [search, setSearch] = useState('');

  if (files.length === 0) {
    return <p className="admin-section-desc">Aucune fiche .md dans le corpus.</p>;
  }

  const filtered = files.filter((f) =>
    f.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <input
        type="text"
        placeholder="Rechercher une fiche..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="admin-input corpus-search"
      />
      <ul className="corpus-file-list">
        {filtered.map((file) => (
          <li
            key={file.path}
            className="corpus-file-item"
            onClick={() => onSelect(file.path, file.title)}
          >
            <span className="corpus-file-icon">📄</span>
            <span className="corpus-file-title">{file.title}</span>
            <span className="corpus-file-path">{file.path}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

import { Search } from "lucide-react";

type ListToolbarProps = { placeholder: string; options?: string[] };

export function ListToolbar({ placeholder, options = [] }: ListToolbarProps) {
  return (
    <div className="toolbar">
      <label className="search-box"><span className="sr-only">Buscar</span><Search aria-hidden="true" /><input className="input" placeholder={placeholder} type="search" /></label>
      {options.length > 0 ? (
        <select className="select" aria-label="Filtrar por status" defaultValue="todos">
          <option value="todos">Todos os status</option>
          {options.map((option) => <option value={option} key={option}>{option}</option>)}
        </select>
      ) : null}
    </div>
  );
}

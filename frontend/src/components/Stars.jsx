export default function Stars({ value, onChange }) {
  return (
    <div className="stars" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} role="radio" aria-checked={value === n} tabIndex={0}
          className={n <= value ? 'active' : ''}
          onClick={() => onChange(n)}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onChange(n)}>★</span>
      ))}
    </div>
  );
}

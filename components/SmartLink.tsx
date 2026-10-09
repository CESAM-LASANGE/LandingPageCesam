import type { ReactNode } from 'react';
import type { Link } from '@/content/site';

type Props = { link: Link; className?: string; children?: ReactNode };

/**
 * Renderiza um link quando o destino existe. Sem destino, mostra o rótulo como texto
 * marcado como pendente, para nunca publicar `href="#"` (SPEC-001, AC-01).
 */
export function SmartLink({ link, className, children }: Props) {
  const content = children ?? link.label;
  if (!link.href) {
    return (
      <span
        className={['pending-link', className].filter(Boolean).join(' ')}
        data-pending-link=""
        title="Link a definir"
      >
        {content}
      </span>
    );
  }
  const external = link.external ?? /^https?:\/\//.test(link.href);
  return (
    <a href={link.href} className={className} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {content}
      {external && <span className="visually-hidden"> (abre em nova aba)</span>}
    </a>
  );
}

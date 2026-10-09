import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="section">
      <div className="container stack">
        <p className="eyebrow">Erro 404</p>
        <h1 className="h2">Página não encontrada</h1>
        <p className="lead">O endereço acessado não existe ou foi movido.</p>
        <p>
          <Link href="/" className="btn btn--primary">
            Voltar para a página inicial
          </Link>
        </p>
      </div>
    </main>
  );
}

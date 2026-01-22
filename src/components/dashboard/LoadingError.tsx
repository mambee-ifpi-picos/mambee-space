interface LoadingErrorProps {
  error: string | null;
  loading: boolean;
}

export function LoadingError({ error, loading }: LoadingErrorProps) {
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (loading) return <p className="p-4">Carregando...</p>;
  return null;
}

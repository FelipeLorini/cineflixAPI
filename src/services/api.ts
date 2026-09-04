// Configuração central da API TMDB (axios) com cache de 5 minutos.
import axios from "axios";

export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_API_KEY = "328e30d97723b14cb927d5adfc722139";
export const IMG_BASE = "https://image.tmdb.org/t/p";

export const api = axios.create({
  baseURL: TMDB_BASE_URL,
  params: { api_key: TMDB_API_KEY, language: "pt-BR" },
  timeout: 15000,
});

/** Cache simples em memória: 5 minutos por chave (url + params). */
const CACHE_TTL = 5 * 60 * 1000;
const cache = new Map<string, { at: number; data: unknown }>();

export async function getCached<T>(
  url: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  const key = url + JSON.stringify(params);
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL) return hit.data as T;

  try {
    const { data } = await api.get<T>(url, { params });
    cache.set(key, { at: Date.now(), data });
    return data;
  } catch (err) {
    // Mensagem amigável em português
    const status = axios.isAxiosError(err) ? err.response?.status : undefined;
    if (status === 404) throw new Error("Conteúdo não encontrado no TMDB.");
    throw new Error(
      "Não foi possível carregar os dados dos filmes. Verifique sua conexão e tente novamente.",
    );
  }
}

export const imageUrl = (
  path: string | null | undefined,
  size: "w200" | "w300" | "w500" | "w780" | "original" = "w500",
) => (path ? `${IMG_BASE}/${size}${path}` : null);

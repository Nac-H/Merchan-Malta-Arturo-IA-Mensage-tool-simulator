import fetch from "node-fetch";
import fs from "node:fs/promises";

export async function getResource(instructir: string): Promise<string> {
  // Si es una URL remota (http/https)
  if (/^https?:\/\//.test(instructir)) {
    const res = await fetch(instructir);
    if (!res.ok) throw new Error(`Error al obtener la URL: ${res.statusText}`);
    return await res.text();
  }

  // Si es un URI de archivo local (file://)
  if (/^file:\/\//.test(instructir)) {
    const filePath = instructir.replace(/^file:\/\//, "");
    return await fs.readFile(filePath, "utf-8");
  }

  // Si es una ruta local relativa o absoluta
  if (/^[./~]/.test(instructir)) {
    return await fs.readFile(instructir, "utf-8");
  }

  // Si es texto directo
  return instructir;
}

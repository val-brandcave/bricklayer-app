/* eslint-disable @typescript-eslint/no-unused-vars */
import type { DataAdapter } from "./types";

/* Stubbed until real devs implement it. Every method throws except seed()
   (no-op) so the app never silently runs against an unimplemented backend.
   Swapping to real APIs changes ZERO UI code — only this file + the env var.

   When ready:
   const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_BASE_URL }); */

const NOT_IMPL = "API adapter not implemented — set NEXT_PUBLIC_DATA_SOURCE=mock";

export const apiAdapter: DataAdapter = {
  async getAll<T>(_collection: string): Promise<T[]> {
    // return (await api.get(`/api/${_collection}`)).data;
    throw new Error(NOT_IMPL);
  },
  async getById<T>(_collection: string, _id: string): Promise<T | null> {
    // return (await api.get(`/api/${_collection}/${_id}`)).data;
    throw new Error(NOT_IMPL);
  },
  async getWhere<T>(_collection: string, _predicate: (item: T) => boolean): Promise<T[]> {
    // Convert predicate to query params for the real API.
    throw new Error(NOT_IMPL);
  },
  async create<T extends { id: string }>(_collection: string, _item: T): Promise<T> {
    // return (await api.post(`/api/${_collection}`, _item)).data;
    throw new Error(NOT_IMPL);
  },
  async createMany<T extends { id: string }>(_collection: string, _items: T[]): Promise<T[]> {
    // return (await api.post(`/api/${_collection}/bulk`, _items)).data;
    throw new Error(NOT_IMPL);
  },
  async update<T extends { id: string }>(
    _collection: string,
    _id: string,
    _partial: Partial<T>,
  ): Promise<T> {
    // return (await api.patch(`/api/${_collection}/${_id}`, _partial)).data;
    throw new Error(NOT_IMPL);
  },
  async remove(_collection: string, _id: string): Promise<void> {
    // await api.delete(`/api/${_collection}/${_id}`);
    throw new Error(NOT_IMPL);
  },
  async seed(): Promise<void> {
    // No-op — the server handles its own data.
  },
  async clear(): Promise<void> {
    throw new Error("API adapter does not support clear()");
  },
};

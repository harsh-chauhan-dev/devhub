// Supabase API Gateway Helper

import { supabase } from "./supabaseClient";

export const fetchAPI = async (table, options = {}) => {
  const { data, error } = await supabase.from(table).select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export default fetchAPI;

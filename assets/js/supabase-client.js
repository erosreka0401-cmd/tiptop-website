import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://wcfszajjrbnatabefnfh.supabase.co/rest/v1/";
const SUPABASE_PUBLISH_KEY = "sb_publishable_2DhrMmzUEsb3q-P9JRzrhQ_tVl7iJ1z";

const SUPABASE_PROJECT_URL = SUPABASE_URL.replace(/\/rest\/v1\/?$/, "");

export const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_PUBLISH_KEY);

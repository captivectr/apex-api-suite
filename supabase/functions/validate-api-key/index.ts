import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValidateRequest {
  apiKey: string;
  clientIP: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { apiKey, clientIP }: ValidateRequest = await req.json();

    console.log('Validating API key:', apiKey.substring(0, 8) + '...', 'for IP:', clientIP);

    // Get API key details
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from('api_keys')
      .select('id, plan, is_active, expires_at, request_count')
      .eq('key', apiKey)
      .single();

    if (apiKeyError || !apiKeyData) {
      console.error('API key not found:', apiKeyError);
      return new Response(
        JSON.stringify({ valid: false, error: 'Invalid API key' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401
        }
      );
    }

    // Check if active
    if (!apiKeyData.is_active) {
      console.error('API key is inactive');
      return new Response(
        JSON.stringify({ valid: false, error: 'API key is inactive' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401
        }
      );
    }

    // Check expiration
    if (apiKeyData.expires_at && new Date(apiKeyData.expires_at) < new Date()) {
      console.error('API key has expired');
      return new Response(
        JSON.stringify({ valid: false, error: 'API key has expired' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401
        }
      );
    }

    // Check IP whitelist
    const { data: whitelistData, error: whitelistError } = await supabase
      .from('whitelisted_ips')
      .select('ip_address')
      .eq('api_key_id', apiKeyData.id);

    if (whitelistError) {
      console.error('Error checking whitelist:', whitelistError);
      return new Response(
        JSON.stringify({ valid: false, error: 'Error validating IP' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      );
    }

    // If there are whitelisted IPs, check if client IP is in the list
    if (whitelistData && whitelistData.length > 0) {
      const isWhitelisted = whitelistData.some(w => w.ip_address === clientIP);
      if (!isWhitelisted) {
        console.error('IP not whitelisted:', clientIP);
        return new Response(
          JSON.stringify({ valid: false, error: 'IP not whitelisted' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 403
          }
        );
      }
    }

    // Update last used timestamp and request count
    await supabase
      .from('api_keys')
      .update({
        last_used_at: new Date().toISOString(),
        request_count: apiKeyData.request_count + 1
      })
      .eq('id', apiKeyData.id);

    console.log('API key validated successfully');
    return new Response(
      JSON.stringify({ 
        valid: true, 
        plan: apiKeyData.plan 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in validate-api-key function:', error);
    return new Response(
      JSON.stringify({ valid: false, error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

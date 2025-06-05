
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

// Comprehensive CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  console.log(`Function called with method: ${req.method}`);
  
  // Handle CORS preflight requests - this is critical for browser compatibility
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS preflight request");
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    // Verificar se a chave API existe
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY não está configurada no ambiente');
      throw new Error('OPENAI_API_KEY não está configurada no ambiente');
    }

    let reqBody;
    try {
      reqBody = await req.json();
    } catch (jsonError) {
      console.error('Erro ao analisar JSON da requisição:', jsonError);
      throw new Error('Formato de requisição inválido: JSON inválido');
    }

    const { prompt } = reqBody;

    if (!prompt || typeof prompt !== 'string') {
      console.error('Parâmetro prompt inválido:', prompt);
      throw new Error('O parâmetro "prompt" é obrigatório e deve ser uma string');
    }

    console.log(`Processando prompt: "${prompt.substring(0, 30)}..."`);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Você é um assistente Bot que conversa sobre livros e filmes de forma acolhedora e divertida. Responda de forma breve, amigável e sempre incentive boas leituras ou bons filmes. Se a pergunta não estiver relacionada ao tema, oriente o usuário para voltar a falar sobre livros ou filmes.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        let errorData;
        
        try {
          errorData = JSON.parse(errorBody);
        } catch (e) {
          errorData = { error: { message: 'Erro desconhecido na API da OpenAI' } };
        }
        
        console.error('Erro na API da OpenAI:', response.status, errorData);
        throw new Error(`Erro na API da OpenAI: ${response.status} - ${errorData.error?.message || 'Erro desconhecido'}`);
      }

      const data = await response.json();
      
      // Verificar se a resposta da API possui a estrutura esperada
      if (!data.choices || !data.choices[0]?.message?.content) {
        console.error('Resposta inesperada da API da OpenAI:', data);
        throw new Error('Formato de resposta da OpenAI inválido');
      }
      
      const generatedText = data.choices[0].message.content;

      console.log(`Resposta gerada (primeiros 30 chars): "${generatedText.substring(0, 30)}..."`);

      return new Response(JSON.stringify({ generatedText }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (apiError) {
      console.error('Erro na chamada da API da OpenAI:', apiError);
      throw new Error(`Erro na comunicação com OpenAI: ${apiError.message}`);
    }
  } catch (error) {
    console.error('Erro no processamento:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Erro desconhecido',
      details: 'Houve um erro ao processar a solicitação do bot'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

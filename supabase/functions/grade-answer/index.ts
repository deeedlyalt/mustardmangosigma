import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { question, expectedAnswer, userAnswer } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `Du är en biologilärare som rättar elevsvar på det svenska nationella provet i biologi (åk 9). 
Bedöm om elevens svar är tillräckligt nära det förväntade svaret. 
Svaret behöver inte vara exakt ordagrant – om eleven visar förståelse för konceptet, ge rätt.
Var rättvis men inte för sträng. Stavfel och informella formuleringar är ok om innebörden är korrekt.
Svara ALLTID i JSON-format: {"correct": true/false, "feedback": "kort förklaring på svenska"}`
          },
          {
            role: "user",
            content: `Fråga: ${question}\n\nFörväntat svar: ${expectedAnswer}\n\nElevens svar: ${userAnswer}`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "grade_answer",
              description: "Grade a student answer",
              parameters: {
                type: "object",
                properties: {
                  correct: { type: "boolean", description: "Whether the answer is correct" },
                  feedback: { type: "string", description: "Brief feedback in Swedish" }
                },
                required: ["correct", "feedback"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "grade_answer" } },
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      throw new Error(`AI error: ${status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Fallback: try to parse content as JSON
    const content = data.choices?.[0]?.message?.content || '';
    try {
      const parsed = JSON.parse(content);
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } catch {
      return new Response(JSON.stringify({ correct: false, feedback: "Kunde inte bedöma svaret." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  } catch (e) {
    console.error("grade-answer error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});

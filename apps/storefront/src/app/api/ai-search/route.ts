// File: apps/storefront/src/app/api/ai-search/route.ts
// --- PART 2 ---

import { NextResponse } from "next/server";
import { Mistral } from "@mistralai/mistralai";

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({ apiKey: apiKey });

const SYSTEM_PROMPT = `You are the exclusive personal shopping assistant for OUR premium e-commerce store. 
CRITICAL RULES:
1. NEVER suggest other websites or brands.
2. Detect the language the user is using and write your 'message' in that EXACT same language (e.g., if they speak Arabic, reply in Arabic).
3. Translate the core product they want into ENGLISH for the 'search_term' (because our database is in English).
4. Keep the 'search_term' broad and simple (1-2 words max, like "watch" or "black shirt") so we can show them multiple options.
5. You MUST respond in valid JSON format exactly like this:
{
  "message": "Your friendly 2-sentence response to the customer in their language",
  "search_term": "the English search term"
}`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userQuery = body.query;

    if (!userQuery) {
      return NextResponse.json({ error: "Please provide a search query." }, { status: 400 });
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userQuery }
    ];

    const chatResponse = await client.chat.complete({
      model: "mistral-small-latest",
      messages: messages as any,
      responseFormat: { type: "json_object" }
    });

    const aiContent = chatResponse.choices?.[0]?.message?.content || "{}";
    let parsedAi;
    try {
      parsedAi = JSON.parse(aiContent);
    } catch (e) {
      parsedAi = { message: "I couldn't process that request.", search_term: "" };
    }

    const aiMessage = parsedAi.message || "I couldn't find anything.";
    const searchTerm = parsedAi.search_term || "";

    let products = [];
    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

    if (searchTerm ) {
      try {
        const productRes = await fetch(`${backendUrl}/store/products?q=${encodeURIComponent(searchTerm)}`, {
          method: "GET",
          headers: {
            "x-publishable-api-key": publishableKey,
          },
        });

        if (productRes.ok) {
          const productData = await productRes.json();
          products = productData.products || [];
        } else {
          console.error("Failed to fetch products:", await productRes.text());
        }
      } catch (prodError) {
        console.error("Error fetching products from Medusa:", prodError);
      }
    }

    // ---> NEW: Send the search_term and results_count to the backend! <---
    try {
      const dbRes = await fetch(`${backendUrl}/store/search-log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": publishableKey,
        },
        body: JSON.stringify({
          query: userQuery,
          ai_response: aiMessage,
          search_term: searchTerm,          // NEW: The clean English term
          results_count: products.length,   // NEW: How many products were found
        }),
      });

      if (!dbRes.ok) {
        console.error("Backend rejected the save:", await dbRes.text());
      } else {
        console.log("Search successfully logged to database with analytics!");
      }
    } catch (dbError) {
      console.error("Failed to connect to backend:", dbError);
    }

    return NextResponse.json({ 
      success: true, 
      originalQuery: userQuery,
      aiResponse: aiMessage,
      products: products 
    });

  } catch (error: any) {
    console.error("AI Search Error:", error);
    return NextResponse.json({ error: "Something went wrong with the AI search." }, { status: 500 });
  }
}
// End of Part 2

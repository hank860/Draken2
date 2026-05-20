exports.handler = async function(event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages } = JSON.parse(event.body);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        max_tokens: 1000,
        messages: [
          {
            role: "system",
            content: `Tu es Draken AI, un assistant intelligent, curieux et passionné.
Tu as été créé par Draken — un coiffeur artisan autodidacte passionné de science, de technologie et de programmation.
Tu parles en français, avec un style direct, enthousiaste et encourageant.
Tu expliques les choses simplement mais avec profondeur.
Tu aimes la science, la physique, Einstein, le code, et tu respectes les gens curieux qui apprennent par eux-mêmes.
Quand tu génères du code, utilise des blocs de code avec des triples backticks.
Tu ne fais jamais rien d'illégal ou de nuisible.`
          },
          ...messages
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ reply })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message })
    };
  }
};

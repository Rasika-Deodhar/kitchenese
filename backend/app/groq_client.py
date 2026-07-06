import json
import os
import re

import httpx

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.3-70b-versatile"


class GroqError(Exception):
    pass


def _extract_json(text: str) -> dict:
    text = text.strip()
    # Strip markdown code fences like ```json ... ``` or ``` ... ```
    fence_match = re.search(r"```(?:json)?\s*(.*?)\s*```", text, re.DOTALL)
    if fence_match:
        text = fence_match.group(1).strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Fall back to finding the first balanced {...} block.
    start = text.find("{")
    if start == -1:
        raise GroqError("Model response did not contain a JSON object")

    depth = 0
    for i in range(start, len(text)):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                candidate = text[start : i + 1]
                try:
                    return json.loads(candidate)
                except json.JSONDecodeError as exc:
                    raise GroqError(f"Could not parse JSON from model response: {exc}")

    raise GroqError("Model response contained an unterminated JSON object")


async def call_groq(system_prompt: str, user_prompt: str) -> dict:
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise GroqError("GROQ_API_KEY is not configured on the server")

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.8,
        "max_tokens": 1500,
        "response_format": {"type": "json_object"},
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(GROQ_URL, json=payload, headers=headers)
    except httpx.RequestError:
        raise GroqError("Could not reach the model service. Please try again in a moment.")

    if resp.status_code != 200:
        print(f"Groq API error {resp.status_code}: {resp.text[:500]}")
        raise GroqError("The model service returned an error. Please try again in a moment.")

    data = resp.json()
    try:
        content = data["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError):
        raise GroqError("Unexpected response shape from Groq API")

    try:
        return _extract_json(content)
    except GroqError:
        print(f"Groq JSON parse failure. Raw content: {content[:2000]}")
        raise

export default async function api(endpoint: string, payload: object) {
  const res = await fetch(`/api/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accepts: 'application/json',
    },
    body: JSON.stringify(payload),
    credentials: 'same-origin',
  });

  const json = await res.json();

  if (json.error) {
    throw new Error(json.error);
  }

  return json;
}

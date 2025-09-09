export function verifyEmailTemplate(link) {
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:auto">
    <h2>Verify your Email</h2>
    <p>Press the link to verify your Email (expired in 30 minutes):</p>
    <p><a href="${link}" style="display:inline-block;padding:10px 16px;border-radius:8px;background:#111;color:#fff;text-decoration:none">Verify Email</a></p>
    <p>If you don't request it, skipping this email.</p>
  </div>`;
}

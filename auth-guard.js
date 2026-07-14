// auth-guard.js
// Inclua este script no <head> de TODAS as páginas internas do sistema
// (dashboard, chamados, base de conhecimento etc.), depois da lib do Supabase:
//
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
// <script src="auth-guard.js"></script>

(function () {
  const SUPABASE_URL = 'SUA_SUPABASE_URL';
  const SUPABASE_ANON_KEY = 'SUA_SUPABASE_ANON_KEY';

  // Mesma lista de restrição usada no login.html
  const ALLOWED_EMAILS = [];

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  function isAllowed(email) {
    if (ALLOWED_EMAILS.length === 0) return true;
    return ALLOWED_EMAILS.includes(email);
  }

  async function guard() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = '/login.html';
      return;
    }

    if (!isAllowed(session.user.email)) {
      await supabase.auth.signOut();
      window.location.href = '/login.html';
      return;
    }

    // Sessão válida — expõe usuário e função de logout globalmente
    window.currentUser = session.user;
  }

  // Reage a logout/expiração em tempo real
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' || !session) {
      window.location.href = '/login.html';
    }
  });

  window.logout = async function () {
    await supabase.auth.signOut();
    window.location.href = '/login.html';
  };

  guard();
})();

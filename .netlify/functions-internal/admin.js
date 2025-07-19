// functions-internal/admin.js

exports.handler = async function(event, context) {
  if (event.httpMethod === 'POST') {
    // 로그인 처리 로직 (예시: 요청 본문에서 이메일, 패스워드 받아서 로그인 처리)
    const { email, password } = JSON.parse(event.body);

    // 로그인 처리 로직 작성 (예: 이메일, 패스워드 검증)
    // 이 부분에서 Supabase 인증 등을 처리할 수 있음

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'POST request received', email }),
    };
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }
};

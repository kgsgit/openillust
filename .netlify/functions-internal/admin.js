// functions-internal/admin.js

exports.handler = async function(event, context) {
  if (event.httpMethod === 'POST') {
    // 로그인 처리 로직 (여기에 로그인 처리 코드 작성)
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'POST request received' }),
    };
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }
};

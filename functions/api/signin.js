export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // 转发请求到Workers API
    const baseUrl = (env.API_WORKER_URL || 'https://cherrysopenbiocrad.gudupao2022-eae.workers.dev').replace(/\/$/, '');
    const targetUrl = `${baseUrl}/signin`;

    const newRequest = new Request(targetUrl, {
      method: 'POST',
      headers: request.headers,
      body: request.body
    });

    const response = await fetch(newRequest);

    // 添加CORS头
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.CORS_ALLOWED_ORIGIN || 'https://openbiocard-web.pages.dev',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    };

    // 创建新的响应，添加CORS头
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        ...corsHeaders
      }
    });

    return newResponse;
  } catch (error) {
    console.error('Signin API error:', error);

    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: 'Failed to process signin request'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': env.CORS_ALLOWED_ORIGIN || 'https://openbiocard-web.pages.dev',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }
}
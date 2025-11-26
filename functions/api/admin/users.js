export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // 检查是否是创建用户请求（有body）还是获取用户列表请求
    const url = new URL(request.url);
    const isCreateUser = request.headers.get('Content-Type')?.includes('application/json') &&
                        request.body;

    let targetUrl;
    if (isCreateUser) {
      // 创建用户
      targetUrl = `${env.API_WORKER_URL || 'https://cherrysopenbiocrad.gudupao2022-eae.workers.dev'}/admin/users`;
    } else {
      // 获取用户列表
      targetUrl = `${env.API_WORKER_URL || 'https://cherrysopenbiocrad.gudupao2022-eae.workers.dev'}/admin/users/list`;
    }

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
    console.error('Admin users API error:', error);

    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: 'Failed to process admin users request'
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
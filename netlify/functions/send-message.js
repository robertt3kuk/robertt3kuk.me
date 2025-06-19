// Simple message handler - in production, you'd integrate with email/telegram services
exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    
    // Validate required fields
    if (!data.message || data.message.trim().length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Message is required' })
      };
    }

    // In production, you would:
    // 1. Send email using SendGrid, SES, or similar
    // 2. Send telegram message using Telegram Bot API
    // 3. Store in database if needed
    
    // For now, we'll just log and return success
    console.log('New message received:', {
      message: data.message,
      timestamp: data.timestamp,
      userAgent: data.userAgent,
      ip: event.headers['x-forwarded-for'] || event.headers['client-ip']
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'Message sent successfully'
      })
    };
  } catch (error) {
    console.error('Error processing message:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process message' })
    };
  }
};
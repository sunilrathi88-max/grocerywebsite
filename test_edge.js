const main = async () => {
  try {
    const response = await fetch(
      'https://rzhdyvdttbeczyavrcvh.supabase.co/functions/v1/create-cashfree-order',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: 'http://127.0.0.1:5173',
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6aGR5dmR0dGJlY3p5YXZyY3ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MTgyMDEsImV4cCI6MjA3NzM5NDIwMX0.7N_Z-f7wp0MVhdQFaPoqzdmtI77kZtaiU7lQ3uo0u_8`,
        },
        body: JSON.stringify({
          order_amount: 470,
          customer_id: 'test_123',
          customer_phone: '9999999999',
          customer_name: 'Test User',
          customer_email: 'test@example.com',
        }),
      }
    );

    const data = await response.json();
    console.log('STATUS', response.status);
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  }
};
main();

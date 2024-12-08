const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db('your_app_db');
    const collection = database.collection('orders');

    const orders = await collection.find({}).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(orders),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: 'Error fetching orders' };
  } finally {
    await client.close();
  }
};

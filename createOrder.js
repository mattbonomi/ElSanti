const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const data = JSON.parse(event.body);
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db('your_app_db');
    const collection = database.collection('orders');

    const result = await collection.insertOne(data);

    return {
      statusCode: 200,
      body: JSON.stringify({ id: result.insertedId }),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: 'Error creating order' };
  } finally {
    await client.close();
  }
};

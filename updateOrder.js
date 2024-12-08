const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI;

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'PUT') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const data = JSON.parse(event.body);
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db('your_app_db');
    const collection = database.collection('orders');

    const result = await collection.updateOne(
      { _id: ObjectId(data.id) },
      { $set: data.update }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ matchedCount: result.matchedCount, modifiedCount: result.modifiedCount }),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: 'Error updating order' };
  } finally {
    await client.close();
  }
};
